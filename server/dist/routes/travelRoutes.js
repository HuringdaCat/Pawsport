"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const travelController_1 = require("../controllers/travelController");
const router = (0, express_1.Router)();
// Route to get personalized travel checklist
router.get('/checklist', travelController_1.getTravelChecklist);
// Route to get regulation summary
router.get('/regulations', travelController_1.getRegulationSummary);
// Route to get document explanation
router.get('/documents', travelController_1.getDocumentExplanation);
exports.default = router;
