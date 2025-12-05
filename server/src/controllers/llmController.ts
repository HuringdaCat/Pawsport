import { Request, Response } from 'express';
import { LLMService } from '../services/llmService';

class LLMController {
    private llmService: LLMService;

    constructor() {
        this.llmService = new LLMService();
    }

    public async explainTravelRules(req: Request, res: Response): Promise<void> {
        try {
            const { origin, destination, petType } = req.body;
            const explanation = await this.llmService.getTravelRuleExplanation(origin, destination, petType);
            res.status(200).json({ explanation });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while explaining travel rules.' });
        }
    }

    public async summarizeDocuments(req: Request, res: Response): Promise<void> {
        try {
            const { documents } = req.body;
            const summary = await this.llmService.summarizeDocuments(documents);
            res.status(200).json({ summary });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while summarizing documents.' });
        }
    }

    public async culturalNotes(req: Request, res: Response): Promise<void> {
        try {
            const { country } = req.params;
            const notes = await this.llmService.getCulturalNotes(country);
            res.status(200).json({ notes });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving cultural notes.' });
        }
    }
}

export default new LLMController();