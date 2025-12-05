"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const llmService_1 = require("../services/llmService");
class LLMController {
    constructor() {
        this.llmService = new llmService_1.LLMService();
    }
    explainTravelRules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { origin, destination, petType } = req.body;
                const explanation = yield this.llmService.getTravelRuleExplanation(origin, destination, petType);
                res.status(200).json({ explanation });
            }
            catch (error) {
                res.status(500).json({ error: 'An error occurred while explaining travel rules.' });
            }
        });
    }
    summarizeDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { documents } = req.body;
                const summary = yield this.llmService.summarizeDocuments(documents);
                res.status(200).json({ summary });
            }
            catch (error) {
                res.status(500).json({ error: 'An error occurred while summarizing documents.' });
            }
        });
    }
    culturalNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { country } = req.params;
                const notes = yield this.llmService.getCulturalNotes(country);
                res.status(200).json({ notes });
            }
            catch (error) {
                res.status(500).json({ error: 'An error occurred while retrieving cultural notes.' });
            }
        });
    }
}
exports.default = new LLMController();
