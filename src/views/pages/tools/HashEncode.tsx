import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Copy,
    Check,
    Hash,
    FileCode,
    AlertTriangle,
    ArrowRightLeft,
    Lock,
    Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHashEncode, type HashAlgo } from '../../../controllers/useHashEncode';

export const HashEncode: React.FC = () => {
    const {
        mode, setMode,
        hashInput, setHashInput,
        hashAlgo, setHashAlgo,
        hashOutput,
        encodeInput, setEncodeInput,
        encodeAlgo, setEncodeAlgo,
        encodeAction, setEncodeAction,
        encodeOutput,
        copyToClipboard
    } = useHashEncode();

    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const hashAlgos: { value: HashAlgo; label: string }[] = [
        { value: 'MD5', label: 'MD5' },
        { value: 'SHA1', label: 'SHA-1' },
        { value: 'SHA256', label: 'SHA-256' },
        { value: 'SHA512', label: 'SHA-512' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Hash & Encode Playground</h1>
                    <p className="text-slate-400">
                        Generate hashes and encode/decode text strings.
                    </p>
                </div>

                {/* Mode Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-800/50 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setMode('hash')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'hash'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Hashing
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('encode')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileCode className="w-4 h-4" />
                                Encode / Decode
                            </div>
                        </button>
                    </div>
                </div>

                {mode === 'hash' ? (
                    <div className="space-y-6">
                        {/* Hash Settings */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Algorithm</h3>
                            <div className="flex flex-wrap gap-3">
                                {hashAlgos.map((algo) => (
                                    <button
                                        key={algo.value}
                                        onClick={() => setHashAlgo(algo.value)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${hashAlgo === algo.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        {algo.label}
                                    </button>
                                ))}
                            </div>

                            {(hashAlgo === 'MD5' || hashAlgo === 'SHA1') && (
                                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-yellow-200">
                                        <p className="font-semibold">Security Warning</p>
                                        <p className="opacity-90">
                                            {hashAlgo} is considered cryptographically broken. Do not use it for passwords or sensitive data.
                                            Use SHA-256 or SHA-512 instead.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Input */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Input Text</h3>
                                <textarea
                                    value={hashInput}
                                    onChange={(e) => setHashInput(e.target.value)}
                                    placeholder="Enter text to hash..."
                                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                            </Card>

                            {/* Output */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Output Hash</h3>
                                    <Button
                                        onClick={() => handleCopy(hashOutput)}
                                        icon={copied ? Check : Copy}
                                        variant={copied ? 'primary' : 'outline'}
                                        size="sm"
                                        disabled={!hashOutput}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-48 overflow-y-auto">
                                    <code className="text-sm text-slate-300 font-mono break-all">
                                        {hashOutput || <span className="text-slate-600">Result will appear here...</span>}
                                    </code>
                                </div>
                                {hashOutput && (
                                    <p className="text-xs text-slate-500 mt-2 text-right">
                                        Length: {hashOutput.length} chars
                                    </p>
                                )}
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Encode Settings */}
                        <Card className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Method</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setEncodeAlgo('Base64')}
                                            className={`flex-1 px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${encodeAlgo === 'Base64'
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <Lock className="w-4 h-4" />
                                            Base64
                                        </button>
                                        <button
                                            onClick={() => setEncodeAlgo('URL')}
                                            className={`flex-1 px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${encodeAlgo === 'URL'
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <Globe className="w-4 h-4" />
                                            URL
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Action</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setEncodeAction('encode')}
                                            className={`flex-1 px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${encodeAction === 'encode'
                                                ? 'bg-green-600 border-green-600 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <ArrowRightLeft className="w-4 h-4" />
                                            Encode
                                        </button>
                                        <button
                                            onClick={() => setEncodeAction('decode')}
                                            className={`flex-1 px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${encodeAction === 'decode'
                                                ? 'bg-purple-600 border-purple-600 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <ArrowRightLeft className="w-4 h-4 rotate-180" />
                                            Decode
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Input */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Input ({encodeAction === 'encode' ? 'Plain Text' : 'Encoded'})
                                </h3>
                                <textarea
                                    value={encodeInput}
                                    onChange={(e) => setEncodeInput(e.target.value)}
                                    placeholder={encodeAction === 'encode' ? "Enter text to encode..." : "Enter text to decode..."}
                                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                            </Card>

                            {/* Output */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Output ({encodeAction === 'encode' ? 'Encoded' : 'Plain Text'})
                                    </h3>
                                    <Button
                                        onClick={() => handleCopy(encodeOutput)}
                                        icon={copied ? Check : Copy}
                                        variant={copied ? 'primary' : 'outline'}
                                        size="sm"
                                        disabled={!encodeOutput}
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-48 overflow-y-auto">
                                    <code className="text-sm text-slate-300 font-mono break-all whitespace-pre-wrap">
                                        {encodeOutput || <span className="text-slate-600">Result will appear here...</span>}
                                    </code>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
