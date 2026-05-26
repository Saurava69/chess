import { useEffect, useRef } from "react";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import { getTopEngineLine } from "shared/types/game/position/EngineLine";
import useAICommentaryStore from "@analysis/stores/AICommentaryStore";

function formatEvalValue(type: "centipawn" | "mate", value: number): string {
    if (type === "mate") return `Mate in ${Math.abs(value)}`;
    const cp = (value / 100).toFixed(2);
    return value >= 0 ? `+${cp}` : cp;
}

function useGenerateCommentary(currentNode: StateTreeNode) {
    const { aiCoachEnabled, commentaries, setCommentary, appendCommentaryToken } = useAICommentaryStore();

    // Track the latest node to prevent stale closures overwriting newer commentary
    const latestNodeIdRef = useRef<string>("");

    useEffect(() => {
        if (!aiCoachEnabled) return;
        if (!currentNode.state.move) return;       // root node — no move to comment on
        if (!currentNode.state.classification) return; // engine hasn't classified yet

        const nodeId = currentNode.id;

        // Already fetched or in progress
        if (commentaries[nodeId]) return;

        latestNodeIdRef.current = nodeId;

        // Mark as loading
        setCommentary(nodeId, { status: "loading", text: "" });

        // Build eval strings from parent (eval before the move) and current node
        const evalBefore = (() => {
            const line = getTopEngineLine(currentNode.parent?.state.engineLines ?? []);
            if (!line) return undefined;
            return formatEvalValue(line.evaluation.type, line.evaluation.value);
        })();

        const evalAfter = (() => {
            const line = getTopEngineLine(currentNode.state.engineLines);
            if (!line) return undefined;
            return formatEvalValue(line.evaluation.type, line.evaluation.value);
        })();

        // Best move from parent's engine lines (what engine recommended)
        const bestMoveSan = (() => {
            const line = getTopEngineLine(currentNode.parent?.state.engineLines ?? []);
            const uci = line?.moves.at(0)?.uci;
            if (!uci || !currentNode.parent) return undefined;
            // The best move SAN comes from current node comparison — just use the uci notation
            // ClassifiedMoveCard already resolves it; use the engineLine move san if available
            return line?.moves.at(0)?.san;
        })();

        const payload = {
            moveSan:        currentNode.state.move.san,
            moveColour:     currentNode.state.moveColour ?? "white",
            classification: currentNode.state.classification,
            fen:            currentNode.state.fen,
            evalBefore,
            evalAfter,
            bestMoveSan,
            opening:        currentNode.state.opening,
        };

        (async () => {
            try {
                const resp = await fetch("/api/ai/coach", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!resp.ok || !resp.body) {
                    throw new Error(`HTTP ${resp.status}`);
                }

                const reader  = resp.body.getReader();
                const decoder = new TextDecoder();
                let   buffer  = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        // Only update if this is still the current node
                        if (latestNodeIdRef.current !== nodeId) return;
                        try {
                            const event = JSON.parse(line.slice(6));
                            if (event.type === "token") {
                                appendCommentaryToken(nodeId, event.text);
                            } else if (event.type === "complete") {
                                useAICommentaryStore.getState().setCommentary(nodeId, {
                                    status: "done",
                                    text: useAICommentaryStore.getState().commentaries[nodeId]?.text ?? "",
                                });
                            } else if (event.type === "error") {
                                useAICommentaryStore.getState().setCommentary(nodeId, {
                                    status: "error",
                                    text: event.message ?? "Coach unavailable",
                                });
                            }
                        } catch { /* skip */ }
                    }
                }
            } catch (err: unknown) {
                if (latestNodeIdRef.current !== nodeId) return;
                useAICommentaryStore.getState().setCommentary(nodeId, {
                    status: "error",
                    text: err instanceof Error ? err.message : "Coach unavailable",
                });
            }
        })();

    }, [currentNode.id, currentNode.state.classification, aiCoachEnabled]);
}

export default useGenerateCommentary;
