import { Request, Response } from 'express';
import ScoringService from '../services/scoringService';
import AIService from '../services/aiService';

export class InterviewController {
    private scoringService = new ScoringService();

    public async getInterviewQuestions(req: Request, res: Response): Promise<Response> {
        try {
            // AIService may expose static helpers; call safely with fallback
            const questions = await (AIService as any).getInterviewQuestions?.() ?? [];
            return res.json(questions);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving interview questions', error: error?.message || error });
        }
    }

    public async submitResponses(req: Request, res: Response): Promise<Response> {
        const { responses, cv, keywords, name, email } = req.body;

        try {
            // build plain candidate shape for scoring service
            // build plain candidate shape for scoring service
            const candidate = {
                name: name ?? 'anonymous',
                email: email ?? 'unknown',
                cv: cv ?? '',
                keywords: Array.isArray(keywords) ? keywords : [],
                responses: Array.isArray(responses) ? responses : [],
            };

            const score = await Promise.resolve(this.scoringService.calculateScore(candidate));
            return res.json({ score });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: 'Error processing responses', error: error?.message || error });
        }
    }
}