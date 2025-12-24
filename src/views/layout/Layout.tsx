import React, { createContext, useContext } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { useTheme } from '../../controllers/useTheme';
import type { Theme } from '../../controllers/useTheme';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within Layout');
    }
    return context;
};

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
                <Header />
                <main className="flex-grow pt-16 pb-16 md:pb-0">
                    {children}
                </main>
                <Footer />
                <BottomNav />
            </div>
        </ThemeContext.Provider>
    );
};
