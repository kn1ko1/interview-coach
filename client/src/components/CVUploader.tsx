import React, { useState } from 'react';
import { useAuth } from '../context/authContext';

interface CVUploaderProps {
  onUpload: (file: File) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess('');
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

      const response = await fetch('http://localhost:5000/api/cv/upload', {
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

  return (
    <div className="cv-uploader">
      <h2>Upload Your CV</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileSelect}
          disabled={loading}
          id="cv-file-input"
        />
        <label htmlFor="cv-file-input" className="file-label">
          {file ? file.name : 'Choose a file...'}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="upload-button"
      >
        {loading ? 'Uploading...' : 'Upload CV'}
      </button>
    </div>
  );
};

export default CVUploader;