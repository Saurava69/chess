import { Router } from "express";

import pagesRouter from "./pages";
import apiRouter from "./api";
import authRouter from "./auth";
import internalRouter from "./internal";
import seoRouter from "./seo";

const router = Router();

router.use("/",
    seoRouter,
    internalRouter,
    apiRouter,
    authRouter,
    pagesRouter
);

export default router;