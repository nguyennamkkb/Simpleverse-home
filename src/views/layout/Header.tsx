import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';
import { Button } from '../ui/Button';
import { desktopNavItems } from '../../models/navData';

export const Header: React.FC = () => {

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Simpleverse
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {desktopNavItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Github className="h-5 w-5" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                        <Twitter className="h-5 w-5" />
                    </a>
                    <Button size="sm" className="hidden md:inline-flex">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    );
};
