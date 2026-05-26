import { Router } from "express";
import express from "express";
import { z } from "zod";
import { callAI, AIMessage } from "@/lib/sap/aiCore";
import { aiLimiter } from "@/lib/security/aiLimiter";

// Strict validation — all user-controlled fields are whitelisted
const moveContextSchema = z.object({
    nodeId:         z.string().max(64).regex(/^[a-zA-Z0-9_-]+$/),
    moveSan:        z.string().max(10).regex(/^[a-zA-Z0-9+#=!?-]{1,10}$/),
    side:           z.enum(["White", "Black"]),
    classification: z.enum(["brilliant","critical","best","excellent","okay","inaccuracy","mistake","blunder","theory","forced","risky","unknown"]),
    evalBefore:     z.string().max(20).regex(/^[+\-]?\d+(\.\d+)?$|^Mate in \d+$/).optional(),
    evalAfter:      z.string().max(20).regex(/^[+\-]?\d+(\.\d+)?$|^Mate in \d+$/).optional(),
    bestMoveSan:    z.string().max(10).regex(/^[a-zA-Z0-9+#=!?-]{1,10}$/).optional(),
    opening:        z.string().max(80).regex(/^[a-zA-Z0-9 ',.-]+$/).optional(),
});

const requestSchema = z.object({
    moves: z.array(moveContextSchema).min(1).max(30),
});

const router = Router();
const path = "/ai/coachBatch";

router.post(path, ...aiLimiter("analysis"), express.json({ limit: "32kb" }), async (req, res) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }

    const { moves } = parsed.data;

    const systemPrompt =
        `You are an expert chess coach reviewing a student's game.
For each move provided, write exactly 2–3 sentences of coaching commentary.
Be specific: name the exact move, reference concrete chess ideas (tactics, structure, piece activity, king safety).
For good moves (brilliant/critical): explain WHY it's strong.
For poor moves (inaccuracy/mistake/blunder): explain what went wrong and what should have been played instead.
For risky moves: explain the double-edged nature.

Return ONLY valid JSON — no markdown code fences, no extra text — in exactly this shape:
{ "nodeId1": "commentary text", "nodeId2": "commentary text", ... }`;

    // Build the prompt using JSON.stringify to safely encode all field values
    const moveList = JSON.stringify(moves.map(m => ({
        nodeId:         m.nodeId,
        move:           m.moveSan,
        side:           m.side,
        classification: m.classification,
        ...(m.evalBefore && m.evalAfter ? { eval: `${m.evalBefore} → ${m.evalAfter}` } : {}),
        ...(m.bestMoveSan && m.bestMoveSan !== m.moveSan ? { best: m.bestMoveSan } : {}),
        ...(m.opening ? { opening: m.opening } : {}),
    })));

    const messages: AIMessage[] = [{
        role: "user",
        content: `Analyse these moves and return JSON commentary:\n${moveList}`,
    }];

    try {
        const raw = await callAI(messages, systemPrompt);

        // Strip any accidental markdown fences the model may add
        const cleaned = raw.replace(/```(?:json)?/gi, "").trim();

        let commentaries: Record<string, string>;
        try {
            commentaries = JSON.parse(cleaned);
        } catch {
            res.status(500).json({ error: "AI processing failed" });
            return;
        }

        res.json({ commentaries });

    } catch {
        res.status(500).json({ error: "AI processing failed" });
    }
});

export default router;
