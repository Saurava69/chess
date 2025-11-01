import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

const whitelistedHostnames = [
    /.*\.?SyntaxEngineer\.com/,
    // Cloud deployment platforms
    /.*\.railway\.app$/,
    /.*\.render\.com$/,
    /.*\.onrender\.com$/,  
    /.*\.vercel\.app$/,
    /.*\.herokuapp\.com$/,
    // Custom domains (add your own here)
    /.*\.syntaxengineer\.com$/,
    ...(process.env.NODE_ENV == "development"
        ? [/localhost/] : []
    )
];

const hostnameWhitelist: RequestHandler = (req, res, next) => {
    const hostWhitelisted = whitelistedHostnames.some(
        hostnameRegex => hostnameRegex.test(req.hostname)
    );

    // Debug logging for production issues
    if (!hostWhitelisted) {
        console.log("🚨 HOSTNAME REJECTED:", req.hostname);
        console.log("📋 Request host header:", req.get("host"));
        console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Unauthorized hostname",
            hostname: req.hostname,
            host: req.get("host"),
            env: process.env.NODE_ENV
        });
    }

    next();
};

export default hostnameWhitelist;