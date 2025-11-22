import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    Download,
    ArrowLeft,
    Upload,
    Crop as CropIcon,
    X,
    Loader2,
    Move,
    Maximize,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImageCrop, type CropAspectRatio } from '../../../controllers/useImageCrop';

export const ImageCrop: React.FC = () => {
    const {
        file,
        globalSettings,
        getRootProps,
        getInputProps,
        isDragActive,
        clearFile,
        updateAspectRatio,
        updateCropArea,
        cropImage,
        downloadCropped,
        formatSize,
    } = useImageCrop();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string>('');
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const cropRatios: { value: CropAspectRatio; label: string; description: string }[] = [
        { value: 'free', label: 'Free', description: 'Any size' },
        { value: '1:1', label: '1:1', description: 'Square' },
        { value: '4:3', label: '4:3', description: 'Classic' },
        { value: '16:9', label: '16:9', description: 'Wide' },
        { value: '3:2', label: '3:2', description: 'Photo' },
        { value: '9:16', label: '9:16', description: 'Story' },
        { value: '2:3', label: '2:3', description: 'Portrait' },
    ];

    // Get aspect ratio value
    const getAspectRatioValue = (ratio: CropAspectRatio): number | null => {
        const ratios: Record<CropAspectRatio, number | null> = {
            'free': null,
            '1:1': 1,
            '4:3': 4 / 3,
            '16:9': 16 / 9,
            '3:2': 3 / 2,
            '9:16': 9 / 16,
            '2:3': 2 / 3,
        };
        return ratios[ratio];
    };

    // Draw canvas with crop overlay
    useEffect(() => {
        if (!file || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = file.originalPreview;
        img.onload = () => {
            // Calculate display size
            const maxSize = 600;
            let displayWidth = img.width;
            let displayHeight = img.height;

            if (img.width > maxSize || img.height > maxSize) {
                const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                displayWidth = img.width * ratio;
                displayHeight = img.height * ratio;
            }

            canvas.width = displayWidth;
            canvas.height = displayHeight;

            // Draw image
            ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

            // Calculate crop area in pixels
            const cropX = (file.settings.cropArea.x / 100) * displayWidth;
            const cropY = (file.settings.cropArea.y / 100) * displayHeight;
            const cropWidth = (file.settings.cropArea.width / 100) * displayWidth;
            const cropHeight = (file.settings.cropArea.height / 100) * displayHeight;

            // Darken outside crop area
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, displayWidth, cropY); // Top
            ctx.fillRect(0, cropY, cropX, cropHeight); // Left
            ctx.fillRect(cropX + cropWidth, cropY, displayWidth - (cropX + cropWidth), cropHeight); // Right
            ctx.fillRect(0, cropY + cropHeight, displayWidth, displayHeight - (cropY + cropHeight)); // Bottom

            // Draw crop border
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

            // Draw grid lines
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Vertical
            ctx.moveTo(cropX + cropWidth / 3, cropY);
            ctx.lineTo(cropX + cropWidth / 3, cropY + cropHeight);
            ctx.moveTo(cropX + (cropWidth * 2) / 3, cropY);
            ctx.lineTo(cropX + (cropWidth * 2) / 3, cropY + cropHeight);
            // Horizontal
            ctx.moveTo(cropX, cropY + cropHeight / 3);
            ctx.lineTo(cropX + cropWidth, cropY + cropHeight / 3);
            ctx.moveTo(cropX, cropY + (cropHeight * 2) / 3);
            ctx.lineTo(cropX + cropWidth, cropY + (cropHeight * 2) / 3);
            ctx.stroke();

            // Draw resize handles
            const handleSize = 10;
            ctx.fillStyle = '#3b82f6';
            // Corners
            ctx.fillRect(cropX - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX + cropWidth - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX - handleSize / 2, cropY + cropHeight - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX + cropWidth - handleSize / 2, cropY + cropHeight - handleSize / 2, handleSize, handleSize);
            // Edges
            ctx.fillRect(cropX + cropWidth / 2 - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX + cropWidth / 2 - handleSize / 2, cropY + cropHeight - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX - handleSize / 2, cropY + cropHeight / 2 - handleSize / 2, handleSize, handleSize);
            ctx.fillRect(cropX + cropWidth - handleSize / 2, cropY + cropHeight / 2 - handleSize / 2, handleSize, handleSize);
        };
    }, [file]);

    // Mouse down handler
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!file || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cropX = (file.settings.cropArea.x / 100) * canvas.width;
        const cropY = (file.settings.cropArea.y / 100) * canvas.height;
        const cropWidth = (file.settings.cropArea.width / 100) * canvas.width;
        const cropHeight = (file.settings.cropArea.height / 100) * canvas.height;

        const handleSize = 10;

        // Check resize handles
        const handles = [
            { name: 'nw', x: cropX, y: cropY },
            { name: 'ne', x: cropX + cropWidth, y: cropY },
            { name: 'sw', x: cropX, y: cropY + cropHeight },
            { name: 'se', x: cropX + cropWidth, y: cropY + cropHeight },
            { name: 'n', x: cropX + cropWidth / 2, y: cropY },
            { name: 's', x: cropX + cropWidth / 2, y: cropY + cropHeight },
            { name: 'w', x: cropX, y: cropY + cropHeight / 2 },
            { name: 'e', x: cropX + cropWidth, y: cropY + cropHeight / 2 },
        ];

        for (const handle of handles) {
            if (
                x >= handle.x - handleSize / 2 &&
                x <= handle.x + handleSize / 2 &&
                y >= handle.y - handleSize / 2 &&
                y <= handle.y + handleSize / 2
            ) {
                setIsResizing(true);
                setResizeHandle(handle.name);
                setDragStart({ x, y });
                return;
            }
        }

        // Check if inside crop area (drag to move)
        if (
            x >= cropX &&
            x <= cropX + cropWidth &&
            y >= cropY &&
            y <= cropY + cropHeight
        ) {
            setIsDragging(true);
            setDragStart({ x, y });
        }
    };

    // Mouse move handler
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!file || !canvasRef.current) return;
        if (!isDragging && !isResizing) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const deltaX = ((x - dragStart.x) / canvas.width) * 100;
        const deltaY = ((y - dragStart.y) / canvas.height) * 100;

        let newCropArea = { ...file.settings.cropArea };

        if (isDragging) {
            // Move crop area
            newCropArea.x = Math.max(0, Math.min(100 - newCropArea.width, newCropArea.x + deltaX));
            newCropArea.y = Math.max(0, Math.min(100 - newCropArea.height, newCropArea.y + deltaY));
        } else if (isResizing) {
            // Resize crop area
            const aspectRatio = getAspectRatioValue(file.settings.aspectRatio);

            if (resizeHandle.includes('e')) {
                newCropArea.width = Math.max(5, Math.min(100 - newCropArea.x, newCropArea.width + deltaX));
            }
            if (resizeHandle.includes('w')) {
                const newWidth = Math.max(5, newCropArea.width - deltaX);
                const widthDiff = newCropArea.width - newWidth;
                newCropArea.x = Math.max(0, newCropArea.x + widthDiff);
                newCropArea.width = newWidth;
            }
            if (resizeHandle.includes('s')) {
                newCropArea.height = Math.max(5, Math.min(100 - newCropArea.y, newCropArea.height + deltaY));
            }
            if (resizeHandle.includes('n')) {
                const newHeight = Math.max(5, newCropArea.height - deltaY);
                const heightDiff = newCropArea.height - newHeight;
                newCropArea.y = Math.max(0, newCropArea.y + heightDiff);
                newCropArea.height = newHeight;
            }

            // Maintain aspect ratio if not free
            if (aspectRatio !== null) {
                const currentRatio = (newCropArea.width * canvas.width) / (newCropArea.height * canvas.height);
                if (Math.abs(currentRatio - aspectRatio) > 0.01) {
                    if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
                        newCropArea.height = (newCropArea.width * canvas.width) / (aspectRatio * canvas.height);
                    } else {
                        newCropArea.width = (newCropArea.height * canvas.height * aspectRatio) / canvas.width;
                    }
                }
            }
        }

        updateCropArea(newCropArea);
        setDragStart({ x, y });
    };

    // Mouse up handler
    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle('');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Image Crop</h1>
                    <p className="text-slate-400">
                        Crop images interactively with drag & resize. Visual preview included.
                    </p>
                </div>

                {!file ? (
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
                            <p className="text-xs text-slate-600 mt-4">Supports: PNG, JPEG, WEBP, BMP</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Aspect Ratio */}
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Aspect Ratio</h3>
                            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                                {cropRatios.map((ratio) => (
                                    <button
                                        key={ratio.value}
                                        onClick={() => updateAspectRatio(ratio.value)}
                                        className={`p-3 rounded-lg border transition-all text-center ${globalSettings.aspectRatio === ratio.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        <p className="font-medium text-sm mb-1">{ratio.label}</p>
                                        <p className="text-xs opacity-75">{ratio.description}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Interactive Canvas */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Interactive Preview</h3>
                                <div className="flex gap-2 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Move className="w-4 h-4" />
                                        <span>Drag to move</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Maximize className="w-4 h-4" />
                                        <span>Handles to resize</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center bg-slate-900 rounded-lg p-4">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto rounded-lg cursor-move"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-800/30 rounded-lg">
                                    <p className="text-slate-400 mb-1">Crop Position</p>
                                    <p className="text-white font-mono">
                                        X: {file.settings.cropArea.x.toFixed(1)}%, Y: {file.settings.cropArea.y.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-800/30 rounded-lg">
                                    <p className="text-slate-400 mb-1">Crop Size</p>
                                    <p className="text-white font-mono">
                                        W: {file.settings.cropArea.width.toFixed(1)}%, H: {file.settings.cropArea.height.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{file.originalFile.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>Original: {file.originalWidth}×{file.originalHeight}</span>
                                        <span>{formatSize(file.originalFile.size)}</span>
                                        {file.croppedWidth && file.croppedHeight && (
                                            <>
                                                <span>→</span>
                                                <span className="text-green-500 font-bold">
                                                    Cropped: {file.croppedWidth}×{file.croppedHeight}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Button onClick={clearFile} variant="outline" icon={X}>
                                    Remove
                                </Button>
                            </div>

                            <div className="flex gap-3">
                                {file.status === 'pending' && (
                                    <Button onClick={cropImage} icon={CropIcon} fullWidth>
                                        Crop Image
                                    </Button>
                                )}
                                {file.status === 'processing' && (
                                    <Button disabled fullWidth>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Cropping...
                                    </Button>
                                )}
                                {file.status === 'completed' && (
                                    <>
                                        <Button onClick={downloadCropped} icon={Download} fullWidth>
                                            Download Cropped
                                        </Button>
                                        <Button
                                            onClick={() => updateAspectRatio(globalSettings.aspectRatio)}
                                            variant="outline"
                                            fullWidth
                                        >
                                            Crop Again
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>

                        {/* Result */}
                        {file.croppedPreview && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Cropped Result</h3>
                                <div className="flex justify-center bg-slate-900 rounded-lg p-4">
                                    <img
                                        src={file.croppedPreview}
                                        alt="Cropped"
                                        className="max-w-full h-auto rounded-lg"
                                        style={{ maxHeight: '400px' }}
                                    />
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
