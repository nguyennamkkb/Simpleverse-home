import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mobileNavItems } from '../../models/navData';

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe">
            <div className="flex justify-around items-center h-16">
                {mobileNavItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path) ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {item.icon && <item.icon className="h-6 w-6" />}
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};
