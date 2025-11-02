import React from 'react';
import { useLocation } from 'react-router-dom';
import ScoreBadge from '../components/ScoreBadge';

const Results: React.FC = () => {
    const location = useLocation();
    const { score, responses } = location.state || { score: 0, responses: [] };

    return (
        <div className="results-container">
            <h1>Interview Results</h1>
            <ScoreBadge score={score} />
            <h2>Your Responses:</h2>
            <ul>
                {responses.map((response: string, index: number) => (
                    <li key={index}>{response}</li>
                ))}
            </ul>
        </div>
    );
};

export default Results;