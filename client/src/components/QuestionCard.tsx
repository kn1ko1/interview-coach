import React, { useState } from 'react';

interface QuestionCardProps {
    question: string;
    onResponseChange: (questionId: string, answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onResponseChange }) => {
    const [answer, setAnswer] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
        onResponseChange(question, event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onResponseChange(question, answer);
    };

    return (
        <div className="question-card">
            <h3>{question}</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={answer}
                    onChange={handleChange}
                    placeholder="Type your answer here..."
                    required
                />
                <button type="submit">Submit Answer</button>
            </form>
        </div>
    );
};

export default QuestionCard;