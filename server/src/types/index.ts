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

export interface RegulationSummary {
    country: string;
    regulations: Regulation[];
}

export interface Regulation {
    id: string;
    description: string;
    actionableSteps: string[];
}

export interface CommunityPost {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    route?: string;
    petTypes?: string[];
    likes: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
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

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'comment' | 'like' | 'reply';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

// Structured Travel Plan Types
export interface TimelineTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export interface TimelineItem {
    id: string;
    title: string;
    date: string; // ISO 8601 format
    daysBeforeTravel: number;
    tasks: TimelineTask[];
    category: 'veterinary' | 'documentation' | 'booking' | 'preparation';
}

export interface ChecklistTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    category: 'veterinary' | 'documentation' | 'booking' | 'preparation';
    estimatedDuration?: string;
}

export interface StructuredTravelPlan {
    origin: string;
    destination: string;
    species: string;
    breed: string;
    travelDate: string;
    timeline: TimelineItem[];
    checklist: ChecklistTask[];
    regulationSummary: string;
    criticalAlerts: string[];
}

export interface PlanValidationResult {
    valid: boolean;
    warnings: string[];
    plan?: StructuredTravelPlan;
}