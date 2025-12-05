import { Router } from 'express';
import { getTravelChecklist, getRegulationSummary, getDocumentExplanation } from '../controllers/travelController';

const router = Router();

// Route to get personalized travel checklist
router.get('/checklist', getTravelChecklist);

// Route to get regulation summary
router.get('/regulations', getRegulationSummary);

// Route to get document explanation
router.get('/documents', getDocumentExplanation);

export default router;