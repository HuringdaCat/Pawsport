import { StructuredTravelPlan, TimelineItem, ChecklistTask, PlanValidationResult } from '../types';

export class PlanValidationService {
    private readonly MAX_RETRIES = 2;

    public validatePlan(data: any): PlanValidationResult {
        const warnings: string[] = [];

        // Check if data exists and is an object
        if (!data || typeof data !== 'object') {
            return { valid: false, warnings: ['Response is not a valid object'] };
        }

        // Validate required top-level fields
        if (!data.origin || typeof data.origin !== 'string') warnings.push('Missing or invalid "origin"');
        if (!data.destination || typeof data.destination !== 'string') warnings.push('Missing or invalid "destination"');
        if (!data.species || typeof data.species !== 'string') warnings.push('Missing or invalid "species"');
        if (!data.travelDate || typeof data.travelDate !== 'string') warnings.push('Missing or invalid "travelDate"');

        // Validate timeline array
        if (!Array.isArray(data.timeline)) {
            warnings.push('Missing or invalid "timeline" array');
        } else {
            data.timeline.forEach((item: any, index: number) => {
                const timelineWarnings = this.validateTimelineItem(item, index);
                warnings.push(...timelineWarnings);
            });
        }

        // Validate checklist array
        if (!Array.isArray(data.checklist)) {
            warnings.push('Missing or invalid "checklist" array');
        } else {
            data.checklist.forEach((item: any, index: number) => {
                const checklistWarnings = this.validateChecklistTask(item, index);
                warnings.push(...checklistWarnings);
            });
        }

        // Validate regulation summary
        if (!data.regulationSummary || typeof data.regulationSummary !== 'string') {
            warnings.push('Missing or invalid "regulationSummary"');
        }

        // Validate critical alerts (optional but must be array if present)
        if (data.criticalAlerts && !Array.isArray(data.criticalAlerts)) {
            warnings.push('"criticalAlerts" must be an array');
        }

        const valid = warnings.length === 0;
        return {
            valid,
            warnings,
            plan: valid ? (data as StructuredTravelPlan) : undefined
        };
    }

    private validateTimelineItem(item: any, index: number): string[] {
        const warnings: string[] = [];
        const prefix = `timeline[${index}]`;

        if (!item || typeof item !== 'object') {
            return [`${prefix} is not a valid object`];
        }

        if (!item.id) warnings.push(`${prefix}.id missing`);
        if (!item.title || typeof item.title !== 'string') warnings.push(`${prefix}.title missing or invalid`);
        if (!item.date || typeof item.date !== 'string') warnings.push(`${prefix}.date missing or invalid`);
        if (typeof item.daysBeforeTravel !== 'number') warnings.push(`${prefix}.daysBeforeTravel missing or invalid`);
        
        const validCategories = ['veterinary', 'documentation', 'booking', 'preparation'];
        if (!item.category || !validCategories.includes(item.category)) {
            warnings.push(`${prefix}.category invalid (must be: ${validCategories.join(', ')})`);
        }

        if (!Array.isArray(item.tasks)) {
            warnings.push(`${prefix}.tasks missing or not an array`);
        } else {
            item.tasks.forEach((task: any, taskIndex: number) => {
                if (!task.id) warnings.push(`${prefix}.tasks[${taskIndex}].id missing`);
                if (!task.title) warnings.push(`${prefix}.tasks[${taskIndex}].title missing`);
                if (typeof task.completed !== 'boolean') warnings.push(`${prefix}.tasks[${taskIndex}].completed must be boolean`);
            });
        }

        return warnings;
    }

    private validateChecklistTask(item: any, index: number): string[] {
        const warnings: string[] = [];
        const prefix = `checklist[${index}]`;

        if (!item || typeof item !== 'object') {
            return [`${prefix} is not a valid object`];
        }

        if (!item.id) warnings.push(`${prefix}.id missing`);
        if (!item.title || typeof item.title !== 'string') warnings.push(`${prefix}.title missing or invalid`);
        if (!item.description || typeof item.description !== 'string') warnings.push(`${prefix}.description missing or invalid`);
        if (typeof item.completed !== 'boolean') warnings.push(`${prefix}.completed must be boolean`);
        
        const validPriorities = ['high', 'medium', 'low'];
        if (!item.priority || !validPriorities.includes(item.priority)) {
            warnings.push(`${prefix}.priority invalid (must be: ${validPriorities.join(', ')})`);
        }

        const validCategories = ['veterinary', 'documentation', 'booking', 'preparation'];
        if (!item.category || !validCategories.includes(item.category)) {
            warnings.push(`${prefix}.category invalid (must be: ${validCategories.join(', ')})`);
        }

        return warnings;
    }

    public createPromptForStructuredPlan(params: any): string {
        return `You are a pet travel planning assistant. Generate a structured travel plan in STRICT JSON format.

REQUIRED JSON SCHEMA:
{
  "origin": "${params.origin}",
  "destination": "${params.destination}",
  "species": "${params.species}",
  "breed": "${params.breed || 'mixed'}",
  "travelDate": "ISO 8601 date string",
  "timeline": [
    {
      "id": "unique_id",
      "title": "Timeline milestone title",
      "date": "ISO 8601 date",
      "daysBeforeTravel": number,
      "category": "veterinary|documentation|booking|preparation",
      "tasks": [
        {
          "id": "unique_id",
          "title": "Task title",
          "description": "Task description",
          "completed": false
        }
      ]
    }
  ],
  "checklist": [
    {
      "id": "unique_id",
      "title": "Task title",
      "description": "Detailed description",
      "completed": false,
      "priority": "high|medium|low",
      "category": "veterinary|documentation|booking|preparation",
      "estimatedDuration": "e.g., 1-2 weeks"
    }
  ],
  "regulationSummary": "Brief summary of key regulations",
  "criticalAlerts": ["Important alert 1", "Important alert 2"]
}

REQUIREMENTS:
- Return ONLY valid JSON, no markdown formatting
- Include at least 4-6 timeline items spanning preparation period
- Include at least 8-12 checklist tasks
- Prioritize based on urgency and importance
- Include vaccination requirements specific to destination
- Include documentation and paperwork requirements
- Consider breed-specific restrictions if applicable

Generate the complete travel plan now:`;
    }
}

export default new PlanValidationService();
