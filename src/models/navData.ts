import { Home, Wrench } from 'lucide-react';
import type { NavItem } from './types';

export const mobileNavItems: NavItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tools', label: 'Tools', icon: Wrench },
];

export const desktopNavItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/tools', label: 'Tools' },
];
