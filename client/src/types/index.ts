export interface InterviewQuestion {
    id: string;
    question: string;
    answer: string;
}

export interface CVData {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string[];
}

export interface EmployabilityScore {
    score: number;
    feedback: string;
}

export interface Keyword {
    id: string;
    word: string;
}