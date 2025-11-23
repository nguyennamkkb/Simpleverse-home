import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Link as LinkIcon,
    Copy,
    Check,
    Trash2,
    Play,
    Globe,
    Search,
    Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUrlParser } from '../../../controllers/useUrlParser';

export const UrlParser: React.FC = () => {
    const {
        inputUrl, setInputUrl,
        encodedUrl,
        decodedUrl,
        protocol,
        host,
        path,
        queryParams,
        hash,
        error,
        clear,
        copyToClipboard,
        loadSample
    } = useUrlParser();

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
                    <h1 className="text-3xl font-bold mb-2">URL Parser & Encoder</h1>
                    <p className="text-slate-400">
                        Parse, encode, and decode URLs and query parameters.
                    </p>
                </div>

                {/* Input Section */}
                <Card className="p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-blue-400" />
                            Input URL
                        </h3>
                        <div className="flex gap-2">
                            <Button onClick={loadSample} variant="ghost" size="sm" icon={Play}>Sample</Button>
                            <Button onClick={clear} variant="ghost" size="sm" icon={Trash2}>Clear</Button>
                        </div>
                    </div>
                    <textarea
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Enter URL to parse or encode/decode..."
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Parsed Details */}
                    <div className="space-y-6">
                        <Card className="p-6 h-full">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Globe className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold">URL Components</h3>
                            </div>

                            {host ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Protocol</span>
                                        <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2 font-mono text-sm text-green-400">
                                            {protocol}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Host</span>
                                        <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2 font-mono text-sm text-blue-400 break-all">
                                            {host}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">Path</span>
                                        <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2 font-mono text-sm text-orange-400 break-all">
                                            {path || '/'}
                                        </div>
                                    </div>
                                    {hash && (
                                        <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                                            <span className="text-xs font-semibold text-slate-500 uppercase">Hash</span>
                                            <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2 font-mono text-sm text-pink-400 break-all">
                                                {hash}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-slate-500 py-8">
                                    {error ? <span className="text-red-400">{error}</span> : 'Enter a valid URL to see components'}
                                </div>
                            )}

                            {/* Query Params */}
                            {queryParams.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Query Parameters
                                    </h4>
                                    <div className="space-y-2">
                                        {queryParams.map((param, idx) => (
                                            <div key={idx} className="bg-slate-950 border border-slate-800 rounded p-3 text-sm">
                                                <div className="font-semibold text-slate-400 mb-1">{param.key}</div>
                                                <div className="font-mono text-slate-200 break-all">{param.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Column: Encode / Decode */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Hash className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold">Encode / Decode</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Encoded */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-slate-500 font-semibold uppercase">Encoded (URL Safe)</label>
                                        <button
                                            onClick={() => handleCopy(encodedUrl, 'encoded')}
                                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        >
                                            {copiedId === 'encoded' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copiedId === 'encoded' ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={encodedUrl}
                                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 font-mono text-xs focus:outline-none resize-none"
                                    />
                                </div>

                                {/* Decoded */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-slate-500 font-semibold uppercase">Decoded (Readable)</label>
                                        <button
                                            onClick={() => handleCopy(decodedUrl, 'decoded')}
                                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        >
                                            {copiedId === 'decoded' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copiedId === 'decoded' ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={decodedUrl}
                                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 font-mono text-xs focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
