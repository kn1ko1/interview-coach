import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import '../index.css';
import { useLocation } from 'react-router-dom';

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