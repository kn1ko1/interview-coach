import { Request, Response } from 'express';
import { ScoringService } from '../services/scoringService';
import AIService from '../services/aiService';

export class InterviewController {
    private scoringService = new ScoringService();

    public async getInterviewQuestions(req: Request, res: Response): Promise<Response> {
        try {
            // Type assertion for AIService to access its methods
            const service = AIService as { getInterviewQuestions?: () => Promise<unknown[]> };
            const questions = await service.getInterviewQuestions?.() ?? [];
            return res.json(questions);
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message: 'Error retrieving interview questions', error: errorMessage });
        }
    }

    public async submitResponses(req: Request, res: Response): Promise<Response> {
        const { responses, keywords } = req.body;

        try {
            // build candidate data matching ScoringService expected type
            const candidateData = {
                responses: Array.isArray(responses) ? responses.reduce((acc: Record<string, unknown>, r: unknown, i: number) => {
                    acc[`q${i + 1}`] = r;
                    return acc;
                }, {}) : {},
                keywords: Array.isArray(keywords) ? keywords : []
            };

            const score = this.scoringService.calculateScore(candidateData);
            return res.json({ score });
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ message: 'Error processing responses', error: errorMessage });
        }
    }
}