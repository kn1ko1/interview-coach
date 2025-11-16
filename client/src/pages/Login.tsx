import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [error, setError] = useState('');
  const { login, verifyToken } = useAuth();
  const history = useHistory();

  const handleEmailSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email);
      setShowTokenInput(true);
    } catch (err) {
      setError('Failed to send login link. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyToken(tokenInput);
      history.push('/');
    } catch (err) {
      setError('Invalid or expired token. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Interview Coach</h1>
        <p className="login-subtitle">Prepare for success</p>

        {error && <div className="error-message">{error}</div>}

        {!showTokenInput ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTokenSubmit}>
            <div className="form-group">
              <label htmlFor="token">Token (from email or console)</label>
              <textarea
                id="token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste your JWT token here"
                required
                disabled={loading}
                rows={6}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Token'}
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => {
                setShowTokenInput(false);
                setTokenInput('');
              }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        <div className="login-info">
          <p>In development mode, check the browser console for the test token.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;