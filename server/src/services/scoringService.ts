import { embedText } from "./embeddingsAdapter";

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

export interface CandidateData {
    responses: Record<string, unknown>;
    keywords?: string[];
    cvId?: string;
}

export class ScoringService {
    /**
     * Calculate employability score based on candidate responses and keywords.
     * This is a placeholder implementation for the MVP.
     */
    public calculateScore(candidateData: CandidateData): number {
        const { responses, keywords = [] } = candidateData;
        
        // Simple scoring logic for MVP
        let score = 0;
        
        // Score based on number of responses (max 50 points)
        const responseCount = Object.keys(responses).length;
        score += Math.min(responseCount * 10, 50);
        
        // Score based on keywords mentioned (max 50 points)
        const keywordCount = keywords.length;
        score += Math.min(keywordCount * 5, 50);
        
        // Normalize to 0-100
        return Math.min(Math.max(score, 0), 100);
    }
}