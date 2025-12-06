import React from 'react';

const Home: React.FC = () => {
    return (
        <main>
            <h1>Welcome to Pawsport! 🐾</h1>
            <p>Your trusted companion for traveling with pets.</p>
            <p>Explore our features to make your pet's journey smoother and connect with fellow pet owners.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#667eea' }}>✈️ Travel Assistant</h2>
                    <p>Get personalized checklists and regulation summaries for pet travel.</p>
                </div>
                <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#764ba2' }}>👥 Nose Booper Community</h2>
                    <p>Connect with other pet owners traveling similar routes.</p>
                </div>
            </div>
        </main>
    );
};

export default Home;