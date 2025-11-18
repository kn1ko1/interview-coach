import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import '../styles/CVUploader.css';

// Get API base URL from environment or use defaults
const getApiUrl = (): string => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://api.interview-coach.com' // Update with your actual domain
    : 'http://localhost:5000';
};

interface CVUploaderProps {
  onUpload: (file: File) => void;
  isModal?: boolean;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onUpload, isModal = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { token } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      setError(`File size exceeds 5MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB.`);
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file || !token) {
      setError('Please select a file and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();

      const response = await fetch(`${getApiUrl()}/api/cv/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cvText: text }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(file);
      setSuccess(`CV uploaded successfully! ID: ${data.cvId}`);
      setFile(null);
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerClass = isModal ? 'cv-uploader-modal' : 'cv-uploader';

  return (
    <div className={containerClass}>
      <h2>Upload Your CV</h2>
      
      {error && <div className="cv-error">{error}</div>}
      {success && <div className="cv-success">{success}</div>}

      <div 
        className={`cv-upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileSelect}
          disabled={loading}
          id="cv-file-input"
          className="cv-upload-input"
        />
        <label htmlFor="cv-file-input" style={{ cursor: 'pointer', width: '100%' }}>
          {file ? (
            <div className="cv-file-info">
              <p className="cv-upload-text">✓ {file.name}</p>
              <p className="cv-upload-subtext">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div>
              <div className="cv-upload-icon">📄</div>
              <p className="cv-upload-text">Drag and drop your CV</p>
              <p className="cv-upload-subtext">or click to select (PDF, TXT, DOC, DOCX)</p>
            </div>
          )}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="cv-upload-button"
      >
        {loading ? 'Uploading...' : 'Upload CV'}
      </button>
      
      {file && (
        <button
          onClick={() => setFile(null)}
          className="cv-clear-button"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default CVUploader;