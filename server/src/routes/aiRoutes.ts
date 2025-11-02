import express, { Request, Response } from "express";
import AIService from "../services/aiService";
import { scoreAnswersWithEmbeddings } from "../services/scoringService";

const router = express.Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { cv, job } = req.body as { cv?: string; job?: string };
    const out = await AIService.generateAnswersRAG(cv ?? "", job ?? "");
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

router.post("/score", async (req: Request, res: Response) => {
  try {
    const { job, answers } = req.body as {
      job?: string;
      answers?: Array<{ questionId: string; userAnswer: string }>;
    };
    const out = await scoreAnswersWithEmbeddings(job ?? "", answers ?? []);
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

export default router;