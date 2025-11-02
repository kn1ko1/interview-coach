import { Candidate } from '../models/candidate';
import { embedText } from "./embeddingsAdapter";

export interface ScoringCriteria {
    keywordsWeight: number;
    cvWeight: number;
    responseWeight: number;
}

export class ScoringService {
    private criteria: ScoringCriteria;

    constructor(criteria: ScoringCriteria) {
        this.criteria = criteria;
    }

    public calculateScore(candidate: Candidate): number {
        const keywordScore = this.calculateKeywordScore(candidate.keywords);
        const cvScore = this.calculateCvScore(candidate.cv);
        const responseScore = this.calculateResponseScore(candidate.responses);

        const totalScore = (keywordScore * this.criteria.keywordsWeight) +
                           (cvScore * this.criteria.cvWeight) +
                           (responseScore * this.criteria.responseWeight);

        return totalScore;
    }

    private calculateKeywordScore(keywords: string[]): number {
        // Implement logic to calculate score based on keywords
        return keywords.length; // Placeholder implementation
    }

    private calculateCvScore(cv: string): number {
        // Implement logic to analyze CV and calculate score
        return cv.length > 0 ? 1 : 0; // Placeholder implementation
    }

    private calculateResponseScore(responses: string[]): number {
        // Implement logic to analyze responses and calculate score
        return responses.length; // Placeholder implementation
    }
}

type AnswerRecord = { questionId: string; userAnswer: string };

function cosSim(a: number[], b: number[]) {
  const dot = a.reduce((s, v, i) => s + v * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

export async function scoreAnswersWithEmbeddings(jobText: string, answers: AnswerRecord[]) {
  const jobEmb = await embedText(jobText || "");
  const perQuestion = [];
  for (const a of answers) {
    const ansEmb = await embedText(a.userAnswer || "");
    const similarity = cosSim(jobEmb.vector, ansEmb.vector);
    const lengthScore = Math.max(0, Math.min(1, (a.userAnswer.split(/\s+/).length / 150)));
    const star = /situation|task|action|result|s:|t:|a:|r:/i.test(a.userAnswer) ? 1 : 0;
    const score = Math.round((similarity * 60) + (lengthScore * 20) + (star * 20));
    perQuestion.push({ questionId: a.questionId, score, similarity: Number(similarity.toFixed(3)) });
  }
  const overall = Math.round(perQuestion.reduce((s, r) => s + r.score, 0) / perQuestion.length || 0);
  return { perQuestion, overall };
}