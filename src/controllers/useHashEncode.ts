import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

export type ToolMode = 'hash' | 'encode';
export type HashAlgo = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';
export type EncodeAlgo = 'Base64' | 'URL';
export type EncodeAction = 'encode' | 'decode';

export const useHashEncode = () => {
    const [mode, setMode] = useState<ToolMode>('hash');

    // Hash State
    const [hashInput, setHashInput] = useState('');
    const [hashAlgo, setHashAlgo] = useState<HashAlgo>('SHA256');
    const [hashOutput, setHashOutput] = useState('');

    // Encode State
    const [encodeInput, setEncodeInput] = useState('');
    const [encodeAlgo, setEncodeAlgo] = useState<EncodeAlgo>('Base64');
    const [encodeAction, setEncodeAction] = useState<EncodeAction>('encode');
    const [encodeOutput, setEncodeOutput] = useState('');

    // Process Hash
    useEffect(() => {
        if (!hashInput) {
            setHashOutput('');
            return;
        }

        let result = '';
        switch (hashAlgo) {
            case 'MD5':
                result = CryptoJS.MD5(hashInput).toString();
                break;
            case 'SHA1':
                result = CryptoJS.SHA1(hashInput).toString();
                break;
            case 'SHA256':
                result = CryptoJS.SHA256(hashInput).toString();
                break;
            case 'SHA512':
                result = CryptoJS.SHA512(hashInput).toString();
                break;
        }
        setHashOutput(result);
    }, [hashInput, hashAlgo]);

    // Process Encode/Decode
    useEffect(() => {
        if (!encodeInput) {
            setEncodeOutput('');
            return;
        }

        try {
            let result = '';
            if (encodeAlgo === 'Base64') {
                if (encodeAction === 'encode') {
                    // Safe UTF-8 Base64 encoding
                    const wordArray = CryptoJS.enc.Utf8.parse(encodeInput);
                    result = CryptoJS.enc.Base64.stringify(wordArray);
                } else {
                    // Base64 decoding
                    const parsed = CryptoJS.enc.Base64.parse(encodeInput);
                    result = parsed.toString(CryptoJS.enc.Utf8);
                }
            } else if (encodeAlgo === 'URL') {
                if (encodeAction === 'encode') {
                    result = encodeURIComponent(encodeInput);
                } else {
                    result = decodeURIComponent(encodeInput);
                }
            }
            setEncodeOutput(result);
        } catch (error) {
            setEncodeOutput('Error: Invalid input for decoding');
        }
    }, [encodeInput, encodeAlgo, encodeAction]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        mode, setMode,
        hashInput, setHashInput,
        hashAlgo, setHashAlgo,
        hashOutput,
        encodeInput, setEncodeInput,
        encodeAlgo, setEncodeAlgo,
        encodeAction, setEncodeAction,
        encodeOutput,
        copyToClipboard
    };
};
