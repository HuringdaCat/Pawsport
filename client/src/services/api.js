import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Function to get personalized travel checklist
export const getTravelChecklist = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/travel/checklist`, data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching travel checklist: ' + error.message);
    }
};

// Function to get regulation summary
export const getRegulationSummary = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/travel/regulations`, data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching regulation summary: ' + error.message);
    }
};

// Function to explain veterinary documents
export const explainDocuments = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/travel/documents`, data);
        return response.data;
    } catch (error) {
        throw new Error('Error explaining documents: ' + error.message);
    }
};

// Function to get community posts
export const getCommunityPosts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/community/posts`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching community posts: ' + error.message);
    }
};

// Function to create a new community post
export const createCommunityPost = async (post) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/community/posts`, post);
        return response.data;
    } catch (error) {
        throw new Error('Error creating community post: ' + error.message);
    }
};

// Function to get matching pet owners (mock for now)
export const getMatchingPetOwners = async () => {
    // Mock data since server endpoint doesn't exist yet
    return {
        data: [
            {
                id: '1',
                name: 'Sarah Johnson',
                location: 'New York',
                destination: 'Paris',
                petType: 'Dog',
                travelDate: '2024-03-15'
            },
            {
                id: '2',
                name: 'Mike Chen',
                location: 'Los Angeles',
                destination: 'Tokyo',
                petType: 'Cat',
                travelDate: '2024-03-20'
            }
        ]
    };
};