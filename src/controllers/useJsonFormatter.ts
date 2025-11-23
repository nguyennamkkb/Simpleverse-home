import { useState, useEffect } from 'react';

export type JsonMode = 'pretty' | 'minify';

export const useJsonFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<JsonMode>('pretty');

    // Auto-format when input stops changing (debounce) or when mode changes
    useEffect(() => {
        if (!input.trim()) {
            setOutput('');
            setError(null);
            return;
        }

        const timer = setTimeout(() => {
            processJson(input, mode);
        }, 500);

        return () => clearTimeout(timer);
    }, [input, mode]);

    const processJson = (jsonString: string, currentMode: JsonMode) => {
        try {
            const parsed = JSON.parse(jsonString);
            setError(null);

            if (currentMode === 'pretty') {
                setOutput(JSON.stringify(parsed, null, 2));
            } else {
                setOutput(JSON.stringify(parsed));
            }
        } catch (err: any) {
            setError(err.message || 'Invalid JSON');
            // Keep the output empty or previous valid output? 
            // Better to clear output or show nothing to indicate error state clearly alongside the error message.
            setOutput('');
        }
    };

    const handleFormat = () => {
        setMode('pretty');
        processJson(input, 'pretty');
    };

    const handleMinify = () => {
        setMode('minify');
        processJson(input, 'minify');
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInput(text);
        } catch (error) {
            console.error('Failed to read clipboard');
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    const loadSample = () => {
        const sample = {
            "project": "Simpleverse",
            "version": 1.0,
            "features": ["Tools", "Privacy", "Speed"],
            "active": true,
            "meta": {
                "created": "2024",
                "author": "Dev"
            }
        };
        setInput(JSON.stringify(sample));
    };

    return {
        input, setInput,
        output,
        error,
        mode,
        handleFormat,
        handleMinify,
        copyToClipboard,
        pasteFromClipboard,
        clear,
        loadSample
    };
};
