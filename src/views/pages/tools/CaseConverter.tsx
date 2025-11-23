import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Copy,
    Check,
    Type,
    Trash2,
    Play,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCaseConverter } from '../../../controllers/useCaseConverter';

export const CaseConverter: React.FC = () => {
    const {
        input, setInput,
        results,
        removeAccents, setRemoveAccents,
        processByLine, setProcessByLine,
        copyToClipboard,
        clear,
        loadSample
    } = useCaseConverter();

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

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Text Case Converter</h1>
                    <p className="text-slate-400">
                        Convert text between different naming conventions instantly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Column */}
                    <div className="space-y-6">
                        <Card className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Type className="w-5 h-5 text-blue-400" />
                                    Input Text
                                </h3>
                                <div className="flex gap-2">
                                    <Button onClick={loadSample} variant="ghost" size="sm" icon={Play}>Sample</Button>
                                    <Button onClick={clear} variant="ghost" size="sm" icon={Trash2}>Clear</Button>
                                </div>
                            </div>

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type or paste your text here..."
                                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none min-h-[200px]"
                            />

                            {/* Options */}
                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Options
                                </h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={removeAccents}
                                            onChange={(e) => setRemoveAccents(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-colors"
                                        />
                                        <div>
                                            <span className="text-slate-300 group-hover:text-white transition-colors">Remove Vietnamese Accents</span>
                                            <p className="text-xs text-slate-500">Xin chào → Xin chao</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={processByLine}
                                            onChange={(e) => setProcessByLine(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-colors"
                                        />
                                        <div>
                                            <span className="text-slate-300 group-hover:text-white transition-colors">Process Line by Line</span>
                                            <p className="text-xs text-slate-500">Treat each line as a separate input</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Output Column */}
                    <div className="space-y-4">
                        {results.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl p-8">
                                <p>Start typing to see conversions...</p>
                            </div>
                        ) : (
                            results.map((result) => (
                                <div key={result.type} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {result.label}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(result.value, result.type)}
                                            className={`p-1.5 rounded transition-all ${copiedId === result.type
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'text-slate-500 hover:text-white hover:bg-slate-700'
                                                }`}
                                            title="Copy"
                                        >
                                            {copiedId === result.type ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            readOnly
                                            value={result.value}
                                            rows={processByLine ? Math.min(result.value.split('\n').length, 4) : 1}
                                            className="w-full bg-slate-950 rounded px-3 py-2 text-slate-200 font-mono text-sm focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
