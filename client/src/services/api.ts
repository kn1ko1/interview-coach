import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

// Function to upload CV
export const uploadCV = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/upload-cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error uploading CV: ' + error.message);
    }
};

// Function to submit interview responses
export const submitResponses = async (responses) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit-responses`, responses);
        return response.data;
    } catch (error) {
        throw new Error('Error submitting responses: ' + error.message);
    }
};

// Function to get employability score
export const getEmployabilityScore = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employability-score/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching employability score: ' + error.message);
    }
};