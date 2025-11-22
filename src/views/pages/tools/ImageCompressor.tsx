import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    Download,
    ArrowLeft,
    Upload,
    Settings,
    X,
    Archive,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Zap,
    Shield,
    Target,
    Gauge,
    Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImageCompressor, type CompressionMode } from '../../../controllers/useImageCompressor';

export const ImageCompressor: React.FC = () => {
    const {
        files,
        globalSettings,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile,
        clearAll,
        applySettingsToAll,
        compressSingle,
        compressAll,
        downloadSingle,
        downloadAllAsZip,
        formatSize,
        hasCompletedFiles,
        isProcessing,
        totalOriginalSize,
        totalCompressedSize,
        totalSavings,
    } = useImageCompressor();

    const modes: { value: CompressionMode; label: string; icon: any }[] = [
        { value: 'auto', label: 'Auto', icon: Zap },
        { value: 'lossless', label: 'Lossless', icon: Shield },
        { value: 'balanced', label: 'Balanced', icon: Target },
        { value: 'aggressive', label: 'Max', icon: Gauge },
        { value: 'custom', label: 'Custom', icon: Settings },
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

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
                    <p className="text-slate-400">
                        Reduce image file sizes with smart compression. Original format preserved.
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
                        <p className="text-xs text-slate-600 mt-4">Supports: PNG, JPEG, WEBP, BMP</p>
                    </div>
                </Card>

                {files.length > 0 && (
                    <>
                        {/* Compression Mode */}
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Compression Mode</h3>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                {modes.map((mode) => {
                                    const Icon = mode.icon;
                                    return (
                                        <button
                                            key={mode.value}
                                            onClick={() => applySettingsToAll({ mode: mode.value })}
                                            className={`p-4 rounded-lg border transition-all ${globalSettings.mode === mode.value
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 mx-auto mb-2" />
                                            <p className="font-medium text-center text-sm">{mode.label}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3 text-xs text-slate-400">
                                <p className="text-center">Smart</p>
                                <p className="text-center">100%/100%</p>
                                <p className="text-center">80%/80%</p>
                                <p className="text-center">60%/60%</p>
                                <p className="text-center">Manual</p>
                            </div>

                            {/* Custom Mode Sliders */}
                            {globalSettings.mode === 'custom' && (
                                <div className="mt-6 space-y-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            1. Resize: {Math.round(globalSettings.resizeScale * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.05"
                                            value={globalSettings.resizeScale}
                                            onChange={(e) => applySettingsToAll({ resizeScale: parseFloat(e.target.value) })}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>10% (smallest)</span>
                                            <span>100% (original size)</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            2. Quality: {Math.round(globalSettings.quality * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.05"
                                            value={globalSettings.quality}
                                            onChange={(e) => applySettingsToAll({ quality: parseFloat(e.target.value) })}
                                            className="w-full accent-green-500"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>10% (lower quality)</span>
                                            <span>100% (best quality)</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-400">
                                        <strong>Resize:</strong> Giảm kích thước ảnh (pixels).{' '}
                                        <strong>Quality:</strong> Giảm chất lượng/mật độ điểm ảnh.
                                    </p>
                                </div>
                            )}

                            {/* Preset Info */}
                            {globalSettings.mode !== 'custom' && (
                                <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
                                    <p className="text-xs text-slate-400">
                                        <strong>{modes.find(m => m.value === globalSettings.mode)?.label}</strong> preset automatically sets both resize and quality.
                                        Switch to <strong>Custom</strong> mode to manually adjust.
                                    </p>
                                </div>
                            )}

                            {/* Strip Metadata */}
                            <div className="mt-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="stripMetadata"
                                    checked={globalSettings.stripMetadata}
                                    onChange={(e) => applySettingsToAll({ stripMetadata: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="stripMetadata" className="ml-2 text-sm text-slate-300">
                                    Remove EXIF metadata (reduces size & protects privacy)
                                </label>
                            </div>
                        </Card>

                        {/* Statistics */}
                        {totalCompressedSize > 0 && (
                            <Card className="p-6 mb-6 bg-gradient-to-r from-blue-600/10 to-green-600/10 border-blue-600/30">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Files</p>
                                        <p className="text-lg font-bold text-white">{files.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Original</p>
                                        <p className="text-lg font-bold text-white">{formatSize(totalOriginalSize)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Compressed</p>
                                        <p className="text-lg font-bold text-green-400">{formatSize(totalCompressedSize)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Saved</p>
                                        <p className="text-lg font-bold text-blue-400">{totalSavings}%</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* File List */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Images ({files.length})</h3>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={compressAll}
                                        disabled={isProcessing}
                                        icon={Settings}
                                    >
                                        {isProcessing ? 'Compressing...' : 'Compress All'}
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
                                                src={file.originalPreview}
                                                alt={file.originalFile.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getStatusIcon(file.status)}
                                                <p className="text-sm font-medium text-white truncate">
                                                    {file.originalFile.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span>{formatSize(file.originalSize)}</span>
                                                {file.compressedSize && (
                                                    <>
                                                        <span>→</span>
                                                        <span className="text-green-500 font-bold">
                                                            {formatSize(file.compressedSize)}
                                                            {' '}(-{Math.round((1 - file.compressedSize / file.originalSize) * 100)}%)
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            {file.status === 'pending' && (
                                                <Button
                                                    onClick={() => compressSingle(file.id)}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    Compress
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
