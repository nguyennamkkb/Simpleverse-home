import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Copy,
    Check,
    Palette,
    Droplet,
    Contrast
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useColorTools } from '../../../controllers/useColorTools';

export const ColorTools: React.FC = () => {
    const {
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
    } = useColorTools();

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (text: string, id: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Color / UI Dev Tools</h1>
                    <p className="text-slate-400">
                        All-in-one color palette generator, converter, and contrast checker.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Converter & Palette */}
                    <div className="space-y-8">
                        {/* Color Picker & Converter */}
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Palette className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Color Converter</h3>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Visual Picker */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="color"
                                        value={hex}
                                        onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
                                        className="w-24 h-24 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                                    />
                                </div>

                                {/* Values */}
                                <div className="flex-1 w-full space-y-4">
                                    {/* HEX */}
                                    <div>
                                        <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">HEX</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={hex}
                                                onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                maxLength={7}
                                            />
                                            <Button
                                                onClick={() => handleCopy(hex, 'hex')}
                                                icon={copiedId === 'hex' ? Check : Copy}
                                                variant="outline"
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    {/* RGB */}
                                    <div>
                                        <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">RGB</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-400 font-mono focus:outline-none"
                                            />
                                            <Button
                                                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                                                icon={copiedId === 'rgb' ? Check : Copy}
                                                variant="outline"
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    {/* HSL */}
                                    <div>
                                        <label className="text-xs text-slate-500 font-semibold uppercase mb-1 block">HSL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-400 font-mono focus:outline-none"
                                            />
                                            <Button
                                                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                                                icon={copiedId === 'hsl' ? Check : Copy}
                                                variant="outline"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Palette Generator */}
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Droplet className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Shades & Tints</h3>
                            </div>

                            <div className="space-y-2">
                                {palette.map((item) => (
                                    <div key={item.shade} className="flex items-center gap-4 group">
                                        <span className="w-12 text-xs text-slate-500 font-mono text-right">{item.shade}</span>
                                        <div
                                            className="flex-1 h-10 rounded-lg flex items-center justify-between px-4 transition-transform group-hover:scale-[1.02]"
                                            style={{ backgroundColor: item.hex }}
                                        >
                                            <span className={`text-xs font-mono font-medium ${item.shade > 500 ? 'text-white/90' : 'text-black/70'}`}>
                                                {item.hex}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(item.hex, `shade-${item.shade}`)}
                                                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-black/10 ${item.shade > 500 ? 'text-white' : 'text-black'}`}
                                            >
                                                {copiedId === `shade-${item.shade}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Contrast Checker */}
                    <div className="space-y-8">
                        <Card className="p-6 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Contrast className="w-6 h-6 text-orange-400" />
                                </div>
                                <h3 className="text-xl font-semibold">Contrast Checker</h3>
                            </div>

                            {/* Preview Box */}
                            <div
                                className="flex-1 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-8 transition-colors border border-slate-700 shadow-inner min-h-[200px]"
                                style={{ backgroundColor: bgColor, color: fgColor }}
                            >
                                <h2 className="text-4xl font-bold mb-4">Aa</h2>
                                <p className="text-lg font-medium mb-2">The quick brown fox jumps over the lazy dog.</p>
                                <p className="text-sm opacity-80">
                                    Use this tool to check if your color combination is accessible.
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Text Color</label>
                                    <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg p-2">
                                        <input
                                            type="color"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <input
                                            type="text"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                                            className="flex-1 bg-transparent border-none text-slate-200 font-mono text-sm focus:ring-0"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Background</label>
                                    <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg p-2">
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                                        />
                                        <input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                                            className="flex-1 bg-transparent border-none text-slate-200 font-mono text-sm focus:ring-0"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Contrast Ratio</p>
                                    <p className={`text-2xl font-bold ${contrast ? (contrast >= 4.5 ? 'text-green-400' : 'text-red-400') : 'text-slate-500'}`}>
                                        {contrast ? `${contrast}:1` : '---'}
                                    </p>
                                </div>
                                <div className={`border rounded-lg p-4 text-center ${wcagAA ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <p className="text-xs opacity-70 uppercase mb-1">WCAG AA</p>
                                    <p className={`text-lg font-bold ${wcagAA ? 'text-green-400' : 'text-red-400'}`}>
                                        {wcagAA ? 'PASS' : 'FAIL'}
                                    </p>
                                </div>
                                <div className={`border rounded-lg p-4 text-center ${wcagAAA ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <p className="text-xs opacity-70 uppercase mb-1">WCAG AAA</p>
                                    <p className={`text-lg font-bold ${wcagAAA ? 'text-green-400' : 'text-red-400'}`}>
                                        {wcagAAA ? 'PASS' : 'FAIL'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
