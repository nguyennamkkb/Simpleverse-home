import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';

export type ResizeMode = 'percentage' | 'pixels' | 'preset';

export interface ResizeSettings {
    resizeMode: ResizeMode;
    resizePercentage: number; // 10-200%
    resizeWidth?: number;
    resizeHeight?: number;
    maintainAspectRatio: boolean;
}

export interface ResizedImage {
    id: string;
    originalFile: File;
    originalPreview: string;
    originalWidth: number;
    originalHeight: number;
    settings: ResizeSettings;
    resizedFile?: File;
    resizedPreview?: string;
    resizedWidth?: number;
    resizedHeight?: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export const useImageResize = () => {
    const [files, setFiles] = useState<ResizedImage[]>([]);
    const [globalSettings, setGlobalSettings] = useState<ResizeSettings>({
        resizeMode: 'percentage',
        resizePercentage: 50,
        maintainAspectRatio: true,
    });

    // Upload files
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: ResizedImage[] = [];

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

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const clearAll = () => {
        setFiles([]);
    };

    const applySettingsToAll = (settings: Partial<ResizeSettings>) => {
        setFiles((prev) =>
            prev.map((f) => ({
                ...f,
                settings: { ...f.settings, ...settings },
                status: f.status === 'completed' ? 'pending' as const : f.status,
                resizedFile: undefined,
                resizedPreview: undefined,
            }))
        );
        setGlobalSettings((prev) => ({ ...prev, ...settings }));
    };

    // Resize single image
    const resizeSingle = async (id: string) => {
        const fileIndex = files.findIndex((f) => f.id === id);
        if (fileIndex === -1) return;

        const imageFile = files[fileIndex];

        setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: 'processing' as const } : f))
        );

        try {
            const img = new Image();
            img.src = imageFile.originalPreview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

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

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), imageFile.originalFile.type, 0.95);
            });

            const resizedFile = new File([blob], imageFile.originalFile.name, {
                type: imageFile.originalFile.type,
            });

            const resizedPreview = URL.createObjectURL(resizedFile);

            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            resizedFile,
                            resizedPreview,
                            resizedWidth: canvas.width,
                            resizedHeight: canvas.height,
                            status: 'completed' as const,
                        }
                        : f
                )
            );
        } catch (error) {
            console.error('Resize error:', error);
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            status: 'error' as const,
                            error: 'Resize failed',
                        }
                        : f
                )
            );
        }
    };

    const resizeAll = async () => {
        for (const file of files) {
            if (file.status === 'pending' || file.status === 'error') {
                await resizeSingle(file.id);
            }
        }
    };

    const downloadSingle = (id: string) => {
        const imageFile = files.find((f) => f.id === id);
        if (!imageFile || !imageFile.resizedFile) return;

        const url = URL.createObjectURL(imageFile.resizedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simpleverse_resized_${imageFile.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadAllAsZip = async () => {
        const zip = new JSZip();

        for (const imageFile of files) {
            if (imageFile.resizedFile) {
                const fileName = `resized_${imageFile.originalFile.name}`;
                zip.file(fileName, imageFile.resizedFile);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `simpleverse_resized_images_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

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
        resizeSingle,
        resizeAll,
        downloadSingle,
        downloadAllAsZip,
        formatSize,
        hasCompletedFiles,
        isProcessing,
    };
};
