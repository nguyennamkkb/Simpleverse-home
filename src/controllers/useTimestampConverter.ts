import { useState, useEffect } from 'react';

export const useTimestampConverter = () => {
    // Current Time State
    const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
    const [isPaused, setIsPaused] = useState(false);

    // Converter State
    const [inputTimestamp, setInputTimestamp] = useState<string>('');
    const [inputDate, setInputDate] = useState<string>('');

    // Results
    const [convertedDate, setConvertedDate] = useState<Date | null>(null);
    const [convertedTimestamp, setConvertedTimestamp] = useState<number | null>(null);

    // Update current timestamp every second
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentTimestamp(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused]);

    // Handle Timestamp Input Change
    const handleTimestampChange = (val: string) => {
        setInputTimestamp(val);
        if (!val) {
            setConvertedDate(null);
            return;
        }

        // Detect seconds vs milliseconds
        // Heuristic: if > 100000000000 (11 digits), likely ms. 
        // Current seconds is ~1.7 billion (10 digits).
        let ts = parseInt(val);
        if (isNaN(ts)) {
            setConvertedDate(null);
            return;
        }

        // Auto-detect seconds vs ms
        if (ts < 100000000000) {
            ts *= 1000;
        }

        setConvertedDate(new Date(ts));
    };

    // Handle Date Input Change
    const handleDateChange = (val: string) => {
        setInputDate(val);
        if (!val) {
            setConvertedTimestamp(null);
            return;
        }

        const date = new Date(val);
        if (isNaN(date.getTime())) {
            setConvertedTimestamp(null);
        } else {
            setConvertedTimestamp(Math.floor(date.getTime() / 1000));
        }
    };

    // Set inputs to current time
    const setToNow = () => {
        const now = new Date();
        handleTimestampChange(Math.floor(now.getTime() / 1000).toString());
        // Format for datetime-local input: YYYY-MM-DDThh:mm
        const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        handleDateChange(localIso);
    };

    // Initial load
    useEffect(() => {
        setToNow();
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    // Format helpers
    const formatDate = (date: Date | null) => {
        if (!date) return null;
        return {
            utc: date.toUTCString(),
            local: date.toString(),
            iso: date.toISOString(),
            relative: getRelativeTime(date)
        };
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (Math.abs(diff) < 60) return rtf.format(-diff, 'second');
        if (Math.abs(diff) < 3600) return rtf.format(-Math.floor(diff / 60), 'minute');
        if (Math.abs(diff) < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour');
        if (Math.abs(diff) < 2592000) return rtf.format(-Math.floor(diff / 86400), 'day');
        if (Math.abs(diff) < 31536000) return rtf.format(-Math.floor(diff / 2592000), 'month');
        return rtf.format(-Math.floor(diff / 31536000), 'year');
    };

    return {
        currentTimestamp,
        isPaused, setIsPaused,
        inputTimestamp, handleTimestampChange,
        inputDate, handleDateChange,
        convertedDate: formatDate(convertedDate),
        convertedTimestamp,
        setToNow,
        copyToClipboard
    };
};
