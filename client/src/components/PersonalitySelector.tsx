import React from 'react';
import '../styles/PersonalitySelector.css';

export type PersonalityMode = 'supportive' | 'direct';

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
          className={`personality-button direct ${selectedPersonality === 'direct' ? 'active' : ''}`}
          onClick={() => onPersonalityChange('direct')}
          disabled={disabled}
          title="Direct: Honest, detailed feedback for focused preparation"
        >
          <span className="personality-icon">🎯</span>
          <span className="personality-name">Direct Coach</span>
          <span className="personality-desc">Honest & detailed feedback</span>
        </button>
      </div>
    </div>
  );
};

export default PersonalitySelector;
