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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCulturalNotes = exports.explainDocuments = exports.getRegulationSummary = exports.getTravelChecklist = void 0;
const axios_1 = __importDefault(require("axios"));
const LLM_API_URL = 'https://api.example.com/llm'; // Replace with actual LLM API URL
const getTravelChecklist = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${LLM_API_URL}/travel-checklist`, params);
        return response.data;
    }
    catch (error) {
        throw new Error('Error fetching travel checklist: ' + error.message);
    }
});
exports.getTravelChecklist = getTravelChecklist;
const getRegulationSummary = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${LLM_API_URL}/regulation-summary`, params);
        return response.data;
    }
    catch (error) {
        throw new Error('Error fetching regulation summary: ' + error.message);
    }
});
exports.getRegulationSummary = getRegulationSummary;
const explainDocuments = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${LLM_API_URL}/document-explainer`, params);
        return response.data;
    }
    catch (error) {
        throw new Error('Error explaining documents: ' + error.message);
    }
});
exports.explainDocuments = explainDocuments;
const getCulturalNotes = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${LLM_API_URL}/cultural-notes`, params);
        return response.data;
    }
    catch (error) {
        throw new Error('Error fetching cultural notes: ' + error.message);
    }
});
exports.getCulturalNotes = getCulturalNotes;
