import { RequestHandler } from "express";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

import { accountAuthenticator } from "./account";
import DailyAIUsage from "@/database/models/DailyAIUsage";

const LIMITS = {
    analysis: 2,
    chat:     10,
} as const;

type AILimitType = keyof typeof LIMITS;

/**
 * Returns [accountAuthenticator, rateLimitChecker] middleware pair.
 * - Rejects with 401 if user is not signed in.
 * - Rejects with 429 if daily limit is exceeded.
 *
 * Uses a single atomic findOneAndUpdate to prevent TOCTOU race conditions.
 *
 * IMPORTANT: $setOnInsert must NOT include the same field as $inc.
 * MongoDB throws ConflictingUpdateOperators if both operators target the same
 * path — which would cause .catch(() => null) to always return 429.
 */
export function aiLimiter(type: AILimitType): RequestHandler[] {
    const limit           = LIMITS[type];
    const countField      = type === "analysis" ? "analysisCount" : "chatCount";
    const otherCountField = type === "analysis" ? "chatCount"     : "analysisCount";

    const checker: RequestHandler = async (req, res, next) => {
        const userId = new Types.ObjectId(req.user!.id);
        const today  = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" UTC

        // Next UTC midnight
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);

        // Atomic check-and-increment.
        // On INSERT: $inc initialises countField to 1 (MongoDB treats $inc on a
        //   missing field as starting from 0). $setOnInsert initialises the
        //   OTHER counter to 0 and sets expiresAt. NO field overlap with $inc.
        // On UPDATE: $inc increments the matching document; $setOnInsert is a no-op.
        // On limit exceeded: query filter ($lt: limit) finds no match, upsert
        //   tries to insert, unique index (userId + date) blocks the duplicate →
        //   throws a duplicate-key error → .catch returns null → 429.
        const result = await DailyAIUsage.findOneAndUpdate(
            { userId, date: today, [countField]: { $lt: limit } },
            {
                $inc: { [countField]: 1 },
                $setOnInsert: {
                    [otherCountField]: 0,
                    expiresAt: tomorrow,
                }
            },
            { upsert: true, new: true }
        ).catch(() => null);

        if (!result) {
            return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
                error:    "Daily AI limit reached",
                type,
                limit,
                resetsAt: tomorrow.toISOString(),
            });
        }

        next();
    };

    return [accountAuthenticator(), checker];
}
