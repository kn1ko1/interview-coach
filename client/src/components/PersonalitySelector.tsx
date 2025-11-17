import React from 'react';
import '../styles/PersonalitySelector.css';

export type PersonalityMode = 'supportive' | 'ruthless';

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
      <label className="personality-label">Choose Your Coach:</label>
      <div className="personality-options">
        <button
          className={`personality-button supportive ${selectedPersonality === 'supportive' ? 'active' : ''}`}
          onClick={() => onPersonalityChange('supportive')}
          disabled={disabled}
          title="Supportive: Encouraging feedback with constructive guidance"
        >
          <span className="personality-icon">🤝</span>
          <span className="personality-name">Supportive</span>
          <span className="personality-desc">Encouraging & constructive</span>
        </button>

        <button
          className={`personality-button ruthless ${selectedPersonality === 'ruthless' ? 'active' : ''}`}
          onClick={() => onPersonalityChange('ruthless')}
          disabled={disabled}
          title="Ruthless: Direct, critical feedback for tough preparation"
        >
          <span className="personality-icon">🎯</span>
          <span className="personality-name">Ruthless</span>
          <span className="personality-desc">Direct & critical feedback</span>
        </button>
      </div>
    </div>
  );
};

export default PersonalitySelector;
