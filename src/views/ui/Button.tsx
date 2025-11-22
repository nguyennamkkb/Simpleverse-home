import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    fullWidth?: boolean;
    children?: React.ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none touch-manipulation";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-500",
        outline: "border border-slate-700 text-slate-300 hover:bg-slate-800 focus:ring-slate-500",
        ghost: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 focus:ring-slate-500",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {children}
        </motion.button>
    );
};
