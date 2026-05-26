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
 * - Uses a single atomic findOneAndUpdate to prevent TOCTOU race conditions.
 */
export function aiLimiter(type: AILimitType): RequestHandler[] {
    const limit      = LIMITS[type];
    const countField = type === "analysis" ? "analysisCount" : "chatCount";

    const checker: RequestHandler = async (req, res, next) => {
        const userId = new Types.ObjectId(req.user!.id);
        const today  = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" UTC

        // Next UTC midnight — documents expire then
        const tomorrow = new Date();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);

        // Atomic: upsert today's record AND increment in one round-trip,
        // but only if the current count is below the limit.
        // We use $inc on $setOnInsert to handle the insert path, and
        // a separate conditional update for the existing-document path.
        const result = await DailyAIUsage.findOneAndUpdate(
            { userId, date: today, [countField]: { $lt: limit } },
            {
                $inc: { [countField]: 1 },
                $setOnInsert: {
                    userId,
                    date:          today,
                    analysisCount: 0,
                    chatCount:     0,
                    expiresAt:     tomorrow,
                }
            },
            { upsert: true, new: true }
        ).catch(() => null); // upsert throws if unique constraint hit & condition fails

        if (!result) {
            // Condition `$lt: limit` was not met — limit reached
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
