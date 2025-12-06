import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMService } from 'lib/services/llmService';

const llmService = new LLMService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { documents } = req.body;
    
    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ 
        message: 'Missing or invalid required field: documents (must be an array)' 
      });
    }

    const explanations = await llmService.explainDocuments(documents);
    
    return res.status(200).json(explanations);
  } catch (error: any) {
    console.error('Error explaining documents:', error);
    return res.status(500).json({ 
      message: 'Error explaining documents', 
      error: error.message 
    });
  }
}
