// This file exports TypeScript types and interfaces used throughout the server application.

export interface TravelChecklist {
    id: string;
    userId: string;
    destination: string;
    species: string;
    breed: string;
    vaccinationStatus: string;
    checklistItems: ChecklistItem[];
}

export interface ChecklistItem {
    id: string;
    description: string;
    completed: boolean;
}

export interface RegulationData {
    country: string;
    requirements: string[];
    timelines: string[];
    culturalNotes?: string[];
}

export interface RegulationSummary {
    country: string;
    requirements: string[];
    timelines: string[];
    culturalNotes?: string[];
}

export interface Regulation {
    id: string;
    description: string;
    actionableSteps: string[];
}

export interface CommunityPost {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
}

export interface PetProfile {
    id: string;
    ownerId: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    bio: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    pets: PetProfile[];
}