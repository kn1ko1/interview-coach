"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const scoringService_1 = require("../services/scoringService");
const aiService_1 = __importDefault(require("../services/aiService"));
class InterviewController {
    constructor() {
        // ScoringService constructor accepts optional criteria
        this.scoringService = new scoringService_1.ScoringService();
    }
    async getInterviewQuestions(req, res) {
        try {
            // AIService exposes static helpers
            const questions = await aiService_1.default.getInterviewQuestions?.() ?? [];
            return res.json(questions);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving interview questions', error: error?.message || error });
        }
    }
    async submitResponses(req, res) {
        const { responses, cv, keywords, name, email } = req.body;
        try {
            // build a plain candidate shape that ScoringService expects
            const candidate = {
                name: name ?? 'anonymous',
                email: email ?? 'unknown',
                cv: cv ?? '',
                keywords: Array.isArray(keywords) ? keywords : [],
                responses: Array.isArray(responses) ? responses : [],
            };
            const score = this.scoringService.calculateScore(candidate);
            return res.json({ score });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error processing responses', error: error?.message || error });
        }
    }
    // route-compatible adapters required by routes/index.ts
    async handleInterview(req, res) {
        // POST /interview -> reuse submitResponses
        return this.submitResponses(req, res);
    }
    async uploadCV(req, res) {
        try {
            // If multer is used, file will be on req.file
            const file = req.file;
            if (!file)
                return res.status(400).json({ message: 'No file uploaded' });
            return res.json({ message: 'CV uploaded', filename: file.filename ?? file.originalname });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: error?.message || 'Upload failed' });
        }
    }
    async getEmployabilityScore(req, res) {
        try {
            // Minimal implementation: accept candidate id or return 0
            const { candidateId } = req.query;
            // TODO: lookup candidate by id and return stored score
            return res.json({ candidateId: candidateId ?? null, score: 0 });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: error?.message || 'Failed to get score' });
        }
    }
}
exports.InterviewController = InterviewController;
