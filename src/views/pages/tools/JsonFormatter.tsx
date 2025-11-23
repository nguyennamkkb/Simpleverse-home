import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Copy,
    Check,
    Minimize2,
    Maximize2,
    Trash2,
    ClipboardPaste,
    AlertCircle,
    FileJson
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJsonFormatter } from '../../../controllers/useJsonFormatter';

export const JsonFormatter: React.FC = () => {
    const {
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
    } = useJsonFormatter();

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(output);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const highlightJson = (json: string) => {
        if (!json) return '';

        // Escape HTML entities first
        const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-orange-400'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-blue-400 font-semibold'; // key
                } else {
                    cls = 'text-green-400'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-purple-400 font-semibold'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-red-400 font-semibold'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
                    <p className="text-slate-400">
                        Validate, prettify, and minify JSON data.
                    </p>
                </div>

                {/* Toolbar */}
                <Card className="p-4 mb-6 sticky top-4 z-10 shadow-xl border-slate-700/50 backdrop-blur-md bg-slate-900/90">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={handleFormat}
                                variant={mode === 'pretty' ? 'primary' : 'outline'}
                                icon={Maximize2}
                                size="sm"
                            >
                                Prettify
                            </Button>
                            <Button
                                onClick={handleMinify}
                                variant={mode === 'minify' ? 'primary' : 'outline'}
                                icon={Minimize2}
                                size="sm"
                            >
                                Minify
                            </Button>
                            <Button
                                onClick={loadSample}
                                variant="ghost"
                                icon={FileJson}
                                size="sm"
                                className="hidden sm:flex"
                            >
                                Sample
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={pasteFromClipboard}
                                variant="outline"
                                icon={ClipboardPaste}
                                size="sm"
                                className="hidden sm:flex"
                            >
                                Paste
                            </Button>
                            <Button
                                onClick={clear}
                                variant="outline"
                                icon={Trash2}
                                size="sm"
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={handleCopy}
                                icon={copied ? Check : Copy}
                                variant={copied ? 'primary' : 'outline'}
                                size="sm"
                                disabled={!output}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-red-400 font-medium mb-1">Invalid JSON</h4>
                            <p className="text-red-300/80 text-sm font-mono">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
                    {/* Input */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <label className="text-sm font-medium text-slate-400">Input JSON</label>
                            <span className="text-xs text-slate-500">
                                {input.length.toLocaleString()} chars
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your JSON here..."
                            className={`flex-1 w-full bg-slate-950 border rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800'
                                }`}
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <label className="text-sm font-medium text-slate-400">Output</label>
                            <span className="text-xs text-slate-500">
                                {output.length.toLocaleString()} chars
                            </span>
                        </div>
                        <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                            {output ? (
                                <pre
                                    className="w-full h-full p-4 overflow-auto font-mono text-sm text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
                                />
                            ) : (
                                <div className="absolute inset-0 p-4 text-slate-600 font-mono text-sm pointer-events-none">
                                    Formatted JSON will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
