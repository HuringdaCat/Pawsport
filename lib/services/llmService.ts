import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export class LLMService {
    public async getTravelChecklist(params: any): Promise<any> {
        console.log('=== LIB LLM Service getTravelChecklist ===');
        console.log('OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
        
        if (!OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not configured');
        }
        
        try {
            const prompt = `Generate a detailed pet travel plan in JSON format for:
- Origin: ${params.origin}
- Destination: ${params.destination}
- Pet: ${params.species} (${params.breed || 'mixed breed'})
- Travel Date: ${params.travelDate}

Return ONLY a JSON object with this structure (no markdown):
{
  "origin": "${params.origin}",
  "destination": "${params.destination}",
  "species": "${params.species}",
  "breed": "${params.breed || 'mixed'}",
  "travelDate": "${params.travelDate}",
  "timeline": [
    {
      "id": "timeline-1",
      "title": "Veterinary Consultation",
      "date": "ISO date",
      "daysBeforeTravel": 90,
      "category": "veterinary",
      "tasks": [
        {"id": "t1", "title": "Task", "description": "Details", "completed": false}
      ]
    }
  ],
  "checklist": [
    {
      "id": "check-1",
      "title": "Task name",
      "description": "Details",
      "completed": false,
      "priority": "high",
      "category": "veterinary",
      "estimatedDuration": "1 day"
    }
  ],
  "regulationSummary": "Summary of key regulations",
  "criticalAlerts": ["Alert 1", "Alert 2"]
}`;

            console.log('Calling OpenAI API...');
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a pet travel assistant. Return ONLY valid JSON, no markdown.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            console.log('Received response, parsing JSON...');
            const plan = JSON.parse(content);
            console.log('Successfully parsed plan');
            return plan;
        } catch (error: any) {
            console.error('Error in getTravelChecklist:', error.message);
            throw new Error('Error fetching travel checklist: ' + error.message);
        }
    }

    public async getRegulationSummary(params: any): Promise<any> {
        try {
            return { summary: 'Regulation summary not implemented yet' };
        } catch (error: any) {
            throw new Error('Error fetching regulation summary: ' + error.message);
        }
    }

    public async explainDocuments(documents: any[]): Promise<any> {
        try {
            return { explanation: 'Document explanation not implemented yet' };
        } catch (error: any) {
            throw new Error('Error explaining documents: ' + error.message);
        }
    }

    public async getCulturalNotes(params: any): Promise<any> {
        try {
            return { notes: 'Cultural notes not implemented yet' };
        } catch (error: any) {
            throw new Error('Error fetching cultural notes: ' + error.message);
        }
    }
}

export default new LLMService();