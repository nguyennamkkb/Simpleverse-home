import { useState, useEffect } from 'react';

// Utility functions for color conversion
const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (l1: number, l2: number) => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

export const useColorTools = () => {
    // Converter State
    const [hex, setHex] = useState('#3B82F6');
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

    // Palette State
    const [palette, setPalette] = useState<{ shade: number; hex: string }[]>([]);

    // Contrast State
    const [fgColor, setFgColor] = useState('#FFFFFF');
    const [bgColor, setBgColor] = useState('#3B82F6');
    const [contrast, setContrast] = useState<number | null>(null);
    const [wcagAA, setWcagAA] = useState(false);
    const [wcagAAA, setWcagAAA] = useState(false);

    // Update colors when HEX changes
    const updateFromHex = (newHex: string) => {
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            const rgbVal = hexToRgb(newHex);
            if (rgbVal) {
                setRgb(rgbVal);
                setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
                generatePalette(newHex);
            }
        }
        setHex(newHex);
    };

    // Generate Tailwind-like palette
    const generatePalette = (baseHex: string) => {
        const rgbVal = hexToRgb(baseHex);
        if (!rgbVal) return;

        const { h, s, l } = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        const newPalette: { shade: number; hex: string }[] = [];
        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        // Simple algorithm to generate shades based on lightness
        // This is an approximation of Tailwind's scale
        shades.forEach(shade => {
            let newL;
            if (shade === 500) newL = l;
            else if (shade < 500) newL = l + (100 - l) * ((500 - shade) / 500) * 0.9;
            else newL = l - l * ((shade - 500) / 500) * 0.9;

            // Convert back to RGB then Hex (simplified HSL to RGB logic needed here or use library)
            // For simplicity, we'll implement a basic HSL->RGB here
            const c = (1 - Math.abs(2 * (newL / 100) - 1)) * (s / 100);
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = (newL / 100) - c / 2;
            let r = 0, g = 0, b = 0;

            if (0 <= h && h < 60) { r = c; g = x; b = 0; }
            else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
            else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
            else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
            else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
            else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

            const finalHex = rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
            newPalette.push({ shade, hex: finalHex });
        });
        setPalette(newPalette);
    };

    // Calculate Contrast
    useEffect(() => {
        const fgRgb = hexToRgb(fgColor);
        const bgRgb = hexToRgb(bgColor);

        if (fgRgb && bgRgb) {
            const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
            const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
            const ratio = getContrastRatio(l1, l2);

            setContrast(parseFloat(ratio.toFixed(2)));
            setWcagAA(ratio >= 4.5);
            setWcagAAA(ratio >= 7);
        } else {
            setContrast(null);
        }
    }, [fgColor, bgColor]);

    // Initial load
    useEffect(() => {
        generatePalette(hex);
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        hex, updateFromHex,
        rgb,
        hsl,
        palette,
        fgColor, setFgColor,
        bgColor, setBgColor,
        contrast,
        wcagAA,
        wcagAAA,
        copyToClipboard
    };
};
