import React from 'react';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

const Home: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to Pawsport!</h1>
                <p>Your trusted companion for traveling with pets.</p>
                <p>Explore our features to make your pet's journey smoother and connect with fellow pet owners.</p>
            </main>
            <Footer />
        </div>
    );
};

export default Home;