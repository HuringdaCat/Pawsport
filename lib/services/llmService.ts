import axios from 'axios';

const LLM_API_URL = process.env.LLM_API_URL || 'https://api.example.com/llm';

export class LLMService {
    public async getTravelChecklist(params: any): Promise<any> {
        try {
            const response = await axios.post(`${LLM_API_URL}/travel-checklist`, params);
            return response.data;
        } catch (error: any) {
            throw new Error('Error fetching travel checklist: ' + error.message);
        }
    }

    public async getRegulationSummary(params: any): Promise<any> {
        try {
            const response = await axios.post(`${LLM_API_URL}/regulation-summary`, params);
            return response.data;
        } catch (error: any) {
            throw new Error('Error fetching regulation summary: ' + error.message);
        }
    }

    public async explainDocuments(documents: any[]): Promise<any> {
        try {
            const response = await axios.post(`${LLM_API_URL}/document-explainer`, { documents });
            return response.data;
        } catch (error: any) {
            throw new Error('Error explaining documents: ' + error.message);
        }
    }

    public async getCulturalNotes(params: any): Promise<any> {
        try {
            const response = await axios.post(`${LLM_API_URL}/cultural-notes`, params);
            return response.data;
        } catch (error: any) {
            throw new Error('Error fetching cultural notes: ' + error.message);
        }
    }
}

export default new LLMService();