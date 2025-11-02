import React, { useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import CVUploader from '../components/CVUploader';
import KeywordInput from '../components/KeywordInput';
import ScoreBadge from '../components/ScoreBadge';
import { calculateScore } from '../services/api';

const Interview = () => {
    const [responses, setResponses] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [cv, setCv] = useState(null);
    const [score, setScore] = useState(null);

    const handleResponseChange = (questionId, answer) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: answer,
        }));
    };

    const handleKeywordChange = (newKeywords) => {
        setKeywords(newKeywords);
    };

    const handleCvUpload = (uploadedCv) => {
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
            <QuestionCard questionId="1" onResponseChange={handleResponseChange} />
            <QuestionCard questionId="2" onResponseChange={handleResponseChange} />
            <QuestionCard questionId="3" onResponseChange={handleResponseChange} />
            <button onClick={handleSubmit}>Submit</button>
            {score !== null && <ScoreBadge score={score} />}
        </div>
    );
};

export default Interview;