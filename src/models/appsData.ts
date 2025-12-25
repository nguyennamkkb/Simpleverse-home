import { Shield, Clock } from 'lucide-react';
import type { AppItem } from './types';

export const appsData: AppItem[] = [
    {
        title: 'VaultNote',
        description: 'Secure password manager with end-to-end encryption. Keep your passwords safe and accessible across all your devices.',
        icon: Shield,
        color: 'text-blue-400',
        status: 'Live',
        link: 'https://apps.apple.com/vn/app/vaultnote-password-manager/id6755835518?l=vi',
        logo: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/37/b7/74/37b77488-c0ad-a8ef-e06d-ca4ffc335f3d/Placeholder.mill/200x200bb-75.webp',
        stats: 'Privacy-first password management',
        features: ['End-to-End Encryption', 'Secure Storage', 'Password Generator', 'Biometric Lock'],
    },
    {
        title: 'Time Capsule',
        description: 'Preserve your memories and messages for the future. Coming soon to App Store.',
        icon: Clock,
        color: 'text-purple-400',
        status: 'Coming Soon',
        link: '#',
        logo: undefined,
        features: ['Time-locked Messages', 'Memory Preservation', 'Future Delivery', 'Private & Secure'],
    },
];
