import { RegulationData, RegulationSummary } from '../types';

class RegulationService {
    private regulations: RegulationData[];

    constructor() {
        this.regulations = [];
    }

    public loadRegulations(data: RegulationData[]): void {
        this.regulations = data;
    }

    public getRegulationSummary(country: string): RegulationSummary | null {
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

    public getAllRegulations(): RegulationData[] {
        return this.regulations;
    }
}

export default new RegulationService();