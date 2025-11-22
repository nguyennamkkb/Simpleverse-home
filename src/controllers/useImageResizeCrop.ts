import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';

export type ResizeMode = 'percentage' | 'pixels' | 'preset';
export type CropAspectRatio = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16' | '2:3';

export interface ResizeCropSettings {
    mode: 'resize' | 'crop';
    // Resize settings
    resizeMode: ResizeMode;
    resizePercentage: number; // 10-200%
    resizeWidth?: number;
    resizeHeight?: number;
    maintainAspectRatio: boolean;
    // Crop settings
    cropAspectRatio: CropAspectRatio;
    cropX: number; // 0-100%
    cropY: number; // 0-100%
    cropWidth: number; // 0-100%
    cropHeight: number; // 0-100%
}

export interface ProcessedImage {
    id: string;
    originalFile: File;
    originalPreview: string;
    originalWidth: number;
    originalHeight: number;
    settings: ResizeCropSettings;
    processedFile?: File;
    processedPreview?: string;
    processedWidth?: number;
    processedHeight?: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export const useImageResizeCrop = () => {
    const [files, setFiles] = useState<ProcessedImage[]>([]);
    const [globalSettings, setGlobalSettings] = useState<ResizeCropSettings>({
        mode: 'resize',
        resizeMode: 'percentage',
        resizePercentage: 50,
        maintainAspectRatio: true,
        cropAspectRatio: '16:9',
        cropX: 0,
        cropY: 0,
        cropWidth: 100,
        cropHeight: 100,
    });

    // Upload files
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: ProcessedImage[] = [];

        for (const file of acceptedFiles) {
            const id = `${Date.now()}-${Math.random()}`;
            const preview = URL.createObjectURL(file);

            // Load image to get dimensions
            const img = new Image();
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            newFiles.push({
                id,
                originalFile: file,
                originalPreview: preview,
                originalWidth: img.width,
                originalHeight: img.height,
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

    // Apply settings to all
    const applySettingsToAll = (settings: Partial<ResizeCropSettings>) => {
        setFiles((prev) =>
            prev.map((f) => ({
                ...f,
                settings: { ...f.settings, ...settings },
                status: f.status === 'completed' ? 'pending' as const : f.status,
                processedFile: undefined,
                processedPreview: undefined,
            }))
        );
        setGlobalSettings((prev) => ({ ...prev, ...settings }));
    };

    // Calculate crop dimensions based on aspect ratio
    const calculateCropDimensions = (
        imgWidth: number,
        imgHeight: number,
        aspectRatio: CropAspectRatio
    ): { width: number; height: number; x: number; y: number } => {
        if (aspectRatio === 'free') {
            return { width: imgWidth, height: imgHeight, x: 0, y: 0 };
        }

        const ratios: Record<CropAspectRatio, number> = {
            'free': 0,
            '1:1': 1,
            '4:3': 4 / 3,
            '16:9': 16 / 9,
            '3:2': 3 / 2,
            '9:16': 9 / 16,
            '2:3': 2 / 3,
        };

        const targetRatio = ratios[aspectRatio];
        const currentRatio = imgWidth / imgHeight;

        let cropWidth = imgWidth;
        let cropHeight = imgHeight;
        let cropX = 0;
        let cropY = 0;

        if (currentRatio > targetRatio) {
            // Image is wider, crop width
            cropWidth = imgHeight * targetRatio;
            cropX = (imgWidth - cropWidth) / 2;
        } else {
            // Image is taller, crop height
            cropHeight = imgWidth / targetRatio;
            cropY = (imgHeight - cropHeight) / 2;
        }

        return { width: cropWidth, height: cropHeight, x: cropX, y: cropY };
    };

    // Process single image
    const processSingle = async (id: string) => {
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

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            if (imageFile.settings.mode === 'resize') {
                // Resize mode
                let newWidth = img.width;
                let newHeight = img.height;

                if (imageFile.settings.resizeMode === 'percentage') {
                    const scale = imageFile.settings.resizePercentage / 100;
                    newWidth = Math.round(img.width * scale);
                    newHeight = Math.round(img.height * scale);
                } else if (imageFile.settings.resizeMode === 'pixels') {
                    if (imageFile.settings.resizeWidth) {
                        newWidth = imageFile.settings.resizeWidth;
                        if (imageFile.settings.maintainAspectRatio) {
                            newHeight = Math.round((newWidth / img.width) * img.height);
                        } else if (imageFile.settings.resizeHeight) {
                            newHeight = imageFile.settings.resizeHeight;
                        }
                    } else if (imageFile.settings.resizeHeight) {
                        newHeight = imageFile.settings.resizeHeight;
                        if (imageFile.settings.maintainAspectRatio) {
                            newWidth = Math.round((newHeight / img.height) * img.width);
                        }
                    }
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
            } else {
                // Crop mode
                const crop = calculateCropDimensions(
                    img.width,
                    img.height,
                    imageFile.settings.cropAspectRatio
                );

                canvas.width = crop.width;
                canvas.height = crop.height;
                ctx.drawImage(
                    img,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
            }

            // Convert to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), imageFile.originalFile.type, 0.95);
            });

            const processedFile = new File([blob], imageFile.originalFile.name, {
                type: imageFile.originalFile.type,
            });

            const processedPreview = URL.createObjectURL(processedFile);

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            processedFile,
                            processedPreview,
                            processedWidth: canvas.width,
                            processedHeight: canvas.height,
                            status: 'completed' as const,
                        }
                        : f
                )
            );
        } catch (error) {
            console.error('Processing error:', error);
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            status: 'error' as const,
                            error: 'Processing failed',
                        }
                        : f
                )
            );
        }
    };

    // Process all
    const processAll = async () => {
        for (const file of files) {
            if (file.status === 'pending' || file.status === 'error') {
                await processSingle(file.id);
            }
        }
    };

    // Download single
    const downloadSingle = (id: string) => {
        const imageFile = files.find((f) => f.id === id);
        if (!imageFile || !imageFile.processedFile) return;

        const url = URL.createObjectURL(imageFile.processedFile);
        const a = document.createElement('a');
        a.href = url;
        const mode = imageFile.settings.mode === 'resize' ? 'resized' : 'cropped';
        a.download = `simpleverse_${mode}_${imageFile.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Download all as ZIP
    const downloadAllAsZip = async () => {
        const zip = new JSZip();

        for (const imageFile of files) {
            if (imageFile.processedFile) {
                const mode = imageFile.settings.mode === 'resize' ? 'resized' : 'cropped';
                const fileName = `${mode}_${imageFile.originalFile.name}`;
                zip.file(fileName, imageFile.processedFile);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `simpleverse_images_${Date.now()}.zip`;
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

    return {
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
    };
};
