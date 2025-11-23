import { useState, useEffect } from 'react';

export const useJwtDecoder = () => {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token.trim()) {
            setHeader('');
            setPayload('');
            setError(null);
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
            }

            const decodePart = (part: string) => {
                // Base64Url to Base64
                const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
                // Decode
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.stringify(JSON.parse(jsonPayload), null, 2);
            };

            const decodedHeader = decodePart(parts[0]);
            const decodedPayload = decodePart(parts[1]);

            setHeader(decodedHeader);
            setPayload(decodedPayload);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to decode JWT');
            setHeader('');
            setPayload('');
        }
    }, [token]);

    const clear = () => {
        setToken('');
        setHeader('');
        setPayload('');
        setError(null);
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setToken(text);
        } catch (error) {
            console.error('Failed to read clipboard');
        }
    };

    return {
        token, setToken,
        header,
        payload,
        error,
        clear,
        pasteFromClipboard
    };
};
