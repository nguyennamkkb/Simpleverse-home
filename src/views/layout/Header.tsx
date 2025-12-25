import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { desktopNavItems } from '../../models/navData';
import { useThemeContext } from './Layout';

export const Header: React.FC = () => {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                        Simpleverse
                    </span>
                </Link>

                {/* Desktop Navigation - Right aligned */}
                <div className="hidden md:flex items-center space-x-8">
                    <nav className="flex items-center space-x-8">
                        {desktopNavItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <button
                        onClick={toggleTheme}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile theme toggle */}
                <div className="md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};
