import React, { useState } from 'react';
import QuestionCard from '../components/QuestionCard';
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
        const calculatedScore = await calculateScore(responses, keywords, cv);
        setScore(calculatedScore);
    };

    return (
        <div>
            <h1>Interview Preparation</h1>
            <CVUploader onUpload={handleCvUpload} />
            <KeywordInput onChange={handleKeywordChange} />
            <QuestionCard question="1" onResponseChange={handleResponseChange} />
            <QuestionCard question="2" onResponseChange={handleResponseChange} />
            <QuestionCard question="3" onResponseChange={handleResponseChange} />
            <button onClick={handleSubmit}>Submit</button>
            {score !== null && <ScoreBadge score={score} />}
        </div>
    );
};

export default Interview;

interface CVUploaderProps {
    onUpload: (uploadedCv: File | null) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async () => {
        onUpload(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload</button>
        </div>
    );
};