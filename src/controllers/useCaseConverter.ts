import { useState, useEffect } from 'react';

export type CaseType =
    | 'upper_snake'
    | 'lower_snake'
    | 'camel'
    | 'pascal'
    | 'kebab'
    | 'title'
    | 'sentence'
    | 'slug';

export interface CaseResult {
    type: CaseType;
    label: string;
    value: string;
}

export const useCaseConverter = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<CaseResult[]>([]);

    // Options
    const [removeAccents, setRemoveAccents] = useState(false);
    const [processByLine, setProcessByLine] = useState(false);

    // Helper: Remove Vietnamese accents
    const removeVietnameseTones = (str: string) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // \u0300, \u0301, \u0303, \u0309, \u0323
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    };

    const convertString = (str: string): Record<CaseType, string> => {
        let cleanStr = str;
        if (removeAccents) {
            cleanStr = removeVietnameseTones(cleanStr);
        }

        // Normalize to words array
        // Split by space, underscore, dash, or camelCase boundaries
        const words = cleanStr
            .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
            .replace(/[_\-]+/g, ' ') // replace separators with space
            .trim()
            .split(/\s+/)
            .filter(w => w.length > 0);

        if (words.length === 0) {
            return {
                upper_snake: '', lower_snake: '', camel: '', pascal: '',
                kebab: '', title: '', sentence: '', slug: ''
            };
        }

        const lowerWords = words.map(w => w.toLowerCase());
        const upperWords = words.map(w => w.toUpperCase());
        const titleWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

        return {
            upper_snake: upperWords.join('_'),
            lower_snake: lowerWords.join('_'),
            camel: lowerWords[0] + titleWords.slice(1).join(''),
            pascal: titleWords.join(''),
            kebab: lowerWords.join('-'),
            title: titleWords.join(' '),
            sentence: lowerWords[0].charAt(0).toUpperCase() + lowerWords[0].slice(1) + (lowerWords.length > 1 ? ' ' + lowerWords.slice(1).join(' ') : ''),
            slug: removeVietnameseTones(lowerWords.join('-')) // Slug always removes accents
        };
    };

    useEffect(() => {
        if (!input) {
            setResults([]);
            return;
        }

        const lines = processByLine ? input.split('\n') : [input];

        // We will aggregate results. If multiple lines, we join them with newlines for each case type.
        const aggregated: Record<CaseType, string[]> = {
            upper_snake: [], lower_snake: [], camel: [], pascal: [],
            kebab: [], title: [], sentence: [], slug: []
        };

        lines.forEach(line => {
            const converted = convertString(line);
            (Object.keys(converted) as CaseType[]).forEach(key => {
                aggregated[key].push(converted[key]);
            });
        });

        const newResults: CaseResult[] = [
            { type: 'upper_snake', label: 'UPPER_SNAKE_CASE', value: aggregated.upper_snake.join('\n') },
            { type: 'lower_snake', label: 'lower_snake_case', value: aggregated.lower_snake.join('\n') },
            { type: 'camel', label: 'camelCase', value: aggregated.camel.join('\n') },
            { type: 'pascal', label: 'PascalCase', value: aggregated.pascal.join('\n') },
            { type: 'kebab', label: 'kebab-case', value: aggregated.kebab.join('\n') },
            { type: 'title', label: 'Title Case', value: aggregated.title.join('\n') },
            { type: 'sentence', label: 'Sentence case', value: aggregated.sentence.join('\n') },
            { type: 'slug', label: 'slug-case (SEO)', value: aggregated.slug.join('\n') },
        ];

        setResults(newResults);
    }, [input, removeAccents, processByLine]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    const clear = () => {
        setInput('');
        setResults([]);
    };

    const loadSample = () => {
        setInput(processByLine
            ? "Hello World\nXin chào thế giới\nReact Hooks"
            : "Xin chào thế giới Simpleverse");
    };

    return {
        input, setInput,
        results,
        removeAccents, setRemoveAccents,
        processByLine, setProcessByLine,
        copyToClipboard,
        clear,
        loadSample
    };
};
