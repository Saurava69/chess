import { Chess } from "chess.js";
import { components } from "@lichess-org/types";

import { EngineLine } from "shared/types/game/position/EngineLine";
import Move from "shared/types/game/position/Move";
import EngineVersion from "shared/constants/EngineVersion";
import { lichessCastlingMoves } from "shared/constants/utils";

type CloudEvaluation = components["schemas"]["CloudEval"];

async function getCloudEvaluation(fen: string, targetCount = 1) {
    const cloudResponse = await fetch(
        "https://lichess.org/api/cloud-eval"
        + `?fen=${fen}&multiPv=${targetCount}`
    );

    if (!cloudResponse.ok) {
        throw Error(`cloud evaluation failed (${cloudResponse.status})`);
    }

    const cloudEvaluation: CloudEvaluation = await cloudResponse.json();

    // Guard: API returned no variations
    if (!cloudEvaluation?.pvs?.length) return [];

    const engineLines: EngineLine[] = [];

    for (const variation of cloudEvaluation.pvs) {
        // Skip variations with no evaluation score
        const hasMate = "mate" in variation && variation.mate != null;
        const hasCp   = "cp"   in variation && variation.cp   != null;
        if (!hasMate && !hasCp) continue;

        const variationBoard = new Chess(fen);
        const lineMoves: Move[] = [];

        for (const lichessUciMove of (variation.moves ?? "").split(" ")) {
            if (!lichessUciMove) continue;

            const uciMove = lichessCastlingMoves[lichessUciMove] || lichessUciMove;

            try {
                const parsedMove = variationBoard.move(uciMove);
                lineMoves.push({
                    san: parsedMove.san,
                    uci: parsedMove.lan
                });
            } catch {
                break;
            }
        }

        const evalValue: number = hasMate
            ? (variation.mate as number)
            : (variation.cp as number);

        engineLines.push({
            evaluation: {
                type: hasMate ? "mate" : "centipawn",
                value: evalValue
            },
            source: EngineVersion.LICHESS_CLOUD,
            depth: cloudEvaluation.depth ?? 0,
            index: cloudEvaluation.pvs.indexOf(variation) + 1,
            moves: lineMoves
        });
    }

    return engineLines;
}

export default getCloudEvaluation;
