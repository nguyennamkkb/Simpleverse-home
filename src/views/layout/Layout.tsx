import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-16 pb-16 md:pb-0">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
};
