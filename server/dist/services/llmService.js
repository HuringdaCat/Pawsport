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
exports.LLMService = void 0;
const axios_1 = __importDefault(require("axios"));
const planValidationService_1 = __importDefault(require("./planValidationService"));
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_RETRIES = 2;
class LLMService {
    getTravelChecklist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastResult = null;
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    const prompt = planValidationService_1.default.createPromptForStructuredPlan(params);
                    const response = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-4',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a pet travel planning assistant. Always respond with valid JSON only, no markdown formatting.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 2000
                    }, {
                        headers: {
                            'Authorization': `Bearer ${OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    let data = response.data;
                    // Extract the content from OpenAI response
                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        const content = data.choices[0].message.content;
                        // Parse JSON from content
                        try {
                            data = JSON.parse(content);
                        }
                        catch (parseError) {
                            lastResult = {
                                valid: false,
                                warnings: [`Attempt ${attempt + 1}: Failed to parse JSON from OpenAI response`]
                            };
                            continue;
                        }
                    }
                    else {
                        lastResult = {
                            valid: false,
                            warnings: [`Attempt ${attempt + 1}: Invalid OpenAI response format`]
                        };
                        continue;
                    }
                    // Validate the plan
                    const validationResult = planValidationService_1.default.validatePlan(data);
                    if (validationResult.valid) {
                        return validationResult;
                    }
                    else {
                        lastResult = {
                            valid: false,
                            warnings: [...((lastResult === null || lastResult === void 0 ? void 0 : lastResult.warnings) || []), `Attempt ${attempt + 1}:`, ...validationResult.warnings]
                        };
                    }
                }
                catch (error) {
                    lastResult = {
                        valid: false,
                        warnings: [...((lastResult === null || lastResult === void 0 ? void 0 : lastResult.warnings) || []), `Attempt ${attempt + 1} error: ${error.message}`]
                    };
                }
            }
            return lastResult || {
                valid: false,
                warnings: ['Failed to generate valid plan after all retries']
            };
        });
    }
    getRegulationSummary(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mock implementation - replace with actual OpenAI call if needed
                return {
                    summary: 'Regulation summary not yet implemented with OpenAI'
                };
            }
            catch (error) {
                throw new Error('Error fetching regulation summary: ' + error.message);
            }
        });
    }
    explainDocuments(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mock implementation - replace with actual OpenAI call if needed
                return {
                    explanation: 'Document explanation not yet implemented with OpenAI'
                };
            }
            catch (error) {
                throw new Error('Error explaining documents: ' + error.message);
            }
        });
    }
    getCulturalNotes(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mock implementation - replace with actual OpenAI call if needed
                return {
                    notes: 'Cultural notes not yet implemented with OpenAI'
                };
            }
            catch (error) {
                throw new Error('Error fetching cultural notes: ' + error.message);
            }
        });
    }
    getTravelRuleExplanation(origin, destination, petType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mock implementation - replace with actual OpenAI call if needed
                return {
                    explanation: 'Travel rule explanation not yet implemented with OpenAI'
                };
            }
            catch (error) {
                throw new Error('Error explaining travel rules: ' + error.message);
            }
        });
    }
    summarizeDocuments(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mock implementation - replace with actual OpenAI call if needed
                return {
                    summary: 'Document summarization not yet implemented with OpenAI'
                };
            }
            catch (error) {
                throw new Error('Error summarizing documents: ' + error.message);
            }
        });
    }
}
exports.LLMService = LLMService;
exports.default = new LLMService();
