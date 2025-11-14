"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiService_1 = __importDefault(require("../services/aiService"));
const scoringService_1 = require("../services/scoringService");
const router = express_1.default.Router();
router.post("/generate", async (req, res) => {
    try {
        const { cv, job } = req.body;
        const out = await aiService_1.default.generateAnswersRAG(cv ?? "", job ?? "");
        res.json(out);
    }
    catch (err) {
        res.status(500).json({ error: err?.message ?? String(err) });
    }
});
router.post("/score", async (req, res) => {
    try {
        const { job, answers } = req.body;
        const out = await (0, scoringService_1.scoreAnswersWithEmbeddings)(job ?? "", answers ?? []);
        res.json(out);
    }
    catch (err) {
        res.status(500).json({ error: err?.message ?? String(err) });
    }
});
exports.default = router;
