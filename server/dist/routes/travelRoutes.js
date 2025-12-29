"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const travelController_1 = __importDefault(require("../controllers/travelController"));
const router = (0, express_1.Router)();
// Route to get personalized travel checklist
router.post('/checklist', travelController_1.default.getTravelChecklist.bind(travelController_1.default));
// Route to get regulation summary
router.get('/regulations/:country', travelController_1.default.getRegulationSummary.bind(travelController_1.default));
// Route to get document explanation
router.post('/documents', travelController_1.default.explainDocuments.bind(travelController_1.default));
exports.default = router;
