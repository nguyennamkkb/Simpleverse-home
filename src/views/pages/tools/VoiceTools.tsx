import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Mic,
    MicOff,
    Volume2,
    Copy,
    Check,
    Trash2,
    Play,
    Square,
    AlertCircle,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVoiceTools } from '../../../controllers/useVoiceTools';

export const VoiceTools: React.FC = () => {
    const {
        // Recognition
        isListening,
        transcript,
        interimTranscript,
        recognitionError,
        isRecognitionSupported,
        startListening,
        stopListening,
        clearTranscript,
        changeLanguage,
        copyTranscript,

        // Synthesis
        textToSpeak,
        setTextToSpeak,
        isSpeaking,
        voices,
        selectedVoice,
        setSelectedVoice,
        rate,
        setRate,
        pitch,
        setPitch,
        volume,
        setVolume,
        isSynthesisSupported,
        speak,
        stopSpeaking,
        loadSampleText
    } = useVoiceTools();

    const [copied, setCopied] = useState(false);
    const [selectedLang, setSelectedLang] = useState('vi-VN');

    const handleCopy = async () => {
        const success = await copyTranscript();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLanguageChange = (lang: string) => {
        setSelectedLang(lang);
        changeLanguage(lang);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Voice Tools</h1>
                    <p className="text-slate-400">
                        Speech recognition and text-to-speech powered by Web Speech API.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Speech Recognition (Voice → Text) */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Mic className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Speech to Text</h3>
                        </div>

                        {!isRecognitionSupported && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">Speech Recognition is not supported in this browser.</p>
                                </div>
                            </div>
                        )}

                        {/* Language Selection */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Language</label>
                            <select
                                value={selectedLang}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled={isListening}
                            >
                                <option value="vi-VN">🇻🇳 Vietnamese</option>
                                <option value="en-US">🇺🇸 English (US)</option>
                                <option value="en-GB">🇬🇧 English (UK)</option>
                                <option value="ja-JP">🇯🇵 Japanese</option>
                                <option value="ko-KR">🇰🇷 Korean</option>
                                <option value="zh-CN">🇨🇳 Chinese (Simplified)</option>
                            </select>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3 mb-4">
                            {!isListening ? (
                                <Button
                                    onClick={startListening}
                                    disabled={!isRecognitionSupported}
                                    variant="primary"
                                    className="flex-1"
                                    icon={Mic}
                                >
                                    Start Listening
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopListening}
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                                    icon={MicOff}
                                >
                                    Stop Listening
                                </Button>
                            )}
                            <Button
                                onClick={clearTranscript}
                                disabled={!transcript}
                                variant="outline"
                                icon={Trash2}
                            >
                                Clear
                            </Button>
                        </div>

                        {/* Listening Indicator */}
                        {isListening && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Mic className="w-5 h-5 text-blue-400" />
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-400 font-medium">Listening...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {recognitionError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-400">{recognitionError}</p>
                            </div>
                        )}

                        {/* Transcript Display */}
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-slate-500 font-semibold uppercase">Transcript</span>
                                {transcript && (
                                    <button
                                        onClick={handleCopy}
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                )}
                            </div>
                            <div className="text-slate-300 whitespace-pre-wrap">
                                {transcript}
                                {interimTranscript && (
                                    <span className="text-slate-500 italic">{interimTranscript}</span>
                                )}
                                {!transcript && !interimTranscript && (
                                    <span className="text-slate-600">Start speaking to see transcript...</span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Text-to-Speech (Text → Voice) */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Volume2 className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Text to Speech</h3>
                        </div>

                        {!isSynthesisSupported && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">Text-to-Speech is not supported in this browser.</p>
                                </div>
                            </div>
                        )}

                        {/* Text Input */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs text-slate-500 font-semibold uppercase">Text to Speak</label>
                                <button
                                    onClick={loadSampleText}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Load Sample
                                </button>
                            </div>
                            <textarea
                                value={textToSpeak}
                                onChange={(e) => setTextToSpeak(e.target.value)}
                                placeholder="Enter text to convert to speech..."
                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Voice Selection */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-500 font-semibold uppercase mb-2 block">Voice</label>
                            <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    setSelectedVoice(voice || null);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Settings */}
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4">
                            <h4 className="text-xs text-slate-500 font-semibold uppercase mb-3 flex items-center gap-2">
                                <Settings className="w-3 h-3" />
                                Settings
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-400">Rate</label>
                                        <span className="text-xs text-slate-500">{rate.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={rate}
                                        onChange={(e) => setRate(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-400">Pitch</label>
                                        <span className="text-xs text-slate-500">{pitch.toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={pitch}
                                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-400">Volume</label>
                                        <span className="text-xs text-slate-500">{Math.round(volume * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3">
                            {!isSpeaking ? (
                                <Button
                                    onClick={speak}
                                    disabled={!textToSpeak || !isSynthesisSupported}
                                    variant="primary"
                                    className="flex-1"
                                    icon={Play}
                                >
                                    Speak
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopSpeaking}
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                                    icon={Square}
                                >
                                    Stop
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
