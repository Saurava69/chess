import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";

import connectDatabase from "../server/src/database/connect";
import hostnameWhitelist from "../server/src/lib/security/whitelist";
import getAuth from "../server/src/lib/auth";
import mainRouter from "../server/src/routes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cookieParser());
app.use(hostnameWhitelist);

// Auth routes
app.all("/auth/*", toNodeHandler(getAuth()));

// API routes
app.use("/", mainRouter);

// Connect to database once
let dbConnected = false;

const handler = async (req: VercelRequest, res: VercelResponse) => {
    try {
        // Connect to database if not already connected
        if (!dbConnected) {
            await connectDatabase();
            dbConnected = true;
        }

        // Handle the request with Express
        return app(req as any, res as any);
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default handler;