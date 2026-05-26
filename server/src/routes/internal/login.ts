import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { randomBytes, timingSafeEqual } from "crypto";

import Cookie from "shared/constants/Cookie";
import InternalSession from "@/database/models/InternalSession";
import { secureCookieOptions } from "@/lib/security/account";

const path = "/login";

const router = Router();

router.use(path, express.text());

router.post(path, async (req, res) => {
    const password: string = req.body;
    const expected = process.env.INTERNAL_PASSWORD ?? "";

    // Constant-time comparison to prevent timing attacks; strict !== guard
    const passwordsMatch =
        password.length === expected.length &&
        timingSafeEqual(Buffer.from(password), Buffer.from(expected));

    if (!passwordsMatch) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    // Create session
    const sessionToken = randomBytes(32).toString("hex");

    await InternalSession.create({
        token: sessionToken,
        createdAt: new Date()
    });

    res.cookie(
        Cookie.INTERNAL_SESSION_TOKEN,
        sessionToken,
        secureCookieOptions
    );

    res.sendStatus(StatusCodes.OK);
});

export default router;