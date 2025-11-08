import React, { useState } from 'react';
import CVUploader from '../components/CVUploader';
import KeywordInput from '../components/KeywordInput';
import ScoreBadge from '../components/ScoreBadge';

const CVUploaderTyped = CVUploader as React.ComponentType<{ onUpload: (file: File) => void }>;
const KeywordInputTyped = KeywordInput as React.ComponentType<{ onChange: (newKeywords: string[]) => void }>;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

const Home: React.FC = () => {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [cv, setCv] = useState<File | null>(null);
    const [employabilityScore, setEmployabilityScore] = useState<number | null>(null);

    const handleKeywordChange = (newKeywords: string[]) => {
        setKeywords(newKeywords);
    };

    const handleCvUpload = (file: File) => {
        setCv(file);
    };

    const calculateScore = () => {
        // Logic to calculate employability score based on keywords and CV
        // This is a placeholder for the actual scoring logic
        const score = Math.floor(Math.random() * 100);
        setEmployabilityScore(score);
    };
    return (
        <div>
            <h1>Welcome to the Interview Coach</h1>
            <CVUploaderTyped onUpload={handleCvUpload} />
            <KeywordInputTyped onChange={handleKeywordChange} />
            <button onClick={calculateScore}>Get Employability Score</button>
            {employabilityScore !== null && <ScoreBadge score={employabilityScore} />}
        </div>
    );
};

export default Home;