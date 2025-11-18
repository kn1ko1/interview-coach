import React, { useState } from 'react';
import '../styles/QuestionCard.css';

interface QuestionCardProps {
  number?: number;
  category?: string;
  question: string;
  answer?: string;
  score?: number;
  maxScore?: number;
  isActive?: boolean;
  isAnswered?: boolean;
  onAnswerChange?: (answer: string) => void;
  onSubmit?: () => void;
  timer?: React.ReactNode;
  showScore?: boolean;
  disabled?: boolean;
  // Legacy props for compatibility
  onChange?: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  number = 0,
  category = '',
  question,
  answer = '',
  score,
  maxScore = 10,
  isActive = false,
  isAnswered = false,
  onAnswerChange,
  onSubmit,
  timer,
  showScore = false,
  disabled = false,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scorePercentage = maxScore > 0 && score !== undefined ? (score / maxScore) * 100 : 0;

  const getScoreColor = (s: number) => {
    if (s >= 8) return 'score-excellent';
    if (s >= 6) return 'score-good';
    if (s >= 4) return 'score-fair';
    return 'score-needs-work';
  };

  const handleChange = (value: string) => {
    if (onAnswerChange) {
      onAnswerChange(value);
    } else if (onChange) {
      onChange(value);
    }
  };

  // Render modern card layout when full props provided (number > 0 indicates modern mode)
  if (number > 0 && category) {
    return (
      <div
        className={`question-card modern ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
      >
        <div className="question-header">
          <div className="question-meta">
            <span className="question-number">Q{number}</span>
            <span className="question-category">{category}</span>
            {isAnswered && <span className="question-status">✓ Answered</span>}
          </div>
          {timer && <div className="question-timer">{timer}</div>}
        </div>

        <div className="question-content">
          <h3 className="question-text">{question}</h3>
        </div>

        <div className="question-input-area">
          <textarea
            className={`question-input ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || isAnswered}
            rows={5}
          />
        </div>

        {showScore && score !== undefined && (
          <div className={`question-score ${getScoreColor(score)}`}>
            <div className="score-display">
              <span className="score-value">{score}</span>
              <span className="score-max">/{maxScore}</span>
            </div>
            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        )}

        {!isAnswered && isActive && (
          <div className="question-actions">
            <button
              className="btn-submit"
              onClick={onSubmit}
              disabled={!answer.trim()}
            >
              Submit Answer
            </button>
          </div>
        )}

        {isAnswered && (
          <div className="question-actions">
            <button className="btn-next" disabled>
              Answer Submitted
            </button>
          </div>
        )}
      </div>
    );
  }

  // Legacy fallback for simple card
  return (
    <div className="question-card legacy">
      <h3>{question}</h3>
      <textarea 
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your answer here..."
      />
    </div>
  );
};

export default QuestionCard;