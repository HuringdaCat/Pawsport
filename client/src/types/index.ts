// This file exports TypeScript types and interfaces used throughout the client application.

export interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    vaccinationStatus: boolean;
}

export interface TravelChecklistItem {
    id: string;
    description: string;
    completed: boolean;
}

export interface RegulationSummary {
    country: string;
    requirements: string[];
}

export interface CommunityPost {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
}

export interface UserProfile {
    id: string;
    username: string;
    pets: Pet[];
    location: string;
}

export interface MatchingCriteria {
    origin: string;
    destination: string;
    travelDate: Date;
}