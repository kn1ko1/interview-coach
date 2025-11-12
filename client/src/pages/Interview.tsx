import React, { useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import CVUploader from '../components/CVUploader';
import KeywordInput from '../components/KeywordInput';
import ScoreBadge from '../components/ScoreBadge';
import { calculateScore } from '../services/api';

const Interview = () => {
    const [responses, setResponses] = useState({});
    const [keywords, setKeywords] = useState<string[]>([]);
    const [cv, setCv] = useState<File | null>(null);
    const [score, setScore] = useState<number | null>(null);

    const handleResponseChange = (questionId: string, answer: string) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: answer,
        }));
    };

    const handleKeywordChange = (newKeywords: string[]) => {
        setKeywords(newKeywords);
    };

    const handleCvUpload = (uploadedCv: File | null) => {
        setCv(uploadedCv);
    };

    const handleSubmit = async () => {
        const calculatedScore = await calculateScore({ responses, keywords, cvId: cv?.name });
        setScore(calculatedScore);
    };

    return (
        <div>
            <h1>Interview Preparation</h1>
            <CVUploader onUpload={handleCvUpload} />
            <KeywordInput onChange={handleKeywordChange} />
            <QuestionCard question="1" onChange={(answer: string) => handleResponseChange("1", answer)} />
            <QuestionCard question="2" onChange={(answer: string) => handleResponseChange("2", answer)} />
            <QuestionCard question="3" onChange={(answer: string) => handleResponseChange("3", answer)} />
            <button onClick={handleSubmit}>Submit</button>
            {score !== null && <ScoreBadge score={score} />}
        </div>
    );
};

export default Interview;