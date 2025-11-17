import axios from 'axios';

// Use environment variable for API base URL. Defaults to localhost for development.
// In production, this should be set to your HTTPS endpoint.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (
  process.env.NODE_ENV === 'production'
    ? 'https://api.interview-coach.com' // Update with your actual domain
    : 'http://localhost:5000'
);

export const uploadCV = async (formData: FormData): Promise<any> => {
    try {
          const response = await axios.post(`${API_BASE_URL}/upload-cv`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) throw new Error('Error uploading CV: ' + error.message);
        throw new Error('Error uploading CV: Unknown error');
    }
};

export const submitResponses = async (responses: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit-responses`, responses);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) throw new Error('Error submitting responses: ' + error.message);
        throw new Error('Error submitting responses: Unknown error');
    }
};

export const getEmployabilityScore = async (userId: string): Promise<number> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employability-score/${userId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) throw new Error('Error fetching employability score: ' + error.message);
        throw new Error('Error fetching employability score: Unknown error');
    }
};

/**
 * calculateScore
 * - payload: responses + optional keywords/cvId
 * - returns numeric score (backend should expose /calculate-score or adjust as needed)
 */
export const calculateScore = async (payload: {
    responses: Record<string, unknown>;
    keywords?: string[];
    cvId?: string;
}): Promise<number> => {
    try {
        // If your backend exposes a calculate endpoint, call it. Otherwise adapt to existing endpoints.
        const response = await axios.post(`${API_BASE_URL}/calculate-score`, payload);
        // Expecting { score: number } from server
        return response.data.score;
    } catch (error: unknown) {
        if (error instanceof Error) throw new Error('Error calculating score: ' + error.message);
        throw new Error('Error calculating score: Unknown error');
    }
};