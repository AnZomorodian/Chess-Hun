import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import openingsRouter from "./openings";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";
import adminRouter from "./admin";
import trapsRouter from "./traps";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/openings", openingsRouter);
router.use("/lessons", lessonsRouter);
router.use("/progress", progressRouter);
router.use("/admin", adminRouter);
router.use("/traps", trapsRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;
