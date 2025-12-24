import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    © {new Date().getFullYear()} Simpleverse. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
