import { Router } from "express";
import express from "express";
import { z } from "zod";
import { streamAI, AIMessage } from "@/lib/sap/aiCore";
import { aiLimiter } from "@/lib/security/aiLimiter";

// FEN: only printable ASCII chess chars, no newlines or special chars
const fenPattern = /^[rnbqkpRNBQKP1-8/\s\w-]{10,100}$/;
// Eval: e.g. "+0.32", "-1.2", "Mate in 3"
const evalPattern = /^[+\-]?\d+(\.\d+)?$|^Mate in \d+$/;

const requestSchema = z.object({
    messages: z.array(z.object({
        role:    z.enum(["user", "assistant"]),
        content: z.string().max(2000),
    })).min(1).max(20),
    fen:        z.string().regex(fenPattern).optional(),
    engineEval: z.string().max(20).regex(evalPattern).optional(),
});

const router = Router();
const path = "/ai/chat";

router.post(path, ...aiLimiter("chat"), express.json({ limit: "32kb" }), async (req, res) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }

    const { messages, fen, engineEval } = parsed.data;

    const fenLine  = fen        ? `\nCurrent position (FEN): ${fen}` : "";
    const evalLine = engineEval ? `\nStockfish evaluation: ${engineEval}` : "";

    const systemPrompt =
        `You are a concise chess coach. Answer in plain English, 1–3 short paragraphs max.`
        + fenLine
        + evalLine
        + `\nFocus on practical advice — what to play, why, and what to watch out for.`;

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (obj: object) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

    try {
        await streamAI(messages as AIMessage[], systemPrompt, (event) => {
            if (event.type === "token") {
                send({ type: "token", text: event.data.text });
            } else if (event.type === "complete") {
                send({ type: "complete" });
            } else if (event.type === "error") {
                console.error("[ai/chat] SAP error:", event.data.message);
                send({ type: "error", message: "AI processing failed" });
            }
        });
    } catch (err: unknown) {
        console.error("[ai/chat] streamAI threw:", err instanceof Error ? err.message : err);
        send({ type: "error", message: "AI processing failed" });
    }

    res.end();
});

export default router;
