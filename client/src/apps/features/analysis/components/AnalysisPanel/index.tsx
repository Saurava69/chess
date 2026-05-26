import React, { lazy, Suspense } from "react";

import AnalysisTab from "@analysis/constants/AnalysisTab";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisTabStore from "@analysis/stores/AnalysisTabStore";
import ClassifiedMoveCard from "@analysis/components/report/ClassifiedMoveCard";
import StateTreeTraverser from "@/components/chess/StateTreeTraverser";
import useBatchCommentaryGeneration from "@analysis/hooks/useBatchCommentaryGeneration";
import useAutoSave from "@analysis/hooks/useAutoSave";

import TabBar from "./TabBar";
import AnalysisProgress from "./AnalysisProgress";
import RealtimeEngineArea from "./RealtimeEngineArea";

import GameSelection from "./GameSelection";
import GameReport from "./GameReport";
import GameAnalysis from "./GameAnalysis";
import AIChat from "./AIChat";

import AnalysisPanelProps from "./AnalysisPanelProps";
import * as styles from "./AnalysisPanel.module.css";

const OptionsToolbar = lazy(() => import("@analysis/components/OptionsToolbar"));

function AnalysisPanel({
    className,
    style
}: AnalysisPanelProps) {
    const settings = useSettingsStore(state => state.settings.analysis);

    const gameAnalysisOpen = useAnalysisGameStore(
        state => state.gameAnalysisOpen
    );

    const currentNode = useAnalysisBoardStore(
        state => state.currentStateTreeNode
    );

    const { activeTab } = useAnalysisTabStore();

    // Generates AI coaching commentary for all mainline moves after analysis completes
    useBatchCommentaryGeneration();
    // Auto-saves the game after Stockfish analysis (non-AI mode)
    useAutoSave();

    return <div
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        {/* ── Fixed header: toolbar + tabs ─────────────────── */}
        <div className={styles.header}>
            <Suspense fallback={<div style={{ height: "48px" }} />}>
                <OptionsToolbar/>
            </Suspense>
            {gameAnalysisOpen && <TabBar/>}
        </div>

        {/* ── Scrollable content ────────────────────────────── */}
        <div className={styles.components}>

            <AnalysisProgress/>

            {(gameAnalysisOpen && settings.engine.enabled)
                && <RealtimeEngineArea/>
            }

            {gameAnalysisOpen
                && currentNode.state.move
                && !settings.classifications.hide
                && (
                    settings.engine.enabled
                    || currentNode.state.classification
                )
                && <ClassifiedMoveCard/>
            }

            {gameAnalysisOpen
                ? (activeTab == AnalysisTab.AI_CHAT
                    ? <AIChat/>
                    : activeTab == AnalysisTab.REPORT
                        ? <GameReport/>
                        : <GameAnalysis/>
                )
                : <GameSelection/>
            }
        </div>

        {/* ── Fixed footer: move traverser ──────────────────── */}
        <div className={styles.traverserContainer}>
            <StateTreeTraverser className={styles.traverser} />
        </div>
    </div>;
}

export default AnalysisPanel;