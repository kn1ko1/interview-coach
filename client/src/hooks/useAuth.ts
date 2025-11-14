import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import '../index.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface CVUploaderProps {
  onUpload: (file: File) => void;
}
const CVUploader: React.FC<CVUploaderProps> = ({ onUpload }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) onUpload(file);
  };

  return React.createElement('input', { type: 'file', accept: '.pdf,.doc,.docx', onChange });
};

ReactDOM.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  ),
  document.getElementById('root')
);

const handleResponseChange = (response: string) => {
  console.log(response);
};

export const uploadCV = async (formData: FormData) => {
  try {
    // ...
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error uploading CV: ' + error.message);
    }
    throw new Error('Error uploading CV: Unknown error');
  }
};

interface ResultsState {
  score: number;
  responses: any[];
}
const location = useLocation();
const { score, responses } = (location.state as ResultsState) || { score: 0, responses: [] };

// Define the shape of your user object and auth state
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  token: string | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    // In a real application, you would check for a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you would typically decode the token to get user info
      // and verify its expiration.
      // For this example, we'll assume the token is valid.
      setAuthState({
        isAuthenticated: true,
        // This is placeholder user data
        user: { id: '1', email: 'user@example.com' },
        token: token,
      });
    }
  }, []);

  const login = (token: string, user: { id: string; email: string }) => {
    localStorage.setItem('authToken', token);
    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return { authState, login, logout };
};

export default useAuth;