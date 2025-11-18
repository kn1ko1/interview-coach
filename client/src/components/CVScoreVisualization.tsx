import React from 'react';
import '../styles/CVUploader.css';

interface CVScoreVisualizationProps {
  strength: number;
  alignment: number;
  feedback: string;
}

const CVScoreVisualization: React.FC<CVScoreVisualizationProps> = ({
  strength,
  alignment,
  feedback
}) => {
  const getScoreColor = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 7) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const strengthColor = getScoreColor(strength);
  const alignmentColor = getScoreColor(alignment / 10); // Convert percentage to 0-10 scale

  return (
    <div className="cv-strength-score">
      <h3 className="cv-score-title">📊 CV Analysis</h3>

      <div className="cv-score-metric">
        <div className="cv-metric-label">
          <span>CV Strength</span>
          <span className="cv-metric-value">{strength}/10</span>
        </div>
        <div className="cv-score-bar">
          <div
            className={`cv-score-fill ${strengthColor}`}
            style={{ width: `${(strength / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="cv-score-metric">
        <div className="cv-metric-label">
          <span>Job Alignment</span>
          <span className="cv-metric-value">{alignment}%</span>
        </div>
        <div className="cv-score-bar">
          <div
            className={`cv-score-fill ${alignmentColor}`}
            style={{ width: `${alignment}%` }}
          />
        </div>
      </div>

      <div className="cv-alignment-details">
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Assessment:</p>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{feedback}</p>
      </div>
    </div>
  );
};

export default CVScoreVisualization;
