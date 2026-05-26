import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

const whitelistedHostnames = [
    // Primary domain — bare and any subdomain
    /^chess\.sauravx\.com$/i,
    /^(?:[a-z0-9-]+\.)+chess\.sauravx\.com$/i,
    // Cloud deployment platforms
    /^[a-z0-9-]+\.railway\.app$/i,
    /^[a-z0-9-]+\.onrender\.com$/i,
    /^[a-z0-9-]+\.vercel\.app$/i,
    /^[a-z0-9-]+\.herokuapp\.com$/i,
    ...(process.env.NODE_ENV === "development"
        ? [/^localhost$/i] : []
    )
];

const hostnameWhitelist: RequestHandler = (req, res, next) => {
    const hostWhitelisted = whitelistedHostnames.some(
        re => re.test(req.hostname)
    );

    if (!hostWhitelisted) {
        // Log server-side only — do not expose details in the response
        console.warn(`[security] rejected hostname: ${req.hostname}`);
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};

export default hostnameWhitelist;