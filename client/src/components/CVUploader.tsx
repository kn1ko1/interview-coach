import React, { useState } from 'react';

interface CVUploaderProps {
  onUpload: (file: File) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async (): Promise<void> => {
        if (!file) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('cv', file);

        try {
            const response = await fetch('/api/upload-cv', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('CV uploaded successfully!');
                onUpload(file);
            } else {
                setUploadStatus('Failed to upload CV. Please try again.');
            }
        } catch {
            setUploadStatus('An error occurred while uploading the CV.');
        }
    };

    // Sync wrapper to satisfy onClick's void return type
    const onUploadClick = () => {
        void handleUpload();
    };

    return (
        <div>
            <h2>Upload Your CV</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <button onClick={onUploadClick}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default CVUploader;