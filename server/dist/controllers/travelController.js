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
const regulationService_1 = require("../services/regulationService");
const llmService_1 = require("../services/llmService");
class TravelController {
    constructor() {
        this.regulationService = new regulationService_1.RegulationService();
        this.llmService = new llmService_1.LLMService();
    }
    getTravelChecklist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { origin, destination, species, breed, vaccinationStatus } = req.body;
                const checklist = yield this.regulationService.generateChecklist(origin, destination, species, breed, vaccinationStatus);
                res.status(200).json(checklist);
            }
            catch (error) {
                res.status(500).json({ message: 'Error generating travel checklist', error });
            }
        });
    }
    getRegulationSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { origin, destination } = req.params;
                const summary = yield this.regulationService.getRegulationSummary(origin, destination);
                res.status(200).json(summary);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching regulation summary', error });
            }
        });
    }
    explainDocuments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { documents } = req.body;
                const explanations = yield this.llmService.explainDocuments(documents);
                res.status(200).json(explanations);
            }
            catch (error) {
                res.status(500).json({ message: 'Error explaining documents', error });
            }
        });
    }
}
exports.default = new TravelController();
