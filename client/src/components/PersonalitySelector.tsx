import React from 'react';
import '../styles/PersonalitySelector.css';

export type PersonalityMode = 'confidence' | 'performance';

interface PersonalitySelectorProps {
  selectedPersonality: PersonalityMode;
  onPersonalityChange: (personality: PersonalityMode) => void;
  disabled?: boolean;
}

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  selectedPersonality,
  onPersonalityChange,
  disabled = false,
}) => {
  return (
    <div className="personality-selector">
      <label className="personality-label">Coaching Focus:</label>
      <div className="personality-switch-container">
        <div className="personality-switch">
          <input
            type="checkbox"
            id="personality-toggle"
            checked={selectedPersonality === 'performance'}
            onChange={(e) => onPersonalityChange(e.target.checked ? 'performance' : 'confidence')}
            disabled={disabled}
            className="personality-checkbox"
          />
          <label htmlFor="personality-toggle" className="personality-toggle-label">
            <span className="toggle-option confidence-option">
              <span className="toggle-icon">🤝</span>
              <span className="toggle-name">Confidence</span>
            </span>
            <span className="toggle-slider"></span>
            <span className="toggle-option performance-option">
              <span className="toggle-icon">🎯</span>
              <span className="toggle-name">Performance</span>
            </span>
          </label>
        </div>
        <p className="personality-desc">
          {selectedPersonality === 'confidence' 
            ? "Build confidence with encouragement and constructive feedback"
            : "Rigorous feedback to sharpen your performance"}
        </p>
      </div>
    </div>
  );
};

export default PersonalitySelector;
