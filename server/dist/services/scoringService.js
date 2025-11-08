"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
class ScoringService {
    constructor(criteria) {
        this.criteria = criteria ?? {};
    }
    calculateScore(candidate) {
        const keywordScore = this.calculateKeywordScore(candidate.keywords);
        const cvScore = this.calculateCvScore(candidate.cv);
        const responseScore = this.calculateResponseScore(candidate.responses);
        const totalScore = (keywordScore * this.criteria.keywordsWeight) +
            (cvScore * this.criteria.cvWeight) +
            (responseScore * this.criteria.responseWeight);
        return totalScore;
    }
    calculateKeywordScore(keywords) {
        // Implement logic to calculate score based on keywords
        return keywords.length; // Placeholder implementation
    }
    calculateCvScore(cv) {
        // Implement logic to analyze CV and calculate score
        return cv.length > 0 ? 1 : 0; // Placeholder implementation
    }
    calculateResponseScore(responses) {
        // Implement logic to analyze responses and calculate score
        return responses.length; // Placeholder implementation
    }
}
exports.ScoringService = ScoringService;
