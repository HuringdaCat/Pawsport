import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMService } from 'lib/services/llmService';

const llmService = new LLMService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { origin, destination, species, breed, vaccinationStatus } = req.body;
    
    if (!origin || !destination || !species) {
      return res.status(400).json({ message: 'Missing required fields: origin, destination, species' });
    }

    const checklist = await llmService.getTravelChecklist({ 
      origin, 
      destination, 
      species, 
      breed, 
      vaccinationStatus 
    });
    
    return res.status(200).json(checklist);
  } catch (error: any) {
    console.error('Error generating travel checklist:', error);
    return res.status(500).json({ 
      message: 'Error generating travel checklist', 
      error: error.message 
    });
  }
}
