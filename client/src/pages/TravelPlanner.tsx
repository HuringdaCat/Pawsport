import React from 'react';
import TravelChecklist from '../components/TravelAssistant/TravelChecklist';

const TravelPlanner: React.FC = () => {
    return (
        <div>
            <h1>Travel Planner</h1>
            <TravelChecklist />
            <div style={{ padding: '20px' }}>
                <h2>Travel Regulation Summary</h2>
                <p>Select your origin and destination to see travel regulations for your pet.</p>
            </div>
            <div style={{ padding: '20px' }}>
                <h2>Document Explainer</h2>
                <p>Upload your pet's travel documents for AI-powered explanation and verification.</p>
            </div>
        </div>
    );
};

export default TravelPlanner;