import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import openingsRouter from "./openings";
import lessonsRouter from "./lessons";
import progressRouter from "./progress";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/openings", openingsRouter);
router.use("/lessons", lessonsRouter);
router.use("/progress", progressRouter);

export default router;
