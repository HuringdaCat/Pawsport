import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa' }}>
            <p>🐾 Pawsport - Helping pets travel safely and connect with their community.</p>
            <p>&copy; {new Date().getFullYear()} Pawsport. All rights reserved.</p>
        </footer>
    );
};

export default Footer;