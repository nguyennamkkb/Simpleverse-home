import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    ShieldCheck,
    Trash2,
    ClipboardPaste,
    AlertCircle,
    Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJwtDecoder } from '../../../controllers/useJwtDecoder';

export const JwtDecoder: React.FC = () => {
    const {
        token, setToken,
        header,
        payload,
        error,
        clear,
        pasteFromClipboard
    } = useJwtDecoder();

    // Simple syntax highlighter for JSON
    const highlightJson = (json: string) => {
        if (!json) return '';
        const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'text-orange-400';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-blue-400 font-semibold';
                } else {
                    cls = 'text-green-400';
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-purple-400 font-semibold';
            } else if (/null/.test(match)) {
                cls = 'text-red-400 font-semibold';
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
                    <h1 className="text-3xl font-bold mb-2">JWT Decoder</h1>
                    <p className="text-slate-400">
                        Decode JSON Web Tokens instantly.
                    </p>
                    <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        100% Client-side • No server communication
                    </div>
                </div>

                {/* Input Area */}
                <Card className="p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Encoded Token</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={pasteFromClipboard}
                                variant="outline"
                                icon={ClipboardPaste}
                                size="sm"
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
                        </div>
                    </div>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your JWT here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                        className={`w-full h-32 bg-slate-950 border rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800'
                            }`}
                        spellCheck={false}
                    />
                    {error && (
                        <div className="mt-3 text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </Card>

                {/* Decoded Output */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Header */}
                    <Card className="p-6 flex flex-col h-full">
                        <div className="mb-4 pb-4 border-b border-slate-800">
                            <h3 className="text-lg font-semibold text-red-400">Header</h3>
                            <p className="text-xs text-slate-500">Algorithm & Token Type</p>
                        </div>
                        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative min-h-[200px]">
                            {header ? (
                                <pre
                                    className="w-full h-full p-4 overflow-auto font-mono text-sm text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: highlightJson(header) }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                                    Waiting for input...
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Payload */}
                    <Card className="p-6 flex flex-col h-full">
                        <div className="mb-4 pb-4 border-b border-slate-800">
                            <h3 className="text-lg font-semibold text-purple-400">Payload</h3>
                            <p className="text-xs text-slate-500">Data & Claims</p>
                        </div>
                        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative min-h-[200px]">
                            {payload ? (
                                <pre
                                    className="w-full h-full p-4 overflow-auto font-mono text-sm text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: highlightJson(payload) }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
                                    Waiting for input...
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-800 text-sm text-slate-400 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-slate-300 mb-1">Security Note</p>
                        <p>
                            This tool only decodes the token to show its contents. It does <strong>not</strong> verify the signature.
                            Always verify tokens on your server before trusting the data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
