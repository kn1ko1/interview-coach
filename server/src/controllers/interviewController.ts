import { Request, Response } from 'express';
import { scoringService } from '../services/scoringService';
import { aiService } from '../services/aiService';
import { Candidate } from '../models/candidate';

export class InterviewController {
    public async getInterviewQuestions(req: Request, res: Response): Promise<Response> {
        try {
            const questions = await aiService.getInterviewQuestions();
            return res.json(questions);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving interview questions', error });
        }
    }

    public async submitResponses(req: Request, res: Response): Promise<Response> {
        const { responses, cv } = req.body;

        try {
            const candidate = new Candidate(responses, cv);
            const score = scoringService.calculateScore(candidate);
            return res.json({ score });
        } catch (error) {
            return res.status(500).json({ message: 'Error processing responses', error });
        }
    }
}