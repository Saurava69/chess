import { Router } from "express";

import appRouter from "@/lib/appRouter";
import featuresRouter from "./features";
import accountRouter from "./account";
import footerRouter from "./footer";

const router = Router();

router.use("/",
    accountRouter,
    featuresRouter,
    footerRouter
);

router.get("/settings*", appRouter("settings.html"));

router.get("/", appRouter("homepage.html"));
router.get("/home", appRouter("homepage.html"));

router.get("/*", appRouter("unfound.html"));

export default router;