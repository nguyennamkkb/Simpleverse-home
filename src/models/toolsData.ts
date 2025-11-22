import { QrCode, FileImage, Minimize2, Maximize2, Crop, Binary, KeyRound, Hash } from 'lucide-react';
import type { Tool } from './types';

export const toolsData: Tool[] = [
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Create custom QR codes for URLs, text, and more.',
        icon: QrCode,
        path: '/tools/qr-generator',
        color: 'text-blue-400',
    },
    {
        id: 'image-converter',
        name: 'Image Converter',
        description: 'Convert images between PNG, JPG, and WEBP formats.',
        icon: FileImage,
        path: '/tools/image-converter',
        color: 'text-green-400',
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Reduce image file size without losing quality.',
        icon: Minimize2,
        path: '/tools/image-compressor',
        color: 'text-purple-400',
    },
    {
        id: 'image-resize',
        name: 'Image Resize',
        description: 'Resize images to any dimension with presets.',
        icon: Maximize2,
        path: '/tools/image-resize',
        color: 'text-orange-400',
    },
    {
        id: 'image-crop',
        name: 'Image Crop',
        description: 'Crop images to perfect aspect ratios visually.',
        icon: Crop,
        path: '/tools/image-crop',
        color: 'text-pink-400',
    },
    {
        id: 'base64-image',
        name: 'Base64 ↔ Image',
        description: 'Convert images to Base64 or decode Base64 to images.',
        icon: Binary,
        path: '/tools/base64-image',
        color: 'text-cyan-400',
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure passwords, API keys, and secrets.',
        icon: KeyRound,
        path: '/tools/password-generator',
        color: 'text-yellow-400',
    },
    {
        id: 'hash-encode',
        name: 'Hash & Encode',
        description: 'Generate MD5/SHA hashes and encode/decode text.',
        icon: Hash,
        path: '/tools/hash-encode',
        color: 'text-red-400',
    },
];
