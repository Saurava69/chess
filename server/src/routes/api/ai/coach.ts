import { Router } from "express";
import express from "express";
import { streamAI, AIMessage } from "@/lib/sap/aiCore";
import { aiLimiter } from "@/lib/security/aiLimiter";

const router = Router();
const path = "/ai/coach";

router.post(path, ...aiLimiter("analysis"), express.json({ limit: "32kb" }), async (req, res) => {
    const {
        moveSan,
        moveColour,
        classification,
        evalBefore,
        evalAfter,
        bestMoveSan,
        opening,
        fen,
    } = req.body as {
        moveSan: string;
        moveColour: "white" | "black";
        classification: string;
        evalBefore?: string;
        evalAfter?: string;
        bestMoveSan?: string;
        opening?: string;
        fen?: string;
    };

    if (!moveSan || !classification) {
        res.status(400).json({ error: "moveSan and classification required" });
        return;
    }

    const side = moveColour === "white" ? "White" : "Black";
    const evalChange = (evalBefore && evalAfter)
        ? `\nEvaluation changed from ${evalBefore} to ${evalAfter}.`
        : "";
    const bestLine = (bestMoveSan && bestMoveSan !== moveSan)
        ? `\nThe engine's best move was ${bestMoveSan}.`
        : "";
    const openingCtx = opening ? `\nOpening: ${opening}.` : "";
    const fenCtx = fen ? `\nPosition FEN: ${fen}` : "";

    const systemPrompt =
        `You are an experienced chess coach giving real-time commentary as a student navigates their game.

Your style: warm, specific, instructive — like a grandmaster sitting beside them.
Keep every response to exactly 2–3 sentences. No bullet points, no headers.
Always name the specific move. Reference concrete chess concepts (development, center control, king safety, tactics, piece activity, pawn structure).

For brilliant/best/excellent moves: explain WHY it's strong — what it threatens, what weakness it exploits, what it prepares.
For inaccuracy/mistake/blunder: be honest but kind. Say what went wrong and what should have been played (use the best move if provided).
For theory/forced moves: briefly explain what phase of the opening or forced sequence this belongs to.`;

    const userContent =
        `${side} played ${moveSan}. Classification: ${classification}.`
        + evalChange
        + bestLine
        + openingCtx
        + fenCtx
        + `\n\nGive your coaching commentary for this move.`;

    const messages: AIMessage[] = [{ role: "user", content: userContent }];

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (obj: object) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

    try {
        await streamAI(messages, systemPrompt, (event) => {
            if (event.type === "token") {
                send({ type: "token", text: event.data.text });
            } else if (event.type === "complete") {
                send({ type: "complete" });
            } else if (event.type === "error") {
                send({ type: "error", message: event.data.message });
            }
        });
    } catch (err: unknown) {
        send({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }

    res.end();
});

export default router;
