import type { LucideIcon } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    path: string;
    color: string;
}

export interface AppItem {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    status: 'Live' | 'Beta' | 'Coming Soon';
    link: string;
}

export interface NavItem {
    label: string;
    path: string;
    icon?: LucideIcon;
}
