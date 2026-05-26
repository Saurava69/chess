import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import { getTopEngineLine } from "shared/types/game/position/EngineLine";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import useAICommentaryStore from "@analysis/stores/AICommentaryStore";
import { useAuthedProfile } from "@/hooks/api/useProfile";
import { archiveGame } from "@/lib/gameArchive";

// Only these classifications get AI coaching — the rest are self-explanatory
const COACH_CLASSIFICATIONS = new Set([
    "brilliant", "critical", "inaccuracy", "mistake", "blunder", "risky",
]);

function formatEval(type: "centipawn" | "mate", value: number): string {
    if (type === "mate") return `Mate in ${Math.abs(value)}`;
    const cp = (value / 100).toFixed(2);
    return value >= 0 ? `+${cp}` : cp;
}

/**
 * After server analysis completes (AWAITING_CAPTCHA → INACTIVE), collects all
 * notable mainline moves and sends them in ONE batch request to /api/ai/coachBatch.
 * The AI returns all commentaries as a single JSON response.
 * When the batch completes, the game is auto-saved with AI commentary included.
 */
function useBatchCommentaryGeneration() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { status: profileStatus }         = useAuthedProfile();
    const { aiCoachEnabled }                = useAICommentaryStore();
    const analysisStatus                    = useAnalysisProgressStore(state => state.analysisStatus);
    const { analysisGame }                  = useAnalysisGameStore();

    const prevStatusRef = useRef<AnalysisStatus>(AnalysisStatus.INACTIVE);

    useEffect(() => {
        const prev = prevStatusRef.current;
        prevStatusRef.current = analysisStatus;

        // Only fire on the AWAITING_CAPTCHA → INACTIVE transition (analysis just completed)
        const justFinished =
            prev === AnalysisStatus.AWAITING_CAPTCHA &&
            analysisStatus === AnalysisStatus.INACTIVE;

        if (!justFinished || !aiCoachEnabled) return;

        // Collect notable mainline moves
        const notableNodes = getNodeChain(analysisGame.stateTree).filter(
            n => n.state.move && COACH_CLASSIFICATIONS.has(n.state.classification ?? "")
        );

        if (notableNodes.length === 0) return;

        // Mark all as loading immediately so the UI shows the waiting state
        const { setCommentary, setBatchCommentaries } = useAICommentaryStore.getState();
        for (const node of notableNodes) {
            setCommentary(node.id, { status: "loading", text: "" });
        }

        // Build the payload
        const moves = notableNodes.map(node => {
            const evalBefore = (() => {
                const line = getTopEngineLine(node.parent?.state.engineLines ?? []);
                return line ? formatEval(line.evaluation.type, line.evaluation.value) : undefined;
            })();
            const evalAfter = (() => {
                const line = getTopEngineLine(node.state.engineLines);
                return line ? formatEval(line.evaluation.type, line.evaluation.value) : undefined;
            })();
            const bestMoveSan = getTopEngineLine(node.parent?.state.engineLines ?? [])?.moves.at(0)?.san;

            return {
                nodeId:         node.id,
                moveSan:        node.state.move!.san,
                side:           node.state.moveColour === "black" ? "Black" : "White",
                classification: node.state.classification ?? "unknown",
                evalBefore,
                evalAfter,
                bestMoveSan,
                opening:        node.state.opening,
            };
        });

        const existingId = searchParams.get("game") ?? undefined;

        (async () => {
            try {
                const resp = await fetch("/api/ai/coachBatch", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ moves }),
                });

                if (resp.status === 401) {
                    useAICommentaryStore.getState().setAIError("signin");
                    for (const node of notableNodes) {
                        useAICommentaryStore.getState().setCommentary(node.id, { status: "error", text: "" });
                    }
                    return;
                }

                if (resp.status === 429) {
                    useAICommentaryStore.getState().setAIError("limit_analysis");
                    for (const node of notableNodes) {
                        useAICommentaryStore.getState().setCommentary(node.id, { status: "error", text: "" });
                    }
                    return;
                }

                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                const data = await resp.json() as { commentaries?: Record<string, string>; error?: string };

                if (data.error || !data.commentaries) {
                    throw new Error(data.error ?? "No commentaries returned");
                }

                // Populate all at once
                setBatchCommentaries(data.commentaries);

                // Mark any notable nodes that weren't in the response as error
                for (const node of notableNodes) {
                    if (!data.commentaries[node.id]) {
                        useAICommentaryStore.getState().setCommentary(node.id, {
                            status: "error",
                            text: "No commentary returned",
                        });
                    }
                }

                // Auto-save with AI commentaries (only for logged-in users)
                if (profileStatus === "success") {
                    const doneCommentaries: Record<string, string> = {};
                    for (const [nodeId, text] of Object.entries(data.commentaries)) {
                        if (typeof text === "string") doneCommentaries[nodeId] = text;
                    }

                    const saveResult = await archiveGame(
                        useAnalysisGameStore.getState().analysisGame,
                        existingId,
                        Object.keys(doneCommentaries).length > 0 ? doneCommentaries : undefined
                    );

                    if (saveResult.id) {
                        setSearchParams(prev => ({
                            ...Object.fromEntries(prev.entries()),
                            game: saveResult.id!,
                        }), { replace: true });
                    }
                }

            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Coach unavailable";
                for (const node of notableNodes) {
                    useAICommentaryStore.getState().setCommentary(node.id, {
                        status: "error",
                        text: message,
                    });
                }
            }
        })();

    }, [analysisStatus]);
}

export default useBatchCommentaryGeneration;
