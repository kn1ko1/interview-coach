import React from 'react';
import '../styles/MetricsCard.css';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info';
  progress?: number;
  maxProgress?: number;
  children?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'info',
  progress,
  maxProgress = 100,
  children,
}) => {
  const progressPercentage = 
    progress !== undefined && maxProgress > 0 
      ? (progress / maxProgress) * 100 
      : 0;

  return (
    <div className={`metrics-card metrics-${variant}`}>
      {icon && <div className="metrics-icon">{icon}</div>}
      
      <div className="metrics-content">
        <h3 className="metrics-title">{title}</h3>
        <div className="metrics-value">{value}</div>
        {subtitle && <p className="metrics-subtitle">{subtitle}</p>}
      </div>

      {progress !== undefined && (
        <div className="metrics-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      {children && <div className="metrics-footer">{children}</div>}
    </div>
  );
};

export default MetricsCard;
