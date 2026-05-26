import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { addChildMove } from "shared/types/game/position/StateTreeNode";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import EngineLineProps from "./EngineLineProps";
import * as styles from "./EngineLine.module.css";

import iconInterfaceExpandarrow from "@assets/img/interface/expand_arrow.svg";

function EngineLine({ line }: EngineLineProps) {
    const { t } = useTranslation("analysis");

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode
    } = useAnalysisBoardStore();

    const [ expanded, setExpanded ] = useState(false);

    const engineLineRef = useRef<HTMLDivElement>(null);

    useEffect(
        () => setExpanded(false),
        [currentStateTreeNode]
    );

    function traverseToLineMove(targetIndex: number) {
        let currentNode = currentStateTreeNode;

        for (let moveIndex = 0; moveIndex <= targetIndex; moveIndex++) {
            currentNode = addChildMove(currentNode, line.moves[moveIndex].san);
        }

        setCurrentStateTreeNode(currentNode);

        playBoardSound(currentNode);
    }

    return <div
        className={styles.engineLine}
        style={{
            height: expanded ? engineLineRef.current?.scrollHeight : "25px"
        }}
        ref={engineLineRef}
    >
        <span
            className={styles.evaluation}
            style={{
                backgroundColor: line.evaluation.value >= 0
                    ? "rgba(129,182,76,0.18)"
                    : "rgba(201,50,48,0.18)",
                color: line.evaluation.value >= 0
                    ? "var(--ui-green-hover)"
                    : "#e05555",
                border: `1px solid ${line.evaluation.value >= 0 ? "rgba(129,182,76,0.3)" : "rgba(201,50,48,0.3)"}`
            }}
        >
            {
                line.evaluation.type == "centipawn"
                    ? Math.abs(line.evaluation.value / 100).toFixed(2)
                    : (
                        line.evaluation.value == 0
                            ? t("realtimeEngine.checkmate")
                            : `M${Math.abs(line.evaluation.value)}`
                    )
            }
        </span>

        {
            line.moves.map((move, index) => (
                <span
                    className={styles.lineMove}
                    onClick={() => traverseToLineMove(index)}
                >
                    {move.san}
                </span>
            ))
        }

        <div className={styles.expandArrowContainer}>
            <img
                className={styles.expandArrow}
                src={iconInterfaceExpandarrow}
                width={20}
                onClick={() => setExpanded(!expanded)}
                style={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)"
                }}
            />
        </div>
    </div>;
}

export default EngineLine;