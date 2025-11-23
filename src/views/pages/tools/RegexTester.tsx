import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Play,
    Trash2,
    AlertCircle,
    Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRegexTester } from '../../../controllers/useRegexTester';

export const RegexTester: React.FC = () => {
    const {
        regexPattern, setRegexPattern,
        regexFlags, toggleFlag, flags,
        testString, setTestString,
        matches,
        error,
        highlightedText,
        loadSample,
        clear
    } = useRegexTester();

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
                    <p className="text-slate-400">
                        Test and debug JavaScript regular expressions in real-time.
                    </p>
                </div>

                {/* Regex Input Bar */}
                <Card className="p-4 mb-6 sticky top-4 z-10 shadow-xl border-slate-700/50 backdrop-blur-md bg-slate-900/90">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-lg">/</span>
                            <input
                                type="text"
                                value={regexPattern}
                                onChange={(e) => setRegexPattern(e.target.value)}
                                placeholder="Enter regex pattern..."
                                className={`w-full bg-slate-950 border rounded-lg py-3 pl-8 pr-16 text-slate-200 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'
                                    }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-lg">
                                /{regexFlags}
                            </span>
                        </div>

                        {/* Flags Dropdown (simplified as inline for now) */}
                        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
                            {flags.map((flag) => (
                                <button
                                    key={flag.char}
                                    onClick={() => toggleFlag(flag.char)}
                                    className={`px-3 py-1.5 rounded text-sm font-mono font-bold border transition-all ${regexFlags.includes(flag.char)
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                        }`}
                                    title={`${flag.label}: ${flag.desc}`}
                                >
                                    {flag.char}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-3 text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column: Test String & Highlight */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-0 overflow-hidden flex flex-col h-[500px]">
                            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-300">Test String</h3>
                                <div className="flex gap-2">
                                    <Button onClick={loadSample} variant="ghost" size="sm" icon={Play}>Sample</Button>
                                    <Button onClick={clear} variant="ghost" size="sm" icon={Trash2}>Clear</Button>
                                </div>
                            </div>

                            <div className="relative flex-1">
                                {/* Backdrop for highlights */}
                                <div className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-all text-transparent pointer-events-none z-0">
                                    {Array.isArray(highlightedText) ? highlightedText.map((part: any, i: number) => {
                                        if (typeof part === 'string') return part;
                                        if (part.type === 'match') {
                                            return (
                                                <span key={i} className="bg-blue-500/30 border-b-2 border-blue-500 text-transparent rounded px-0.5">
                                                    {part.content}
                                                </span>
                                            );
                                        }
                                        return part.content;
                                    }) : highlightedText}
                                </div>

                                {/* Actual textarea */}
                                <textarea
                                    value={testString}
                                    onChange={(e) => setTestString(e.target.value)}
                                    placeholder="Enter test string here..."
                                    className="absolute inset-0 w-full h-full bg-transparent p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none z-10"
                                    spellCheck={false}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Matches Info */}
                    <div className="space-y-6">
                        <Card className="p-0 h-[500px] flex flex-col">
                            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                                <h3 className="font-semibold text-slate-300">
                                    Match Information
                                    {matches.length > 0 && <span className="ml-2 text-blue-400">({matches.length})</span>}
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {matches.length === 0 ? (
                                    <div className="text-center text-slate-500 mt-10">
                                        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No matches found</p>
                                    </div>
                                ) : (
                                    matches.map((match, i) => (
                                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-blue-400">Match {i + 1}</span>
                                                <span className="text-xs text-slate-500">Index: {match.index}</span>
                                            </div>
                                            <div className="bg-slate-900/50 rounded p-2 font-mono text-slate-300 break-all mb-2">
                                                {match.match}
                                            </div>

                                            {match.groups.length > 0 && (
                                                <div className="space-y-1 mt-2 border-t border-slate-800 pt-2">
                                                    <p className="text-xs text-slate-500 font-semibold">Groups:</p>
                                                    {match.groups.map((group, gIndex) => (
                                                        <div key={gIndex} className="flex gap-2 text-xs">
                                                            <span className="text-slate-500 w-4 text-right">{gIndex + 1}.</span>
                                                            <span className="text-green-400 font-mono">{group || <span className="text-slate-600 italic">undefined</span>}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
