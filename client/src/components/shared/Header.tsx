import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { Button } from '../ui';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 py-4 md:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform">
                            <PawPrint className="w-7 h-7 text-white -rotate-12 group-hover:-rotate-6 transition-transform" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-brand-orange-600 to-brand-pink-600 bg-clip-text text-transparent">
                            Pawsport
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Home
                        </Link>
                        <Link to="/travel-planner" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Travel Planner
                        </Link>
                        <Link to="/community" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Community
                        </Link>
                        <Link to="/travel-planner">
                            <Button size="sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;