import React, { useState } from 'react';
import CVUploader from '../components/CVUploader';
import KeywordInput from '../components/KeywordInput';
import ScoreBadge from '../components/ScoreBadge';
import './Home.css';

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

    const isFormValid = cv && keywords.length > 0;

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <h1>Welcome to Interview Coach</h1>
                    <p>Prepare for success with personalized interview guidance</p>
                </div>

                <div className="home-sections">
                    <div className="section cv-uploader-section">
                        <CVUploader onUpload={handleCvUpload} />
                    </div>

                    <div className="section keywords-section">
                        <KeywordInput onChange={handleKeywordChange} />
                    </div>

                    <div className="section action-section">
                        <h2>Ready to Get Your Score?</h2>
                        <button 
                            className="score-button"
                            onClick={calculateScore}
                            disabled={!isFormValid}
                        >
                            Get Employability Score
                        </button>
                    </div>
                </div>

                {employabilityScore !== null && (
                    <div className="score-badge-container">
                        <ScoreBadge score={employabilityScore} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;