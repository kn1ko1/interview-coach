import React from 'react';

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let badgeColor = '';

    if (score >= 80) {
        badgeColor = 'bg-green-500';
    } else if (score >= 50) {
        badgeColor = 'bg-yellow-500';
    } else {
        badgeColor = 'bg-red-500';
    }

    return (
        <div className={`p-4 rounded-lg text-white ${badgeColor}`}>
            <h2 className="text-lg font-bold">Employability Score</h2>
            <p className="text-2xl">{score}</p>
        </div>
    );
};

export default ScoreBadge;