import { Request, Response } from 'express';
import { RegulationService } from '../services/regulationService';
import { LLMService } from '../services/llmService';

class TravelController {
    private regulationService: RegulationService;
    private llmService: LLMService;

    constructor() {
        this.regulationService = new RegulationService();
        this.llmService = new LLMService();
    }

    public async getTravelChecklist(req: Request, res: Response): Promise<void> {
        try {
            const { origin, destination, species, breed, vaccinationStatus } = req.body;
            const checklist = await this.llmService.getTravelChecklist({ origin, destination, species, breed, vaccinationStatus });
            res.status(200).json(checklist);
        } catch (error) {
            res.status(500).json({ message: 'Error generating travel checklist', error });
        }
    }

    public async getRegulationSummary(req: Request, res: Response): Promise<void> {
        try {
            const { country } = req.params;
            const summary = this.regulationService.getRegulationSummary(country);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching regulation summary', error });
        }
    }

    public async explainDocuments(req: Request, res: Response): Promise<void> {
        try {
            const { documents } = req.body;
            const explanations = await this.llmService.explainDocuments(documents);
            res.status(200).json(explanations);
        } catch (error) {
            res.status(500).json({ message: 'Error explaining documents', error });
        }
    }
}

export default new TravelController();