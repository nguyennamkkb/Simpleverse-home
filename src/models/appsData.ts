import { Zap, Shield, Globe, Smartphone, Database, Cloud } from 'lucide-react';
import type { AppItem } from './types';

export const appsData: AppItem[] = [
    {
        title: 'Simpleverse Cloud',
        description: 'Secure, decentralized cloud storage for your personal data.',
        icon: Cloud,
        color: 'text-blue-400',
        status: 'Live',
        link: '#',
    },
    {
        title: 'Shield VPN',
        description: 'High-speed, privacy-focused VPN service.',
        icon: Shield,
        color: 'text-green-400',
        status: 'Beta',
        link: '#',
    },
    {
        title: 'Connect Messenger',
        description: 'End-to-end encrypted messaging for teams.',
        icon: Smartphone,
        color: 'text-purple-400',
        status: 'Coming Soon',
        link: '#',
    },
    {
        title: 'Global Pay',
        description: 'Borderless payments with minimal fees.',
        icon: Globe,
        color: 'text-yellow-400',
        status: 'Coming Soon',
        link: '#',
    },
    {
        title: 'Data Vault',
        description: 'Enterprise-grade database solutions.',
        icon: Database,
        color: 'text-red-400',
        status: 'Coming Soon',
        link: '#',
    },
    {
        title: 'Speed Test',
        description: 'Measure your internet connection performance.',
        icon: Zap,
        color: 'text-cyan-400',
        status: 'Live',
        link: '#',
    },
];
