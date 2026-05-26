import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { findNodeRecursively } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "../stores/AnalysisGameStore";
import useAnalysisBoardStore from "../stores/AnalysisBoardStore";
import useRealtimeEngineStore from "../stores/RealtimeEngineStore";
import useAICommentaryStore from "../stores/AICommentaryStore";
import useAnalysisTabStore from "../stores/AnalysisTabStore";
import AnalysisTab from "../constants/AnalysisTab";
import { getArchivedGame } from "@/lib/gameArchive";

function useGameLoader() {
    const [ searchParams ] = useSearchParams();

    const { setAnalysisGame, setGameAnalysisOpen } = useAnalysisGameStore(
        useShallow(state => ({
            setAnalysisGame: state.setAnalysisGame,
            setGameAnalysisOpen: state.setGameAnalysisOpen
        }))
    );

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

    const setDisplayedEngineLines = useRealtimeEngineStore(
        state => state.setDisplayedEngineLines
    );

    const { setBatchCommentaries, setAiCoachEnabled, clearCommentaries } = useAICommentaryStore();
    const setActiveTab = useAnalysisTabStore(state => state.setActiveTab);

    async function loadGame() {
        const gameId = searchParams.get("game");
        if (!gameId) return;

        const { game } = await getArchivedGame(gameId);
        if (!game) return;

        // Restore AI commentaries if they were saved with this game
        const savedCommentaries = (game as unknown as Record<string, unknown>).aiCommentaries as
            Record<string, string> | undefined;

        clearCommentaries();

        if (savedCommentaries && Object.keys(savedCommentaries).length > 0) {
            setBatchCommentaries(savedCommentaries);
            setAiCoachEnabled(true);

            // Navigate to the first node that has AI commentary so it's immediately visible
            const firstCommentaryNodeId = Object.keys(savedCommentaries)[0];
            const firstNode = findNodeRecursively(
                game.stateTree,
                n => n.id === firstCommentaryNodeId
            );
            if (firstNode) {
                setGameAnalysisOpen(true);
                setAnalysisGame(game);
                setCurrentStateTreeNode(firstNode);
                setDisplayedEngineLines(firstNode.state.engineLines);
                setActiveTab(AnalysisTab.ANALYSIS);
                return;
            }
        }

        setGameAnalysisOpen(true);
        setAnalysisGame(game);
        setCurrentStateTreeNode(game.stateTree);
        setDisplayedEngineLines(game.stateTree.state.engineLines);
    }

    useEffect(() => {
        loadGame();
    }, []);
}

export default useGameLoader;
