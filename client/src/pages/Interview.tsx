import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SidebarNav from '../components/SidebarNav';
import MetricsCard from '../components/MetricsCard';
import CVUploader from '../components/CVUploader';
import KeywordInput from '../components/KeywordInput';
import ScoreBadge from '../components/ScoreBadge';
import { calculateScore } from '../services/api';
import '../styles/InterviewDashboard.css';

interface Question {
  id: string;
  number: number;
  category: string;
  text: string;
}

const Interview = () => {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [keywords, setKeywords] = useState<string[]>([]);
  const [cv, setCv] = useState<File | null>(null);
  const [cvMetrics, setCvMetrics] = useState({ strength: 0, alignment: 0 });
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeSection, setActiveSection] = useState('interview');

  const questions: Question[] = [
    { id: '1', number: 1, category: 'Technical', text: 'Tell me about your experience with TypeScript.' },
    { id: '2', number: 2, category: 'Technical', text: 'How do you approach system design problems?' },
    { id: '3', number: 3, category: 'Behavioral', text: 'Describe a time you handled a difficult team situation.' },
    { id: '4', number: 4, category: 'Behavioral', text: 'Tell me about your proudest project accomplishment.' },
    { id: '5', number: 5, category: 'Technical', text: 'What are your strengths as a developer?' },
    { id: '6', number: 6, category: 'Growth', text: 'Where do you see yourself in 5 years?' },
    { id: '7', number: 7, category: 'Technical', text: 'How do you stay updated with new technologies?' },
  ];

  const handleResponseChange = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleKeywordChange = (newKeywords: string[]) => {
    setKeywords(newKeywords);
  };

  const handleCvUpload = (uploadedCv: File | null) => {
    setCv(uploadedCv);
    // Simulate CV analysis
    if (uploadedCv) {
      setCvMetrics({ strength: 7.5, alignment: 82 });
    }
  };

  const handleSubmit = async () => {
    const calculatedScore = await calculateScore({
      responses,
      keywords,
      cvId: cv?.name,
    });
    setScore(calculatedScore);
  };

  const navItems = questions.map((q, idx) => ({
    id: q.id,
    label: `Q${q.number}`,
    icon: idx === currentQuestion ? '→' : '✓',
    active: idx === currentQuestion,
    onClick: () => setCurrentQuestion(idx),
  }));

  const sidebar = (
    <div className="interview-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">📊 CV Analysis</h3>
        <div className="sidebar-metrics">
          <MetricsCard
            title="CV Strength"
            value={cvMetrics.strength.toFixed(1)}
            variant="info"
            progress={Math.round(cvMetrics.strength * 10)}
            maxProgress={100}
            icon="📄"
          />
          <MetricsCard
            title="Job Alignment"
            value={`${cvMetrics.alignment}%`}
            variant="success"
            progress={cvMetrics.alignment}
            maxProgress={100}
            icon="🎯"
          />
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">📝 Progress</h3>
        <SidebarNav items={navItems} />
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">⚡ Status</h3>
        <div className="status-indicator">
          <span className="status-badge">{Object.keys(responses).length}/7</span>
          <span className="status-text">Questions answered</span>
        </div>
      </div>
    </div>
  );

  const main = (
    <div className="interview-main">
      <div className="interview-header">
        <h1>Interview Challenge</h1>
        <p className="interview-subtitle">Answer these questions to practice your interviewing skills</p>
      </div>

      <div className="interview-sections">
        {/* CV Upload Section */}
        <section className="interview-section upload-section">
          <h2>Step 1: Upload Your CV</h2>
          <CVUploader onUpload={handleCvUpload} />
          {cv && <p className="upload-success">✓ CV uploaded: {cv.name}</p>}
        </section>

        {/* Keywords Section */}
        <section className="interview-section keywords-section">
          <h2>Step 2: Add Keywords</h2>
          <KeywordInput onChange={handleKeywordChange} />
        </section>

        {/* Questions Section */}
        <section className="interview-section questions-section">
          <h2>Step 3: Answer Questions</h2>
          <div className="questions-container">
            {questions.map((q, idx) => {
              const isAnswered = responses[q.id]?.trim().length > 0;
              return (
                <div
                  key={q.id}
                  className={`question-item ${idx === currentQuestion ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestion(idx)}
                >
                  <div className="question-badge">Q{q.number}</div>
                  <div className="question-preview">
                    <p className="question-category">{q.category}</p>
                    <p className="question-title">{q.text}</p>
                  </div>
                  {isAnswered && <span className="question-checkmark">✓</span>}
                </div>
              );
            })}
          </div>

          {/* Current Question Editor */}
          <div className="current-question">
            <div className="question-header-bar">
              <span className="q-number">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="q-category">{questions[currentQuestion].category}</span>
            </div>
            <h3 className="question-text">{questions[currentQuestion].text}</h3>
            <textarea
              className="question-textarea"
              placeholder="Type your detailed answer here..."
              value={responses[questions[currentQuestion].id] || ''}
              onChange={(e) => handleResponseChange(questions[currentQuestion].id, e.target.value)}
              rows={8}
            />
            <div className="question-actions">
              <button
                className="btn-prev"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              >
                ← Previous
              </button>
              <button
                className="btn-next"
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              >
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* Submit Section */}
        <section className="interview-section submit-section">
          <h2>Step 4: Submit & Review</h2>
          <button
            className="btn-submit-interview"
            onClick={handleSubmit}
            disabled={Object.keys(responses).length < 7}
          >
            Submit All Answers
          </button>
          <p className="submit-help">
            {Object.keys(responses).length < 7
              ? `Answer all ${7 - Object.keys(responses).length} remaining questions to submit`
              : 'All questions answered. Ready to submit!'}
          </p>
          {score !== null && (
            <div className="score-result">
              <ScoreBadge score={score} />
            </div>
          )}
        </section>
      </div>
    </div>
  );

  return <DashboardLayout sidebar={sidebar} main={main} />;
};

export default Interview;