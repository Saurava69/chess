import { Router } from "express";

import publicApiRouter from "./public";
import accountRouter from "./account";
import analyseRouter from "./analysis/analyse";
import archiveRouter from "./analysis/archive";
import aiChatRouter from "./ai/chat";
import aiCoachRouter from "./ai/coach";
import aiCoachBatchRouter from "./ai/coachBatch";

const router = Router();

router.use("/api",
    publicApiRouter,
    accountRouter,
    analyseRouter,
    archiveRouter,
    aiChatRouter,
    aiCoachRouter,
    aiCoachBatchRouter
);

export default router;