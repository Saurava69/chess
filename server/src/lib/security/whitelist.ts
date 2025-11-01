import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

const whitelistedHostnames = [
    /.*\.?SyntaxEngineer\.com/,
    // Cloud deployment platforms
    /.*\.railway\.app$/,
    /.*\.render\.com$/,
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

    if (!hostWhitelisted) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};

export default hostnameWhitelist;