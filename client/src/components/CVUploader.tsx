import React, { useState } from 'react';
import { useAuth } from '../context/authContext';

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

  const containerClass = isModal ? 'cv-uploader-modal' : 'cv-uploader';

  return (
    <div className={containerClass}>
      <h2>Upload Your CV</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div 
        className={`file-input-wrapper ${isDragOver ? 'drag-over' : ''}`}
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
        />
        <label htmlFor="cv-file-input" className="file-label">
          {file ? (
            <span>{file.name}</span>
          ) : (
            <div className="drag-drop-text">
              <p>📄 Drag and drop your CV</p>
              <p style={{ fontSize: '0.9em', marginTop: '8px' }}>or click to select</p>
            </div>
          )}
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