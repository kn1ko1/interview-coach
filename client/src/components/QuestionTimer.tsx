import React, { useEffect, useState } from 'react';
import '../styles/QuestionTimer.css';
import { PersonalityMode } from './PersonalitySelector';

interface QuestionTimerProps {
  isActive: boolean;
  onTimerUpdate?: (secondsElapsed: number) => void;
  personality: PersonalityMode;
  suggestedTimeSeconds?: number;
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({
  isActive,
  onTimerUpdate,
  personality,
  suggestedTimeSeconds = 180, // Default 3 minutes
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setSecondsElapsed(0);
      setIsWarning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const newValue = prev + 1;
        onTimerUpdate?.(newValue);

        // Warning when over suggested time
        if (personality === 'performance' && newValue > suggestedTimeSeconds && !isWarning) {
          setIsWarning(true);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, personality, suggestedTimeSeconds, isWarning, onTimerUpdate]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const suggestedMinutes = Math.floor(suggestedTimeSeconds / 60);
  const suggestedSeconds = suggestedTimeSeconds % 60;

  const isOverTime = secondsElapsed > suggestedTimeSeconds;
  const percentageOvertime = isOverTime
    ? Math.min(((secondsElapsed - suggestedTimeSeconds) / suggestedTimeSeconds) * 100, 100)
    : 0;

  const formatTime = (mins: number, secs: number) =>
    `${mins}:${secs.toString().padStart(2, '0')}`;

  if (!isActive) {
    return null;
  }

  return (
    <div className={`question-timer ${personality} ${isOverTime ? 'warning' : ''}`}>
      <div className="timer-content">
        <span className="timer-icon">⏱️</span>
        <span className={`timer-display ${isOverTime ? 'over-time' : ''}`}>
          {formatTime(minutes, seconds)}
        </span>
        {personality === 'performance' && (
          <span className="timer-suggested">
            Suggested: {formatTime(suggestedMinutes, suggestedSeconds)}
          </span>
        )}
      </div>

      {personality === 'performance' && (
        <div className="timer-progress">
          <div className="progress-bar-container">
            <div
              className={`progress-fill ${isOverTime ? 'over' : 'normal'}`}
              style={{
                width: `${Math.min((secondsElapsed / (suggestedTimeSeconds * 1.5)) * 100, 100)}%`,
              }}
            />
          </div>
          {isOverTime && (
            <div className="overtime-indicator">
              +{Math.round(percentageOvertime)}% over suggested time
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionTimer;
