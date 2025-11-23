import { useState, useEffect } from 'react';

export interface QueryParam {
    key: string;
    value: string;
}

export const useUrlParser = () => {
    const [inputUrl, setInputUrl] = useState('');
    const [encodedUrl, setEncodedUrl] = useState('');
    const [decodedUrl, setDecodedUrl] = useState('');

    // Parsed components
    const [protocol, setProtocol] = useState('');
    const [host, setHost] = useState('');
    const [path, setPath] = useState('');
    const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
    const [hash, setHash] = useState('');

    const [error, setError] = useState<string | null>(null);

    // Process URL when input changes
    useEffect(() => {
        if (!inputUrl) {
            resetParsedData();
            return;
        }

        try {
            // Try to decode first to handle already encoded URLs gracefully in the parser
            let urlToParse = inputUrl;
            try {
                urlToParse = decodeURIComponent(inputUrl);
            } catch (e) {
                // If decode fails, use original
            }

            // 1. Encode / Decode Logic
            setEncodedUrl(encodeURIComponent(inputUrl));
            try {
                setDecodedUrl(decodeURIComponent(inputUrl));
            } catch (e) {
                setDecodedUrl('Error decoding URL');
            }

            // 2. Parser Logic
            // If input doesn't have protocol, URL() constructor might fail or treat as relative.
            // We'll try to prepend https:// if missing for parsing purposes, but keep original for display if needed.
            let parseableUrl = urlToParse;
            if (!parseableUrl.match(/^[a-zA-Z]+:\/\//)) {
                parseableUrl = 'https://' + parseableUrl;
            }

            const urlObj = new URL(parseableUrl);
            setProtocol(urlObj.protocol.replace(':', ''));
            setHost(urlObj.hostname);
            setPath(urlObj.pathname);
            setHash(urlObj.hash);

            const params: QueryParam[] = [];
            urlObj.searchParams.forEach((value, key) => {
                params.push({ key, value });
            });
            setQueryParams(params);
            setError(null);

        } catch (err) {
            // Not a valid URL structure, but we can still show encode/decode
            resetParsedData();
            setEncodedUrl(encodeURIComponent(inputUrl));
            try {
                setDecodedUrl(decodeURIComponent(inputUrl));
            } catch (e) {
                setDecodedUrl('Error decoding URL');
            }
            // Only show error if it really looks like they tried to enter a full URL
            if (inputUrl.includes('.') && inputUrl.length > 5) {
                setError('Invalid URL format for parsing');
            }
        }
    }, [inputUrl]);

    const resetParsedData = () => {
        setProtocol('');
        setHost('');
        setPath('');
        setQueryParams([]);
        setHash('');
        setError(null);
    };

    const clear = () => {
        setInputUrl('');
        setEncodedUrl('');
        setDecodedUrl('');
        resetParsedData();
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    const loadSample = () => {
        setInputUrl('https://www.google.com/search?q=simpleverse+tools&oq=simpleverse&sourceid=chrome&ie=UTF-8#top');
    };

    return {
        inputUrl, setInputUrl,
        encodedUrl,
        decodedUrl,
        protocol,
        host,
        path,
        queryParams,
        hash,
        error,
        clear,
        copyToClipboard,
        loadSample
    };
};
