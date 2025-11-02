import React, { useState } from 'react';

const CVUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
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
            } else {
                setUploadStatus('Failed to upload CV. Please try again.');
            }
        } catch (error) {
            setUploadStatus('An error occurred while uploading the CV.');
        }
    };

    return (
        <div>
            <h2>Upload Your CV</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default CVUploader;