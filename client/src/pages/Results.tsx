import React from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css';

interface Response {
    question: string;
    answer: string;
}

interface LocationState {
    score: number;
    responses: Response[];
}

const Results: React.FC = () => {
    const location = useLocation<LocationState>();
    const { score, responses } = location.state || { score: 0, responses: [] };

    return (
        <div className="results-container">
            <h1>Interview Results</h1>
            <div className="score-display">
                <h2>Your Score: {score}%</h2>
            </div>
            <div className="responses-section">
                <h3>Your Responses:</h3>
                {responses.map((response, index) => (
                    <div key={index} className="response-item">
                        <p><strong>Question {index + 1}:</strong> {response.question}</p>
                        <p><strong>Your Answer:</strong> {response.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;