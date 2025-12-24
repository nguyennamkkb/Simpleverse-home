import { Shield, Clock } from 'lucide-react';
import type { AppItem } from './types';

export const appsData: AppItem[] = [
    {
        title: 'VaultNote',
        description: 'Secure password manager with end-to-end encryption. Keep your passwords safe and accessible.',
        icon: Shield,
        color: 'text-blue-400',
        status: 'Live',
        link: 'https://apps.apple.com/vn/app/vaultnote-password-manager/id6755835518?l=vi',
    },
    {
        title: 'Time Capsule',
        description: 'Preserve your memories and messages for the future. Coming soon to App Store.',
        icon: Clock,
        color: 'text-purple-400',
        status: 'Coming Soon',
        link: '#',
    },
];
