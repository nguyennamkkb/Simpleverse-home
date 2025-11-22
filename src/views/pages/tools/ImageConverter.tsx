import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    Download,
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Archive,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImageConverter, type ImageFormat } from '../../../controllers/useImageConverter';

export const ImageConverter: React.FC = () => {
    const {
        files,
        globalFormat,
        setGlobalFormat,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile,
        updateFileFormat,
        clearAll,
        convertSingle,
        convertAll,
        downloadSingle,
        downloadAllAsZip,
        hasCompletedFiles,
        isProcessing,
    } = useImageConverter();

    const formats: { value: ImageFormat; label: string; description: string }[] = [
        { value: 'png', label: 'PNG', description: 'Lossless, transparency' },
        { value: 'jpeg', label: 'JPEG', description: 'Best for photos' },
        { value: 'webp', label: 'WEBP', description: 'Modern, smaller' },
        { value: 'bmp', label: 'BMP', description: 'Bitmap' },
        { value: 'tinypng', label: 'TinyPNG', description: 'Optimized PNG' },
        { value: 'ico', label: 'ICO', description: 'Icon' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'processing':
                return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <ImageIcon className="w-4 h-4 text-slate-400" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
                    <p className="text-slate-400">
                        Convert multiple images to different formats instantly. All processing done locally in your browser.
                    </p>
                </div>

                {/* Upload Area */}
                <Card className="p-8 mb-8">
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
                            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-sm text-slate-500">or click to browse</p>
                        <p className="text-xs text-slate-600 mt-4">Supports: PNG, JPEG, WEBP, BMP, GIF</p>
                    </div>
                </Card>

                {files.length > 0 && (
                    <>
                        {/* Format Selection */}
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Output Format</h3>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                {formats.map((fmt) => (
                                    <button
                                        key={fmt.value}
                                        onClick={() => setGlobalFormat(fmt.value)}
                                        className={`p-4 rounded-lg border transition-all text-center ${globalFormat === fmt.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        <p className="font-medium mb-1">{fmt.label}</p>
                                        <p className="text-xs opacity-75">{fmt.description}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* File List */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Images ({files.length})</h3>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={convertAll}
                                        disabled={isProcessing}
                                        icon={Settings}
                                    >
                                        {isProcessing ? 'Converting...' : 'Convert All'}
                                    </Button>
                                    {hasCompletedFiles && (
                                        <Button
                                            onClick={downloadAllAsZip}
                                            variant="outline"
                                            icon={Archive}
                                        >
                                            Download ZIP
                                        </Button>
                                    )}
                                    <Button
                                        onClick={clearAll}
                                        variant="outline"
                                        icon={X}
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                                    >
                                        {/* Thumbnail */}
                                        <div className="flex-shrink-0 w-16 h-16 bg-slate-900 rounded-lg overflow-hidden">
                                            <img
                                                src={file.preview}
                                                alt={file.file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getStatusIcon(file.status)}
                                                <p className="text-sm font-medium text-white truncate">
                                                    {file.file.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span>{formatFileSize(file.file.size)}</span>
                                                {file.convertedSize && (
                                                    <>
                                                        <span>→</span>
                                                        <span className="text-green-500">
                                                            {formatFileSize(file.convertedSize)}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Format Selector */}
                                        <div className="flex-shrink-0">
                                            <select
                                                value={file.format}
                                                onChange={(e) => updateFileFormat(file.id, e.target.value as ImageFormat)}
                                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                {formats.map((fmt) => (
                                                    <option key={fmt.value} value={fmt.value}>
                                                        {fmt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            {file.status === 'pending' && (
                                                <Button
                                                    onClick={() => convertSingle(file.id)}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    Convert
                                                </Button>
                                            )}
                                            {file.status === 'completed' && (
                                                <Button
                                                    onClick={() => downloadSingle(file.id)}
                                                    size="sm"
                                                    icon={Download}
                                                >
                                                    Download
                                                </Button>
                                            )}
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};
