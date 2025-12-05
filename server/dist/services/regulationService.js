"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = new RegulationService();
