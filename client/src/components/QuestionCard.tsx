import React from 'react';

interface QuestionCardProps {
    question: string;
    onChange: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onChange }) => {
    return (
        <div className="question-card">
            <h3>{question}</h3>
            <textarea 
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your answer here..."
            />
        </div>
    );
};

export default QuestionCard;