import React from 'react';
import TravelChecklist from '../components/TravelAssistant/TravelChecklist';
import RegulationSummary from '../components/TravelAssistant/RegulationSummary';
import DocumentExplainer from '../components/TravelAssistant/DocumentExplainer';

const TravelPlanner: React.FC = () => {
    return (
        <div>
            <h1>Travel Planner</h1>
            <TravelChecklist />
            <RegulationSummary />
            <DocumentExplainer />
        </div>
    );
};

export default TravelPlanner;