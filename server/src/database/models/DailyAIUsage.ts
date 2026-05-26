import { Types, Schema, model } from "mongoose";
import Collection from "@/constants/Collection";

interface DailyAIUsageDocument {
    userId:        Types.ObjectId;
    date:          string;   // "YYYY-MM-DD" UTC
    analysisCount: number;
    chatCount:     number;
    expiresAt:     Date;
}

const dailyAIUsageSchema = new Schema<DailyAIUsageDocument>({
    userId:        { type: Schema.Types.ObjectId, required: true },
    date:          { type: String, required: true },
    analysisCount: { type: Number, default: 0 },
    chatCount:     { type: Number, default: 0 },
    expiresAt:     { type: Date, required: true },
});

// Unique constraint: one document per user per day
dailyAIUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

// MongoDB TTL — auto-deletes the document after expiresAt
dailyAIUsageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const DailyAIUsage = model<DailyAIUsageDocument>(
    "dailyAIUsage",
    dailyAIUsageSchema,
    Collection.DAILY_AI_USAGE
);

export default DailyAIUsage;
