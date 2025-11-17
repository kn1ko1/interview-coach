import React, { useState } from 'react';
import CVUploader from '../components/CVUploader';
import ChatInterface from '../components/ChatInterface';
import JobSpecUploader from '../components/JobSpecUploader';
import './Home.css';

const Home: React.FC = () => {
    const [cv, setCv] = useState<File | null>(null);
    const [jobSpec, setJobSpec] = useState<string>('');

    const handleKeywordChange = (newKeywords: string[]) => {
        // Removed - keywords section is hidden
    };

    const handleCvUpload = (file: File) => {
        setCv(file);
    };

    const handleJobSpecUpload = (spec: string) => {
        setJobSpec(spec);
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <h1>Welcome to Interview Coach</h1>
                    <p>Prepare for success with personalized interview guidance</p>
                </div>

                <div className="home-sections">
                    <div className="uploader-container">
                        <div className="section cv-uploader-section">
                            <CVUploader onUpload={handleCvUpload} />
                        </div>

                        <div className="section keywords-section">
                            <JobSpecUploader onJobSpecSubmit={handleJobSpecUpload} />
                        </div>
                    </div>

                    <div className="section chat-section">
                        <h2>Interview Chat</h2>
                        <ChatInterface cv={cv?.name || ''} jobSpec={jobSpec} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;