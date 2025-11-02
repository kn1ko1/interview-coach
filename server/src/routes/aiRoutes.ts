import express from "express";
import { generateAnswersRAG } from "../services/aiService";
import { scoreAnswersWithEmbeddings } from "../services/scoringService";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { cv, job } = req.body;
    const out = await generateAnswersRAG(cv || "", job || "");
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/score", async (req, res) => {
  try {
    const { job, answers } = req.body;
    const out = await scoreAnswersWithEmbeddings(job || "", answers || []);
    res.json(out);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;