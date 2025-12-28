"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulationService = void 0;
class RegulationService {
    constructor() {
        this.regulations = [];
    }
    loadRegulations(data) {
        this.regulations = data;
    }
    getRegulationSummary(country) {
        const regulation = this.regulations.find(reg => reg.country === country);
        if (!regulation) {
            return null;
        }
        return {
            country: regulation.country,
            requirements: regulation.requirements,
            timelines: regulation.timelines,
            culturalNotes: regulation.culturalNotes,
        };
    }
    getAllRegulations() {
        return this.regulations;
    }
}
exports.RegulationService = RegulationService;
