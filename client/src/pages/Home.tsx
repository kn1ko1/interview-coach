import React, { useState } from 'react';
import CVUploader from '../components/CVUploader';
import ChatInterface from '../components/ChatInterface';
import JobSpecUploader from '../components/JobSpecUploader';
import PersonalitySelector, { PersonalityMode } from '../components/PersonalitySelector';
import MetricsCard from '../components/MetricsCard';
import './Home.css';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [cv, setCv] = useState<File | null>(null);
  const [jobSpec, setJobSpec] = useState<string>('');
  const [personality, setPersonality] = useState<PersonalityMode>('confidence');
  const [showForm, setShowForm] = useState(false);

  const handleCvUpload = (file: File) => {
    setCv(file);
  };

  const handleJobSpecUpload = (spec: string) => {
    setJobSpec(spec);
  };

  const features: FeatureItem[] = [
    {
      icon: '🎯',
      title: 'Real Interview Scenarios',
      description: 'Practice with realistic questions used in actual technical interviews',
    },
    {
      icon: '📊',
      title: 'Instant Scoring',
      description: 'Get immediate feedback on your answers with detailed scoring breakdown',
    },
    {
      icon: '🎓',
      title: 'Personalized Coaching',
      description: 'Choose your coaching style - Build Confidence or Drive Performance',
    },
    {
      icon: '📄',
      title: 'CV Integration',
      description: 'Upload your CV for CV-specific feedback and alignment analysis',
    },
  ];

  const stats = [
    { label: 'Interview Questions', value: '7' },
    { label: 'Scoring Criteria', value: '5' },
    { label: 'Analysis Metrics', value: '10+' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Your Next Interview</h1>
          <p className="hero-subtitle">
            Practice realistic interview questions with AI-powered coaching and get instant feedback
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary-hero"
              onClick={() => setShowForm(!showForm)}
            >
              Start Interview Challenge →
            </button>
            <button
              className="btn-secondary-hero"
              onClick={() => window.location.href = '/results'}
            >
              View Sample Results
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Interview Coach?</h2>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2>What's Included</h2>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <MetricsCard
              key={idx}
              title={stat.label}
              value={stat.value}
              variant="primary"
              icon="⭐"
            />
          ))}
        </div>
      </section>

      {/* Interview Form Section */}
      {showForm && (
        <section className="form-section">
          <div className="form-container">
            <h2>Begin Your Interview</h2>

            {/* Step 1: Personality Selection */}
            <div className="form-step">
              <h3 className="step-title">Step 1: Choose Your Coaching Style</h3>
              <div className="step-content">
                <PersonalitySelector
                  selectedPersonality={personality}
                  onPersonalityChange={setPersonality}
                />
                <p className="step-description">
                  {personality === 'confidence'
                    ? 'Focus on building confidence and growth mindset'
                    : 'Focus on rigorous, performance-driven feedback'}
                </p>
              </div>
            </div>

            {/* Step 2: CV Upload */}
            <div className="form-step">
              <h3 className="step-title">Step 2: Upload Your CV (Optional)</h3>
              <div className="step-content">
                <CVUploader onUpload={handleCvUpload} />
                {cv && (
                  <p className="step-success">
                    ✓ CV loaded: {cv.name}
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: Job Spec */}
            <div className="form-step">
              <h3 className="step-title">Step 3: Add Job Description (Optional)</h3>
              <div className="step-content">
                <JobSpecUploader onJobSpecSubmit={handleJobSpecUpload} />
                {jobSpec && (
                  <p className="step-success">
                    ✓ Job description loaded
                  </p>
                )}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="form-step">
              <h3 className="step-title">Step 4: Start Chatting</h3>
              <div className="step-content chat-wrapper">
                <ChatInterface
                  cv={cv?.name || ''}
                  jobSpec={jobSpec}
                  personality={personality}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;