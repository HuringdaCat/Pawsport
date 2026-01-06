import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMService } from '../../lib/services/llmService';

const llmService = new LLMService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=== Checklist API Handler ===');
    console.log('Body:', req.body);
    
    const { origin, destination, species, breed, vaccinationStatus, travelDate } = req.body;
    
    if (!origin || !destination || !species) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: origin, destination, species' 
      });
    }

    const plan = await llmService.getTravelChecklist({ 
      origin, 
      destination, 
      species, 
      breed, 
      vaccinationStatus,
      travelDate 
    });
    
    console.log('Plan received, sending response');
    return res.status(200).json({
      success: true,
      plan: plan
    });
  } catch (error: any) {
    console.error('Error generating travel checklist:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error generating travel checklist', 
      error: error.message 
    });
  }
}
