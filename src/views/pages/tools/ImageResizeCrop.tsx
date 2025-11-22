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
    Maximize2,
    Crop,
    Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImageResizeCrop, type CropAspectRatio } from '../../../controllers/useImageResizeCrop';

export const ImageResizeCrop: React.FC = () => {
    const {
        files,
        globalSettings,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile,
        clearAll,
        applySettingsToAll,
        processSingle,
        processAll,
        downloadSingle,
        downloadAllAsZip,
        formatSize,
        hasCompletedFiles,
        isProcessing,
    } = useImageResizeCrop();

    const resizePresets = [
        { label: 'Thumbnail', value: 25 },
        { label: 'Half', value: 50 },
        { label: 'Original', value: 100 },
        { label: 'Double', value: 200 },
    ];

    const cropRatios: { value: CropAspectRatio; label: string }[] = [
        { value: 'free', label: 'Free' },
        { value: '1:1', label: '1:1 (Square)' },
        { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9 (Wide)' },
        { value: '3:2', label: '3:2' },
        { value: '9:16', label: '9:16 (Story)' },
        { value: '2:3', label: '2:3 (Portrait)' },
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
                    <h1 className="text-3xl font-bold mb-2">Image Resize & Crop</h1>
                    <p className="text-slate-400">
                        Resize images or crop to perfect aspect ratios. Batch processing supported.
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
                        {/* Mode Selection */}
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Mode</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => applySettingsToAll({ mode: 'resize' })}
                                    className={`p-4 rounded-lg border transition-all ${globalSettings.mode === 'resize'
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <Maximize2 className="w-5 h-5 mx-auto mb-2" />
                                    <p className="font-medium text-center">Resize</p>
                                    <p className="text-xs opacity-75 mt-1">Change dimensions</p>
                                </button>
                                <button
                                    onClick={() => applySettingsToAll({ mode: 'crop' })}
                                    className={`p-4 rounded-lg border transition-all ${globalSettings.mode === 'crop'
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                        }`}
                                >
                                    <Crop className="w-5 h-5 mx-auto mb-2" />
                                    <p className="font-medium text-center">Crop</p>
                                    <p className="text-xs opacity-75 mt-1">Cut to aspect ratio</p>
                                </button>
                            </div>
                        </Card>

                        {/* Settings Card */}
                        <Card className="p-6 mb-6">
                            {globalSettings.mode === 'resize' ? (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Resize Settings</h3>

                                    {/* Presets */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Quick Presets
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {resizePresets.map((preset) => (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => applySettingsToAll({
                                                        resizeMode: 'percentage',
                                                        resizePercentage: preset.value
                                                    })}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${globalSettings.resizeMode === 'percentage' &&
                                                        globalSettings.resizePercentage === preset.value
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                        }`}
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Percentage Slider */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Resize: {globalSettings.resizePercentage}%
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="200"
                                            step="5"
                                            value={globalSettings.resizePercentage}
                                            onChange={(e) => applySettingsToAll({
                                                resizeMode: 'percentage',
                                                resizePercentage: parseInt(e.target.value)
                                            })}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>10% (smallest)</span>
                                            <span>200% (largest)</span>
                                        </div>
                                    </div>

                                    {/* Custom Dimensions */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Custom Dimensions (pixels)
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-2">Width</label>
                                                <input
                                                    type="number"
                                                    value={globalSettings.resizeWidth || ''}
                                                    onChange={(e) => applySettingsToAll({
                                                        resizeMode: 'pixels',
                                                        resizeWidth: e.target.value ? parseInt(e.target.value) : undefined
                                                    })}
                                                    placeholder="Auto"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-2">Height</label>
                                                <input
                                                    type="number"
                                                    value={globalSettings.resizeHeight || ''}
                                                    onChange={(e) => applySettingsToAll({
                                                        resizeMode: 'pixels',
                                                        resizeHeight: e.target.value ? parseInt(e.target.value) : undefined
                                                    })}
                                                    placeholder="Auto"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Maintain Aspect Ratio */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="aspectRatio"
                                            checked={globalSettings.maintainAspectRatio}
                                            onChange={(e) => applySettingsToAll({ maintainAspectRatio: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="aspectRatio" className="ml-2 text-sm text-slate-300">
                                            Maintain Aspect Ratio
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Crop Settings</h3>

                                    {/* Aspect Ratios */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Aspect Ratio
                                        </label>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                            {cropRatios.map((ratio) => (
                                                <button
                                                    key={ratio.value}
                                                    onClick={() => applySettingsToAll({ cropAspectRatio: ratio.value })}
                                                    className={`px-4 py-3 rounded-lg transition-colors text-center ${globalSettings.cropAspectRatio === ratio.value
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                        }`}
                                                >
                                                    <p className="font-medium text-sm">{ratio.label}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-800/30 rounded-lg">
                                        <p className="text-xs text-slate-400">
                                            Images will be automatically cropped to the selected aspect ratio from the center.
                                            Original aspect ratio is preserved if "Free" is selected.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* File List */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Images ({files.length})</h3>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={processAll}
                                        disabled={isProcessing}
                                        icon={Settings}
                                    >
                                        {isProcessing ? 'Processing...' : 'Process All'}
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
                                                <span>{file.originalWidth}×{file.originalHeight}</span>
                                                <span>{formatSize(file.originalFile.size)}</span>
                                                {file.processedWidth && file.processedHeight && (
                                                    <>
                                                        <span>→</span>
                                                        <span className="text-green-500 font-bold">
                                                            {file.processedWidth}×{file.processedHeight}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex items-center gap-2">
                                            {file.status === 'pending' && (
                                                <Button
                                                    onClick={() => processSingle(file.id)}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    Process
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
