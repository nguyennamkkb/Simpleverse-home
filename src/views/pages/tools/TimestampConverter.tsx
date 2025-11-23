import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Clock,
    Copy,
    Check,
    Pause,
    Play,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTimestampConverter } from '../../../controllers/useTimestampConverter';

export const TimestampConverter: React.FC = () => {
    const {
        currentTimestamp,
        isPaused, setIsPaused,
        inputTimestamp, handleTimestampChange,
        inputDate, handleDateChange,
        convertedDate,
        convertedTimestamp,
        setToNow,
        copyToClipboard
    } = useTimestampConverter();

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

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Unix Timestamp Converter</h1>
                    <p className="text-slate-400">
                        Convert between Unix timestamps and human-readable dates.
                    </p>
                </div>

                {/* Current Timestamp Hero */}
                <Card className="p-8 mb-8 text-center bg-gradient-to-br from-slate-900 to-slate-950 border-blue-500/20">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2 font-semibold">Current Unix Timestamp</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="text-5xl md:text-7xl font-mono font-bold text-blue-400 tabular-nums tracking-tight">
                            {currentTimestamp}
                        </div>
                    </div>
                    <div className="flex justify-center gap-3">
                        <Button
                            onClick={() => setIsPaused(!isPaused)}
                            variant="outline"
                            icon={isPaused ? Play : Pause}
                            size="sm"
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button
                            onClick={() => handleCopy(currentTimestamp.toString(), 'current')}
                            variant={copiedId === 'current' ? 'primary' : 'outline'}
                            icon={copiedId === 'current' ? Check : Copy}
                            size="sm"
                        >
                            {copiedId === 'current' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Timestamp -> Date */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Timestamp to Date</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Unix Timestamp</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={inputTimestamp}
                                        onChange={(e) => handleTimestampChange(e.target.value)}
                                        placeholder="e.g. 1678900000"
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Button onClick={setToNow} variant="ghost" size="sm">Now</Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Supports seconds (10 digits) or milliseconds (13 digits)</p>
                            </div>

                            {convertedDate && (
                                <div className="bg-slate-950 rounded-lg p-4 space-y-3 border border-slate-800">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">GMT / UTC</span>
                                        <div className="font-mono text-sm text-green-400 break-words">{convertedDate.utc}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Your Local Time</span>
                                        <div className="font-mono text-sm text-blue-400 break-words">{convertedDate.local}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">ISO 8601</span>
                                        <div className="font-mono text-sm text-purple-400 break-words">{convertedDate.iso}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Relative</span>
                                        <div className="font-mono text-sm text-slate-300 italic">{convertedDate.relative}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Date -> Timestamp */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Date to Timestamp</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={inputDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none [color-scheme:dark]"
                                    step="1"
                                />
                            </div>

                            {convertedTimestamp !== null && (
                                <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 text-center">
                                    <span className="text-xs text-slate-500 block mb-2">Unix Timestamp (Seconds)</span>
                                    <div className="text-3xl font-mono font-bold text-orange-400 mb-4">
                                        {convertedTimestamp}
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            onClick={() => handleCopy(convertedTimestamp.toString(), 'ts_sec')}
                                            variant="outline"
                                            size="sm"
                                            icon={copiedId === 'ts_sec' ? Check : Copy}
                                        >
                                            Copy Seconds
                                        </Button>
                                        <Button
                                            onClick={() => handleCopy((convertedTimestamp * 1000).toString(), 'ts_ms')}
                                            variant="outline"
                                            size="sm"
                                            icon={copiedId === 'ts_ms' ? Check : Copy}
                                        >
                                            Copy Millis
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
