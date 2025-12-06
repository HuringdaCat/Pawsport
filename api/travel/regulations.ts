import { VercelRequest, VercelResponse } from '@vercel/node';
import { RegulationService } from 'lib/services/regulationService';

const regulationService = new RegulationService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Support both GET with query params and POST with body
    const country = req.method === 'GET' 
      ? (req.query.country as string)
      : req.body.country;
    
    if (!country) {
      return res.status(400).json({ message: 'Missing required field: country' });
    }

    const summary = regulationService.getRegulationSummary(country);
    
    if (!summary) {
      return res.status(404).json({ 
        message: `No regulations found for country: ${country}` 
      });
    }
    
    return res.status(200).json(summary);
  } catch (error: any) {
    console.error('Error fetching regulation summary:', error);
    return res.status(500).json({ 
      message: 'Error fetching regulation summary', 
      error: error.message 
    });
  }
}
