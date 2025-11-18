import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import MetricsCard from '../components/MetricsCard';
import SidebarNav from '../components/SidebarNav';
import '../styles/ResultsDashboard.css';

interface Response {
  id: string;
  question: string;
  category: string;
  answer: string;
  score?: number;
  maxScore?: number;
}

interface ResultsState {
  score: number;
  responses: Response[];
  totalScore?: number;
  metrics?: {
    technical: number;
    behavioral: number;
    growth: number;
  };
}

const Results: React.FC = () => {
  const location = useLocation<ResultsState | undefined>();
  const { score = 7.5, responses = [], totalScore = 10, metrics = { technical: 8, behavioral: 7, growth: 7.5 } } = location.state ?? {};

  const [selectedResponse, setSelectedResponse] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'overview' | 'breakdown' | 'details'>('overview');

  // Calculate metrics
  const categoryBreakdown = {
    Technical: responses.filter((r) => r.category === 'Technical').length,
    Behavioral: responses.filter((r) => r.category === 'Behavioral').length,
    Growth: responses.filter((r) => r.category === 'Growth').length,
  };

  const overallScore = Math.round((score / totalScore) * 100);
  const scoreColor =
    overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : overallScore >= 40 ? 'fair' : 'poor';

  const navItems = responses.map((r, idx) => ({
    id: r.id,
    label: `Q${idx + 1}`,
    icon: r.score! >= 7 ? '⭐' : '→',
    active: idx === selectedResponse,
    onClick: () => setSelectedResponse(idx),
  }));

  const sidebar = (
    <div className="results-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">🎯 Overall Performance</h3>
        <div className="overall-score">
          <div className={`score-circle score-${scoreColor}`}>{overallScore}%</div>
          <p className="score-label">
            {overallScore >= 80
              ? 'Excellent'
              : overallScore >= 60
              ? 'Good'
              : overallScore >= 40
              ? 'Fair'
              : 'Needs Work'}
          </p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">📊 Category Scores</h3>
        <div className="category-metrics">
          <MetricsCard
            title="Technical"
            value={metrics.technical.toFixed(1)}
            variant="info"
            progress={Math.round(metrics.technical * 10)}
            maxProgress={100}
            icon="💻"
          />
          <MetricsCard
            title="Behavioral"
            value={metrics.behavioral.toFixed(1)}
            variant="success"
            progress={Math.round(metrics.behavioral * 10)}
            maxProgress={100}
            icon="🤝"
          />
          <MetricsCard
            title="Growth"
            value={metrics.growth.toFixed(1)}
            variant="warning"
            progress={Math.round(metrics.growth * 10)}
            maxProgress={100}
            icon="📈"
          />
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">📝 Responses</h3>
        <SidebarNav items={navItems} />
      </div>
    </div>
  );

  const currentResponse = responses[selectedResponse];

  const main = (
    <div className="results-main">
      <div className="results-header">
        <h1>Interview Results</h1>
        <p className="results-subtitle">Here's how you performed on the interview challenge</p>
      </div>

      {/* View Mode Tabs */}
      <div className="view-tabs">
        <button
          className={`tab ${viewMode === 'overview' ? 'active' : ''}`}
          onClick={() => setViewMode('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${viewMode === 'breakdown' ? 'active' : ''}`}
          onClick={() => setViewMode('breakdown')}
        >
          📈 Breakdown
        </button>
        <button
          className={`tab ${viewMode === 'details' ? 'active' : ''}`}
          onClick={() => setViewMode('details')}
        >
          🔍 Details
        </button>
      </div>

      {/* Overview Tab */}
      {viewMode === 'overview' && (
        <section className="results-section">
          <div className="performance-grid">
            <div className={`performance-card score-card score-${scoreColor}`}>
              <h3>Overall Score</h3>
              <div className="large-score">{overallScore}%</div>
              <p className="score-feedback">
                {overallScore >= 80
                  ? '🎉 Outstanding performance!'
                  : overallScore >= 60
                  ? '✅ Good job! Keep practicing.'
                  : overallScore >= 40
                  ? '📚 Keep improving, you\'re on the right track.'
                  : '💪 Let\'s work on these areas together.'}
              </p>
            </div>

            <div className="performance-card stats-card">
              <h3>Interview Stats</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-value">{responses.length}</span>
                  <span className="stat-label">Questions</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{responses.filter((r) => r.score! >= 7).length}</span>
                  <span className="stat-label">Strong Answers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{score.toFixed(1)}</span>
                  <span className="stat-label">Avg Score</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Breakdown Tab */}
      {viewMode === 'breakdown' && (
        <section className="results-section">
          <div className="breakdown-cards">
            {Object.entries(categoryBreakdown).map(([category, count]) => {
              const categoryScore = category === 'Technical' ? metrics.technical :
                                     category === 'Behavioral' ? metrics.behavioral : metrics.growth;
              const categoryPercentage = Math.round((categoryScore / totalScore) * 100);
              return (
                <div key={category} className="category-card">
                  <h3>{category} Questions</h3>
                  <div className="category-score">{categoryScore.toFixed(1)}/10</div>
                  <div className="category-percentage">{categoryPercentage}%</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${categoryPercentage}%` }} />
                  </div>
                  <p className="category-count">{count} questions in this category</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Details Tab */}
      {viewMode === 'details' && (
        <section className="results-section">
          <h2>Detailed Answer Review</h2>

          <div className="answer-navigator">
            {responses.map((r, idx) => (
              <button
                key={r.id}
                className={`answer-nav-btn ${idx === selectedResponse ? 'active' : ''} ${
                  r.score! >= 7 ? 'strong' : ''
                }`}
                onClick={() => setSelectedResponse(idx)}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>

          {currentResponse && (
            <div className="answer-review">
              <div className="answer-header">
                <h3 className="answer-question">{currentResponse.question}</h3>
                <div className="answer-meta">
                  <span className="answer-category">{currentResponse.category}</span>
                  <span className={`answer-score score-badge-${currentResponse.score! >= 7 ? 'high' : 'low'}`}>
                    {currentResponse.score}/{currentResponse.maxScore} points
                  </span>
                </div>
              </div>

              <div className="answer-content">
                <h4>Your Answer</h4>
                <p className="answer-text">{currentResponse.answer}</p>
              </div>

              <div className="answer-feedback">
                <h4>Feedback</h4>
                {currentResponse.score! >= 8 && (
                  <div className="feedback-item excellent">
                    <span className="feedback-icon">⭐</span>
                    <p>Excellent answer! You demonstrated strong knowledge and articulation.</p>
                  </div>
                )}
                {currentResponse.score! >= 6 && currentResponse.score! < 8 && (
                  <div className="feedback-item good">
                    <span className="feedback-icon">✅</span>
                    <p>Good answer with solid understanding. Consider adding more specific examples.</p>
                  </div>
                )}
                {currentResponse.score! >= 4 && currentResponse.score! < 6 && (
                  <div className="feedback-item fair">
                    <span className="feedback-icon">⚠️</span>
                    <p>Fair response. Work on providing more detailed examples and context.</p>
                  </div>
                )}
                {currentResponse.score! < 4 && (
                  <div className="feedback-item poor">
                    <span className="feedback-icon">💭</span>
                    <p>Consider revisiting this topic and preparing more comprehensive answers.</p>
                  </div>
                )}
              </div>

              <div className="answer-navigation">
                <button
                  className="btn-prev-answer"
                  onClick={() => setSelectedResponse(Math.max(0, selectedResponse - 1))}
                  disabled={selectedResponse === 0}
                >
                  ← Previous
                </button>
                <button
                  className="btn-next-answer"
                  onClick={() => setSelectedResponse(Math.min(responses.length - 1, selectedResponse + 1))}
                  disabled={selectedResponse === responses.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Action Buttons */}
      <div className="results-actions">
        <button className="btn-retake">Retake Interview</button>
        <button className="btn-export">📥 Export Results</button>
      </div>
    </div>
  );

  return <DashboardLayout sidebar={sidebar} main={main} />;
};

export default Results;