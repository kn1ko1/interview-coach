import { Request, Response } from 'express';
import { embedText } from "./embeddingsAdapter";
import { upsertDocument, querySimilar } from "./vectorService";
import { chatComplete } from "./aiAdapter";

const QUESTIONS = [
  { id: "q1", question: "Why have you applied for this role?" },
  { id: "q2", question: "Can you tell me a little about yourself?" },
  { id: "q3", question: "What skills and qualities do you believe you have that match you to this role?" },
  { id: "q4", question: "Give an example of when you have worked positively in a team." },
  { id: "q5", question: "What do you consider to be one of your key achievements/something you did that you are proud of?" },
  { id: "q6", question: "What is your biggest weakness? What steps have you taken to improve this?" },
  { id: "q7", question: "What is your biggest strength? Can you give an example of how you have demonstrated this?" },
];

class AIService {
    private static genericAnswers: { [key: string]: string } = {
        "Tell me about yourself": "I am a dedicated professional with a passion for my field. I have experience in various roles and am always eager to learn and grow.",
        "What are your strengths?": "I possess strong analytical skills, excellent communication abilities, and a commitment to teamwork.",
        "What are your weaknesses?": "I tend to be a perfectionist, which can sometimes slow me down, but I am working on balancing quality with efficiency.",
        "Why do you want to work here?": "I admire the company's commitment to innovation and excellence, and I believe my skills align well with your goals."
    };

    public static getAnswer(question: string): string {
         return this.genericAnswers[question] || "That's a great question! Can you provide more context?";
    }

    public static analyzeKeywords(keywords: string[]): string {
        // Placeholder for keyword analysis logic
        return `Analyzed keywords: ${keywords.join(', ')}`;
    }
    
    public static async generateAnswersRAG(cvText: string, jobText: string) {
        const now = Date.now();
        const cvEmb = await embedText(cvText || "");
        const jobEmb = await embedText(jobText || "");
        await upsertDocument(`cv:${now}`, cvEmb.vector, { type: "cv", text: cvText });
        await upsertDocument(`job:${now}`, jobEmb.vector, { type: "job", text: jobText });

        const outs = [];
        for (const q of QUESTIONS) {
            const qEmb = await embedText(q.question);
            const ctx = await querySimilar(qEmb.vector, 5);
            const contexts = (ctx || []).map(c => `- ${c.payload?.type || "doc"}: ${String(c.payload?.text || "").slice(0, 800)}`).join("\n");
            const system = `You are a concise interview coach that produces an editable model answer, a short rationale, and two coaching tips. Use the candidate CV and job description context where helpful. Keep answers concise and role-relevant.`;
            const userPrompt = `Question: ${q.question}\n\nContext:\n${contexts}\n\nProvide:\n1) Suggested answer (one short paragraph)\n2) Rationale (one sentence)\n3) Two coaching tips (bullet points)\n4) Placeholder fields for customization.`;
            const llmResp = await chatComplete(system, userPrompt);
            outs.push({ questionId: q.id, question: q.question, suggested: llmResp });
        }
        return outs;
    }
}

export default AIService;