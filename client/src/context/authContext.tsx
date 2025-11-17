import React, { createContext, useContext, useState, useEffect } from 'react';

// Get API base URL from environment or use defaults
const getApiUrl = (): string => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://api.interview-coach.com' // Update with your actual domain
    : 'http://localhost:5000';
};

interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      verifyTokenFunction(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      alert(`Login link sent to ${email}. Check the console for the token (development mode).`);
      console.log('Test token:', data.testToken);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const verifyTokenFunction = async (tokenToVerify: string): Promise<void> => {
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(tokenToVerify);
      localStorage.setItem('authToken', tokenToVerify);
    } catch (err) {
      console.error('Verification error:', err);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (tokenToVerify: string): Promise<void> => {
    setLoading(true);
    await verifyTokenFunction(tokenToVerify);
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, verifyToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};