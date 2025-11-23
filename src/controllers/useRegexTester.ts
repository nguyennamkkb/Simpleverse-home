import { useState, useEffect, useMemo } from 'react';

export interface RegexMatch {
    match: string;
    index: number;
    groups: string[];
}

export const useRegexTester = () => {
    const [regexPattern, setRegexPattern] = useState('');
    const [regexFlags, setRegexFlags] = useState('gm');
    const [testString, setTestString] = useState('');
    const [matches, setMatches] = useState<RegexMatch[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Flags
    const flags = [
        { char: 'g', label: 'Global', desc: 'Don\'t return after first match' },
        { char: 'm', label: 'Multi line', desc: '^ and $ match start/end of line' },
        { char: 'i', label: 'Insensitive', desc: 'Case insensitive match' },
        { char: 's', label: 'Single line', desc: 'Dot matches newline' },
        { char: 'u', label: 'Unicode', desc: 'Match with full unicode' },
        { char: 'y', label: 'Sticky', desc: 'Anchor to last match position' },
    ];

    const toggleFlag = (flag: string) => {
        if (regexFlags.includes(flag)) {
            setRegexFlags(regexFlags.replace(flag, ''));
        } else {
            setRegexFlags(prev => {
                // Keep flags in consistent order
                const newFlags = prev + flag;
                return ['g', 'm', 'i', 's', 'u', 'y']
                    .filter(f => newFlags.includes(f))
                    .join('');
            });
        }
    };

    // Process Regex
    useEffect(() => {
        if (!regexPattern || !testString) {
            setMatches([]);
            setError(null);
            return;
        }

        try {
            const regex = new RegExp(regexPattern, regexFlags);
            const newMatches: RegexMatch[] = [];
            let match;

            // Handle global flag differently
            if (regex.global) {
                // Prevent infinite loops with zero-length matches
                // Prevent infinite loops with zero-length matches
                while ((match = regex.exec(testString)) !== null) {
                    newMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });

                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    // Safety break for extremely large number of matches
                    if (newMatches.length > 1000) break;
                }
            } else {
                match = regex.exec(testString);
                if (match) {
                    newMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                }
            }

            setMatches(newMatches);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setMatches([]);
        }
    }, [regexPattern, regexFlags, testString]);

    // Highlight matches in text
    const highlightedText = useMemo(() => {
        if (!testString || matches.length === 0) return testString;

        let lastIndex = 0;
        const parts = [];

        matches.forEach((match, i) => {
            // Text before match
            if (match.index > lastIndex) {
                parts.push(testString.slice(lastIndex, match.index));
            }

            // Match itself
            parts.push({
                type: 'match',
                content: match.match,
                index: i
            });

            lastIndex = match.index + match.match.length;
        });

        // Remaining text
        if (lastIndex < testString.length) {
            parts.push({
                type: 'text',
                content: testString.slice(lastIndex)
            });
        }

        return parts;
    }, [testString, matches]);

    const loadSample = () => {
        setRegexPattern(String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`);
        setRegexFlags('gim');
        setTestString(`Hello world!
Here are some emails:
john.doe@example.com
support@simpleverse.io
INVALID_EMAIL@.com
test.user+tag@gmail.com`);
    };

    const clear = () => {
        setRegexPattern('');
        setTestString('');
        setMatches([]);
        setError(null);
    };

    return {
        regexPattern, setRegexPattern,
        regexFlags, toggleFlag, flags,
        testString, setTestString,
        matches,
        error,
        highlightedText,
        loadSample,
        clear
    };
};
