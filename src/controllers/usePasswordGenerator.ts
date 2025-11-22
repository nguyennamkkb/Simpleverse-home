import { useState } from 'react';

export type GeneratorType = 'password' | 'api-key' | 'uuid' | 'jwt-secret' | 'totp-secret';

export interface PasswordOptions {
    length: number;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
}

export interface GeneratedItem {
    id: string;
    type: GeneratorType;
    value: string;
    timestamp: Date;
}

export const usePasswordGenerator = () => {
    const [generatorType, setGeneratorType] = useState<GeneratorType>('password');
    const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
        length: 16,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
    });
    const [history, setHistory] = useState<GeneratedItem[]>([]);

    // Character sets
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Generate password
    const generatePassword = () => {
        let charset = '';
        if (passwordOptions.lowercase) charset += LOWERCASE;
        if (passwordOptions.uppercase) charset += UPPERCASE;
        if (passwordOptions.numbers) charset += NUMBERS;
        if (passwordOptions.symbols) charset += SYMBOLS;

        if (charset === '') {
            alert('Please select at least one character type');
            return;
        }

        let password = '';
        const array = new Uint32Array(passwordOptions.length);
        crypto.getRandomValues(array);

        for (let i = 0; i < passwordOptions.length; i++) {
            password += charset[array[i] % charset.length];
        }

        addToHistory('password', password);
    };

    // Generate API Key (32 chars hex)
    const generateApiKey = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const apiKey = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        addToHistory('api-key', apiKey);
    };

    // Generate UUID v4
    const generateUUID = () => {
        const uuid = crypto.randomUUID();
        addToHistory('uuid', uuid);
    };

    // Generate JWT Secret (64 chars base64)
    const generateJWTSecret = () => {
        const array = new Uint8Array(48);
        crypto.getRandomValues(array);
        const secret = btoa(String.fromCharCode(...array));
        addToHistory('jwt-secret', secret);
    };

    // Generate TOTP Secret (32 chars base32)
    const generateTOTPSecret = () => {
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const secret = Array.from(array, byte => base32Chars[byte % 32]).join('');
        addToHistory('totp-secret', secret);
    };

    // Add to history
    const addToHistory = (type: GeneratorType, value: string) => {
        const item: GeneratedItem = {
            id: `${Date.now()}-${Math.random()}`,
            type,
            value,
            timestamp: new Date(),
        };
        setHistory(prev => [item, ...prev].slice(0, 10)); // Keep last 10
    };

    // Generate based on type
    const generate = () => {
        switch (generatorType) {
            case 'password':
                generatePassword();
                break;
            case 'api-key':
                generateApiKey();
                break;
            case 'uuid':
                generateUUID();
                break;
            case 'jwt-secret':
                generateJWTSecret();
                break;
            case 'totp-secret':
                generateTOTPSecret();
                break;
        }
    };

    // Copy to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            return false;
        }
    };

    // Clear history
    const clearHistory = () => {
        setHistory([]);
    };

    // Remove from history
    const removeFromHistory = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    // Update password options
    const updatePasswordOptions = (options: Partial<PasswordOptions>) => {
        setPasswordOptions(prev => ({ ...prev, ...options }));
    };

    return {
        generatorType,
        setGeneratorType,
        passwordOptions,
        updatePasswordOptions,
        history,
        generate,
        copyToClipboard,
        clearHistory,
        removeFromHistory,
    };
};
