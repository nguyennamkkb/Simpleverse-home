import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    Download,
    ArrowLeft,
    Upload,
    Check,
    ArrowLeftRight,
    Image as ImageIcon,
    FileCode,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBase64Image } from '../../../controllers/useBase64Image';

export const Base64Image: React.FC = () => {
    const {
        conversion,
        getRootProps,
        getInputProps,
        isDragActive,
        switchMode,
        convertBase64ToImage,
        downloadDecodedImage,
        clear,
        formatSize,
    } = useBase64Image();

    const [base64Input, setBase64Input] = useState('');
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        convertBase64ToImage(base64Input);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Base64 ↔ Image</h1>
                    <p className="text-slate-400">
                        Convert images to Base64 strings or decode Base64 back to images.
                    </p>
                </div>

                {/* Mode Selection */}
                <Card className="p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Conversion Mode</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => switchMode('image-to-base64')}
                            className={`p-6 rounded-lg border transition-all ${conversion.mode === 'image-to-base64'
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <ImageIcon className="w-6 h-6" />
                                <ArrowLeftRight className="w-5 h-5" />
                                <FileCode className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-center">Image → Base64</p>
                            <p className="text-xs opacity-75 mt-1">Upload image, get Base64 string</p>
                        </button>
                        <button
                            onClick={() => switchMode('base64-to-image')}
                            className={`p-6 rounded-lg border transition-all ${conversion.mode === 'base64-to-image'
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <FileCode className="w-6 h-6" />
                                <ArrowLeftRight className="w-5 h-5" />
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-center">Base64 → Image</p>
                            <p className="text-xs opacity-75 mt-1">Paste Base64, download image</p>
                        </button>
                    </div>
                </Card>

                {/* Image to Base64 Mode */}
                {conversion.mode === 'image-to-base64' && (
                    <>
                        {!conversion.imageFile ? (
                            <Card className="p-8">
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                                    <p className="text-lg font-medium text-slate-300 mb-2">
                                        {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                                    </p>
                                    <p className="text-sm text-slate-500">or click to browse</p>
                                    <p className="text-xs text-slate-600 mt-4">Supports: PNG, JPEG, WEBP, GIF, BMP, SVG</p>
                                </div>
                            </Card>
                        ) : (
                            <>
                                {/* Image Preview */}
                                <Card className="p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Image Preview</h3>
                                        <Button onClick={clear} variant="outline" icon={X} size="sm">
                                            Clear
                                        </Button>
                                    </div>
                                    <div className="flex justify-center bg-slate-900 rounded-lg p-4 mb-4">
                                        <img
                                            src={conversion.imagePreview}
                                            alt="Preview"
                                            className="max-w-full h-auto rounded-lg"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                    <div className="text-sm text-slate-400 text-center">
                                        <p>{conversion.imageFile.name}</p>
                                        <p>{formatSize(conversion.imageFile.size)}</p>
                                    </div>
                                </Card>

                                {/* Base64 Output */}
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Base64 String</h3>

                                    {/* Quick Copy Buttons */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <Button
                                            onClick={async () => {
                                                await navigator.clipboard.writeText(conversion.base64String || '');
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            Raw Base64
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const css = `background-image: url(${conversion.base64String});`;
                                                await navigator.clipboard.writeText(css);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            CSS
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const html = `<img src="${conversion.base64String}" alt="image" />`;
                                                await navigator.clipboard.writeText(html);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            HTML
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const json = JSON.stringify({ image: conversion.base64String }, null, 2);
                                                await navigator.clipboard.writeText(json);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            JSON
                                        </Button>
                                    </div>

                                    {copied && (
                                        <div className="flex items-center justify-center gap-2 p-3 mb-4 bg-green-600/20 border border-green-600/30 rounded-lg text-green-400 text-sm">
                                            <Check className="w-4 h-4" />
                                            <span>Copied to clipboard!</span>
                                        </div>
                                    )}

                                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                                        <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all font-mono max-h-96 overflow-y-auto">
                                            {conversion.base64String}
                                        </pre>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Length: {conversion.base64String?.length.toLocaleString()} characters
                                    </p>
                                </Card>
                            </>
                        )}
                    </>
                )}

                {/* Base64 to Image Mode */}
                {conversion.mode === 'base64-to-image' && (
                    <>
                        {!conversion.decodedImage ? (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Paste Base64 String</h3>
                                <textarea
                                    value={base64Input}
                                    onChange={(e) => setBase64Input(e.target.value)}
                                    placeholder="Paste your Base64 string here...&#10;&#10;Supports both formats:&#10;• data:image/png;base64,iVBORw0KG...&#10;• iVBORw0KG..."
                                    className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        onClick={handleConvert}
                                        disabled={!base64Input.trim()}
                                        fullWidth
                                    >
                                        Convert to Image
                                    </Button>
                                    <Button
                                        onClick={() => setBase64Input('')}
                                        variant="outline"
                                        disabled={!base64Input}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <>
                                {/* Decoded Image */}
                                <Card className="p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Decoded Image</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={downloadDecodedImage}
                                                icon={Download}
                                            >
                                                Download Image
                                            </Button>
                                            <Button
                                                onClick={clear}
                                                variant="outline"
                                                icon={X}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex justify-center bg-slate-900 rounded-lg p-4 mb-4">
                                        <img
                                            src={conversion.decodedImage}
                                            alt="Decoded"
                                            className="max-w-full h-auto rounded-lg"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </div>
                                    <div className="text-sm text-slate-400 text-center">
                                        <p>Type: {conversion.decodedMimeType}</p>
                                        <p>Filename: {conversion.decodedFileName}</p>
                                    </div>
                                </Card>

                                {/* Input Base64 */}
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Input Base64</h3>
                                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                                        <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all font-mono max-h-48 overflow-y-auto">
                                            {conversion.inputBase64}
                                        </pre>
                                    </div>
                                </Card>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
