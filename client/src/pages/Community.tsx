import React from 'react';
import CommunityFeed from '../components/NoseBooper/CommunityFeed';
import MatchingModule from '../components/NoseBooper/MatchingModule';

const Community: React.FC = () => {
    return (
        <div>
            <h1>Community</h1>
            <CommunityFeed />
            <MatchingModule />
        </div>
    );
};

export default Community;