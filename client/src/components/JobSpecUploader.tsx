import React, { useState } from 'react';
import '../styles/JobSpecUploader.css';

interface JobSpecUploaderProps {
  onJobSpecSubmit: (jobSpec: string) => void;
  isLoading?: boolean;
  isModal?: boolean;
}

const JobSpecUploader: React.FC<JobSpecUploaderProps> = ({ onJobSpecSubmit, isLoading = false, isModal = false }) => {
  const [jobSpec, setJobSpec] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSetFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['text/plain', 'application/pdf', 'text/html', 'text/markdown'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
      setError('Please upload a text file, PDF, HTML, or Markdown file');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJobSpec(content);
      setSuccessMessage(`Loaded: ${file.name}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
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

  const handlePaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobSpec(event.target.value);
    setFileName('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!jobSpec.trim()) {
      setError('Please provide a job description');
      return;
    }

    if (jobSpec.trim().length < 50) {
      setError('Job description must be at least 50 characters');
      return;
    }

    try {
      setError('');
      await onJobSpecSubmit(jobSpec);
      setSuccessMessage('Job description processed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process job description');
    }
  };

  const handleClear = () => {
    setJobSpec('');
    setFileName('');
    setError('');
    setSuccessMessage('');
  };

  const containerClass = isModal ? 'job-spec-uploader-modal' : 'job-spec-uploader';

  return (
    <div className={containerClass}>
      <div className="uploader-header">
        <h2>Job Description</h2>
      </div>

      <div className="upload-method-tabs">
        <button
          className={`tab-button ${uploadMethod === 'paste' ? 'active' : ''}`}
          onClick={() => setUploadMethod('paste')}
        >
          Paste Text
        </button>
        <button
          className={`tab-button ${uploadMethod === 'file' ? 'active' : ''}`}
          onClick={() => setUploadMethod('file')}
        >
          Upload File
        </button>
      </div>

      <div className="uploader-content">
        {uploadMethod === 'paste' ? (
          <div className="paste-section">
            <textarea
              className="job-spec-textarea"
              value={jobSpec}
              onChange={handlePaste}
              placeholder="Paste the job description here..."
              disabled={isLoading}
              rows={10}
            />
            <div className="char-count">
              {jobSpec.length} characters
            </div>
          </div>
        ) : (
          <div 
            className={`file-upload-section ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="file-input-wrapper">
              <input
                type="file"
                id="job-spec-file"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.html,.md"
                disabled={isLoading}
                className="file-input"
              />
              <label htmlFor="job-spec-file" className="file-input-label">
                <div className="upload-icon">📄</div>
                <p>Drag and drop or click to select</p>
                <small>Supported: TXT, PDF, HTML, Markdown (max 5MB)</small>
              </label>
            </div>
            
            {fileName && (
              <div className="file-info">
                <strong>File selected:</strong> {fileName}
              </div>
            )}

            {jobSpec && (
              <div className="file-preview">
                <strong>Preview:</strong>
                <pre>{jobSpec.substring(0, 500)}...</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="uploader-actions">
        <button
          className="btn-clear"
          onClick={handleClear}
          disabled={isLoading || !jobSpec}
        >
          Clear
        </button>
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={isLoading || !jobSpec.trim()}
        >
          {isLoading ? 'Processing...' : 'Analyze Job Description'}
        </button>
      </div>
    </div>
  );
};

export default JobSpecUploader;
