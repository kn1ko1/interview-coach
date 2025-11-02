import express, { Express } from "express";
import { getInterviewQuestions, handleInterview } from "../controllers/interviewController";
import aiRoutes from "./aiRoutes";

const router = express.Router();

router.get("/interview/questions", getInterviewQuestions);
router.post("/interview", handleInterview);
router.use("/ai", aiRoutes);

export function initRoutes(app: Express) {
  app.use("/api", router);
}

export default router;