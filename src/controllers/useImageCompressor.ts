import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';

export type CompressionMode = 'auto' | 'lossless' | 'balanced' | 'aggressive' | 'custom';

export interface CompressionSettings {
    quality: number; // 0.1 - 1.0
    resizeScale: number; // 0.1 - 1.0 (percentage of original size)
    maintainAspectRatio: boolean;
    stripMetadata: boolean;
    mode: CompressionMode;
}

export interface CompressedImage {
    id: string;
    originalFile: File;
    originalPreview: string;
    originalSize: number;
    settings: CompressionSettings;
    compressedFile?: File;
    compressedPreview?: string;
    compressedSize?: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export const useImageCompressor = () => {
    const [files, setFiles] = useState<CompressedImage[]>([]);
    const [globalSettings, setGlobalSettings] = useState<CompressionSettings>({
        quality: 0.8,
        resizeScale: 1.0, // 100% = no resize
        maintainAspectRatio: true,
        stripMetadata: true,
        mode: 'balanced',
    });

    // Upload files
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: CompressedImage[] = [];

        for (const file of acceptedFiles) {
            const id = `${Date.now()}-${Math.random()}`;
            const preview = URL.createObjectURL(file);

            newFiles.push({
                id,
                originalFile: file,
                originalPreview: preview,
                originalSize: file.size,
                settings: { ...globalSettings },
                status: 'pending',
            });
        }

        setFiles((prev) => [...prev, ...newFiles]);
    }, [globalSettings]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
        },
        multiple: true
    });

    // Remove file
    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    // Clear all
    const clearAll = () => {
        setFiles([]);
    };

    // Update settings for a file
    const updateFileSettings = (id: string, settings: Partial<CompressionSettings>) => {
        setFiles((prev) =>
            prev.map((f) =>
                f.id === id
                    ? {
                        ...f,
                        settings: { ...f.settings, ...settings },
                        // Reset if settings change
                        status: f.status === 'completed' ? 'pending' as const : f.status,
                        compressedFile: undefined,
                        compressedPreview: undefined,
                        compressedSize: undefined,
                    }
                    : f
            )
        );
    };

    // Apply settings to all
    const applySettingsToAll = (settings: Partial<CompressionSettings>) => {
        setFiles((prev) =>
            prev.map((f) => ({
                ...f,
                settings: { ...f.settings, ...settings },
                status: f.status === 'completed' ? 'pending' as const : f.status,
                compressedFile: undefined,
                compressedPreview: undefined,
                compressedSize: undefined,
            }))
        );
        setGlobalSettings((prev) => ({ ...prev, ...settings }));
    };


    // Compress single image
    const compressSingle = async (id: string) => {
        const fileIndex = files.findIndex((f) => f.id === id);
        if (fileIndex === -1) return;

        const imageFile = files[fileIndex];

        setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: 'processing' as const } : f))
        );

        try {
            // Load image
            const img = new Image();
            img.src = imageFile.originalPreview;
            await new Promise((resolve) => { img.onload = resolve; });

            // Calculate new dimensions based on resizeScale
            let quality = imageFile.settings.quality;
            let resizeScale = imageFile.settings.resizeScale;

            // Get preset values if not custom mode
            if (imageFile.settings.mode !== 'custom') {
                switch (imageFile.settings.mode) {
                    case 'lossless':
                        quality = 1.0;
                        resizeScale = 1.0;
                        break;
                    case 'balanced':
                        quality = 0.8;
                        resizeScale = 0.8;
                        break;
                    case 'aggressive':
                        quality = 0.6;
                        resizeScale = 0.6;
                        break;
                    case 'auto':
                        if (imageFile.originalFile.size > 5 * 1024 * 1024) {
                            quality = 0.7;
                            resizeScale = 0.7;
                        } else if (imageFile.originalFile.size > 1 * 1024 * 1024) {
                            quality = 0.8;
                            resizeScale = 0.9;
                        } else {
                            quality = 0.9;
                            resizeScale = 1.0;
                        }
                        break;
                }
            }

            const newWidth = Math.round(img.width * resizeScale);
            const newHeight = Math.round(img.height * resizeScale);

            // Resize using canvas
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert to blob with quality
            const mimeType = imageFile.originalFile.type;
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (b) => resolve(b!),
                    mimeType,
                    quality
                );
            });

            const compressed = new File([blob], imageFile.originalFile.name, {
                type: mimeType,
            });

            // Strip metadata if needed (browser-image-compression can do this)
            let final = compressed;
            if (imageFile.settings.stripMetadata) {
                const options = {
                    useWebWorker: true,
                    fileType: mimeType,
                    preserveExif: false,
                    alwaysKeepResolution: true,
                    initialQuality: 1, // Don't compress again
                };
                final = await imageCompression(compressed, options);
            }

            const compressedPreview = URL.createObjectURL(final);

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            compressedFile: final,
                            compressedPreview,
                            compressedSize: final.size,
                            status: 'completed' as const,
                        }
                        : f
                )
            );
        } catch (error) {
            console.error('Compression error:', error);
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            status: 'error' as const,
                            error: 'Compression failed',
                        }
                        : f
                )
            );
        }
    };

    // Compress all
    const compressAll = async () => {
        for (const file of files) {
            if (file.status === 'pending' || file.status === 'error') {
                await compressSingle(file.id);
            }
        }
    };

    // Download single
    const downloadSingle = (id: string) => {
        const imageFile = files.find((f) => f.id === id);
        if (!imageFile || !imageFile.compressedFile) return;

        const url = URL.createObjectURL(imageFile.compressedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simpleverse_compressed_${imageFile.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Download all as ZIP
    const downloadAllAsZip = async () => {
        const zip = new JSZip();

        for (const imageFile of files) {
            if (imageFile.compressedFile) {
                const fileName = `compressed_${imageFile.originalFile.name}`;
                zip.file(fileName, imageFile.compressedFile);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `simpleverse_compressed_images_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const hasCompletedFiles = files.some((f) => f.status === 'completed');
    const isProcessing = files.some((f) => f.status === 'processing');
    const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
    const totalCompressedSize = files.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
    const totalSavings = totalOriginalSize > 0 && totalCompressedSize > 0
        ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 100)
        : 0;

    return {
        files,
        globalSettings,
        setGlobalSettings,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile,
        clearAll,
        updateFileSettings,
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
    };
};
