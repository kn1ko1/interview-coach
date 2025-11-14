import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Function to upload CV
export const uploadCV = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/upload-cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading CV: ' + (error instanceof Error ? error.message : String(error)));
    }
};

// Function to submit interview responses
export const submitResponses = async (responses: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit-responses`, responses);
        return response.data;
    } catch (error) {
        throw new Error('Error submitting responses: ' + (error instanceof Error ? error.message : String(error)));
    }
};

// Function to get employability score
export const getEmployabilityScore = async (userId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employability-score/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching employability score: ' + (error instanceof Error ? error.message : String(error)));
    }
};

// Add your existing exports here if any

export const calculateScore = async (responses: any, keywords: any[], cv: any) => {
    // TODO: Implement score calculation logic
    // This is a placeholder implementation
    return 0;
};