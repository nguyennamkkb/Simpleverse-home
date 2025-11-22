import { Home, Grid, Info, Wrench } from 'lucide-react';
import type { NavItem } from './types';

export const mobileNavItems: NavItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/#apps', label: 'Apps', icon: Grid },
    { path: '/tools', label: 'Tools', icon: Wrench },
    { path: '/#about', label: 'About', icon: Info },
];

export const desktopNavItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/#apps', label: 'Apps' },
    { path: '/tools', label: 'Tools' },
    { path: '/#about', label: 'About' },
];
