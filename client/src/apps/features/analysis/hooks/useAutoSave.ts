import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAICommentaryStore from "@analysis/stores/AICommentaryStore";
import { useAuthedProfile } from "@/hooks/api/useProfile";
import { archiveGame } from "@/lib/gameArchive";

/**
 * Automatically saves the analysed game after Stockfish analysis completes.
 * Only fires when aiCoachEnabled is false — the AI batch hook handles saving
 * when AI analysis is enabled (so commentaries are included in the save).
 */
function useAutoSave() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { status: profileStatus }         = useAuthedProfile();
    const analysisStatus                    = useAnalysisProgressStore(s => s.analysisStatus);
    const { analysisGame }                  = useAnalysisGameStore();
    const { aiCoachEnabled }                = useAICommentaryStore();

    const prevStatusRef = useRef<AnalysisStatus>(AnalysisStatus.INACTIVE);

    useEffect(() => {
        const prev = prevStatusRef.current;
        prevStatusRef.current = analysisStatus;

        // Only on AWAITING_CAPTCHA → INACTIVE (classification just finished)
        if (prev !== AnalysisStatus.AWAITING_CAPTCHA || analysisStatus !== AnalysisStatus.INACTIVE) return;

        // Only save for logged-in users
        if (profileStatus !== "success") return;

        // AI mode: let useBatchCommentaryGeneration handle the save (with commentaries)
        if (aiCoachEnabled) return;

        const existingId = searchParams.get("game") ?? undefined;

        (async () => {
            const result = await archiveGame(analysisGame, existingId);
            if (!result.id) return;

            setSearchParams(prev => ({
                ...Object.fromEntries(prev.entries()),
                game: result.id!,
            }), { replace: true });
        })();

    }, [analysisStatus]);
}

export default useAutoSave;
