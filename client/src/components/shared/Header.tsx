import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Pawsport</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/travel-planner">Travel Planner</a></li>
                    <li><a href="/community">Community</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;