import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5 } : {}}
            className={`
        bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-6
        ${hoverEffect ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};
