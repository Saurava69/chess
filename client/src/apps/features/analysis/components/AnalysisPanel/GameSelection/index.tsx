import React, { useState } from "react";

import useGameSelector from "@/hooks/useGameSelector";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import useAICommentaryStore from "@analysis/stores/AICommentaryStore";
import { useAuthedProfile } from "@/hooks/api/useProfile";
import GameSelector from "@/components/chess/GameSelector";
import LogMessage from "@/components/common/LogMessage";

import useImportGame from "@analysis/hooks/useImportGame";
import useEvaluateGame from "@analysis/hooks/useEvaluateGame";
import AnalyseButton from "../../AnalyseButton";
import * as styles from "./GameSelection.module.css";

function GameSelection() {
    const { setSelectedGame } = useGameSelector();

    const setEvaluationController = useAnalysisProgressStore(
        state => state.setEvaluationController
    );

    const { setAiCoachEnabled, clearCommentaries } = useAICommentaryStore();
    const { status: profileStatus } = useAuthedProfile();
    const isSignedIn = profileStatus === "success";

    const [ statusMessage, setStatusMessage ] = useState<string>();
    const [ importError, setImportError ] = useState<string>();

    const importSelectedGame = useImportGame();
    const evaluateGame = useEvaluateGame();

    async function onAnalyseClick(withAI = false) {
        setImportError(undefined);
        clearCommentaries();
        setAiCoachEnabled(withAI);

        try {
            var importedGame = await importSelectedGame(setStatusMessage);
        } catch (err) {
            return setImportError((err as Error).message);
        }

        const controller = await evaluateGame(importedGame);

        setEvaluationController(controller);
    }

    return <>
        <GameSelector
            saveLocalStorage
            onGameSelect={setSelectedGame}
        />

        <div className={styles.buttonRow}>
            <AnalyseButton onClick={() => onAnalyseClick(false)} />
            {isSignedIn
                ? <button
                    className={styles.aiAnalyseBtn}
                    onClick={() => onAnalyseClick(true)}
                >
                    <span className={styles.aiSpark}>✦</span>
                    Analyse with AI
                </button>
                : <a href="/signin" className={styles.aiSignInBtn}>
                    <span className={styles.aiSpark}>✦</span>
                    Sign in to Analyse with AI
                </a>
            }
        </div>

        {statusMessage && <i className={styles.statusMessage}>
            {statusMessage}
        </i>}

        {importError && <LogMessage>
            {importError}
        </LogMessage>}
    </>;
}

export default GameSelection;