import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Key,
    Lock,
    Hash,
    Shield,
    Smartphone,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePasswordGenerator, type GeneratorType } from '../../../controllers/usePasswordGenerator';

export const PasswordGenerator: React.FC = () => {
    const {
        generatorType,
        setGeneratorType,
        passwordOptions,
        updatePasswordOptions,
        history,
        generate,
        copyToClipboard,
        clearHistory,
        removeFromHistory,
    } = usePasswordGenerator();

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (text: string, id: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const generatorTypes: { value: GeneratorType; label: string; icon: any; description: string }[] = [
        { value: 'password', label: 'Password', icon: Lock, description: 'Strong password with custom options' },
        { value: 'api-key', label: 'API Key', icon: Key, description: '64-char hexadecimal string' },
        { value: 'uuid', label: 'UUID v4', icon: Hash, description: 'Universally unique identifier' },
        { value: 'jwt-secret', label: 'JWT Secret', icon: Shield, description: 'Base64 secret for JWT signing' },
        { value: 'totp-secret', label: 'TOTP Secret', icon: Smartphone, description: 'Base32 secret for 2FA' },
    ];

    const getTypeLabel = (type: GeneratorType) => {
        return generatorTypes.find(t => t.value === type)?.label || type;
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Password / Token Generator</h1>
                    <p className="text-slate-400">
                        Generate secure passwords, API keys, UUIDs, and secrets for development.
                    </p>
                </div>

                {/* Generator Type Selection */}
                <Card className="p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Generator Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {generatorTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => setGeneratorType(type.value)}
                                    className={`p-4 rounded-lg border transition-all text-center ${generatorType === type.value
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mx-auto mb-2" />
                                    <p className="font-medium text-sm mb-1">{type.label}</p>
                                    <p className="text-xs opacity-75">{type.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Password Options */}
                {generatorType === 'password' && (
                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Password Options</h3>

                        {/* Length Slider */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Length: {passwordOptions.length} characters
                            </label>
                            <input
                                type="range"
                                min="8"
                                max="64"
                                step="1"
                                value={passwordOptions.length}
                                onChange={(e) => updatePasswordOptions({ length: parseInt(e.target.value) })}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>8 (weak)</span>
                                <span>64 (very strong)</span>
                            </div>
                        </div>

                        {/* Character Types */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={passwordOptions.lowercase}
                                    onChange={(e) => updatePasswordOptions({ lowercase: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Lowercase (a-z)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={passwordOptions.uppercase}
                                    onChange={(e) => updatePasswordOptions({ uppercase: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={passwordOptions.numbers}
                                    onChange={(e) => updatePasswordOptions({ numbers: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Numbers (0-9)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={passwordOptions.symbols}
                                    onChange={(e) => updatePasswordOptions({ symbols: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-300">Symbols (!@#$...)</span>
                            </label>
                        </div>
                    </Card>
                )}

                {/* Generate Button */}
                <Card className="p-6 mb-6">
                    <Button
                        onClick={generate}
                        icon={RefreshCw}
                        fullWidth
                        size="lg"
                    >
                        Generate {getTypeLabel(generatorType)}
                    </Button>
                </Card>

                {/* History */}
                {history.length > 0 && (
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Generated History ({history.length})</h3>
                            <Button
                                onClick={clearHistory}
                                variant="outline"
                                icon={Trash2}
                                size="sm"
                            >
                                Clear All
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                                                {getTypeLabel(item.type)}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {item.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2">
                                            <code className="text-sm text-slate-300 font-mono break-all">
                                                {item.value}
                                            </code>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        <Button
                                            onClick={() => handleCopy(item.value, item.id)}
                                            icon={copiedId === item.id ? Check : Copy}
                                            variant={copiedId === item.id ? 'primary' : 'outline'}
                                            size="sm"
                                        >
                                            {copiedId === item.id ? 'Copied!' : 'Copy'}
                                        </Button>
                                        <button
                                            onClick={() => removeFromHistory(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <Card className="p-6 bg-slate-800/30">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            Security Tips
                        </h4>
                        <ul className="text-sm text-slate-400 space-y-2">
                            <li>• Use at least 16 characters for passwords</li>
                            <li>• Enable all character types for maximum security</li>
                            <li>• Never reuse passwords across services</li>
                            <li>• Store secrets securely (use password manager)</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-800/30">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Key className="w-5 h-5 text-green-400" />
                            Use Cases
                        </h4>
                        <ul className="text-sm text-slate-400 space-y-2">
                            <li>• <strong>Password:</strong> User accounts, admin panels</li>
                            <li>• <strong>API Key:</strong> REST API authentication</li>
                            <li>• <strong>UUID:</strong> Database IDs, session tokens</li>
                            <li>• <strong>JWT Secret:</strong> Token signing key</li>
                            <li>• <strong>TOTP Secret:</strong> 2FA setup (Google Authenticator)</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};
