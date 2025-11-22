import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';

export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'bmp' | 'tinypng' | 'ico';

export interface ImageFile {
    id: string;
    file: File;
    preview: string;
    format: ImageFormat;
    converted?: Blob;
    convertedPreview?: string;
    convertedSize?: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export const useImageConverter = () => {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [globalFormat, setGlobalFormat] = useState<ImageFormat>('png');

    // Add files with initial format
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const newFiles: ImageFile[] = [];

        for (const file of acceptedFiles) {
            const id = `${Date.now()}-${Math.random()}`;
            const preview = URL.createObjectURL(file);

            newFiles.push({
                id,
                file,
                preview,
                format: globalFormat,
                status: 'pending',
            });
        }

        setFiles((prev) => [...prev, ...newFiles]);
    }, [globalFormat]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif']
        },
        multiple: true
    });

    // Remove file
    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    // Update format for a specific file
    const updateFileFormat = (id: string, format: ImageFormat) => {
        setFiles((prev) =>
            prev.map((f) =>
                f.id === id
                    ? {
                        ...f,
                        format,
                        // Reset status to pending if format changes
                        status: f.status === 'completed' ? 'pending' as const : f.status,
                        converted: undefined,
                        convertedPreview: undefined,
                        convertedSize: undefined,
                    }
                    : f
            )
        );
    };

    // Set global format and auto-apply to all files
    const setGlobalFormatAndApply = (format: ImageFormat) => {
        setGlobalFormat(format);
        setFiles((prev) =>
            prev.map((f) => ({
                ...f,
                format,
                // Reset status to pending if format changes so it can be reconverted
                status: f.status === 'completed' ? 'pending' as const : f.status,
                converted: undefined,
                convertedPreview: undefined,
                convertedSize: undefined,
            }))
        );
    };

    // Clear all files
    const clearAll = () => {
        setFiles([]);
    };

    // Convert single image
    const convertSingle = async (id: string) => {
        const fileIndex = files.findIndex((f) => f.id === id);
        if (fileIndex === -1) return;

        const imageFile = files[fileIndex];

        // Update status to processing
        setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: 'processing' as const } : f))
        );

        try {
            // Special handling for TinyPNG - use browser-image-compression
            if (imageFile.format === 'tinypng') {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/png',
                };

                const compressedFile = await imageCompression(imageFile.file, options);
                const convertedPreview = URL.createObjectURL(compressedFile);

                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === id
                            ? {
                                ...f,
                                converted: compressedFile,
                                convertedPreview,
                                convertedSize: compressedFile.size,
                                status: 'completed' as const,
                            }
                            : f
                    )
                );
                return;
            }

            // Standard conversion for other formats
            // Load image
            const img = new Image();
            img.src = imageFile.preview;
            await new Promise((resolve) => { img.onload = resolve; });

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            // Convert to blob
            const quality = 0.92;
            const mimeType = `image/${imageFile.format === 'jpeg' ? 'jpeg' : imageFile.format}`;

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (b) => resolve(b!),
                    mimeType,
                    quality
                );
            });

            // Create preview for converted image
            const convertedPreview = URL.createObjectURL(blob);

            // Update file with converted data
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            converted: blob,
                            convertedPreview,
                            convertedSize: blob.size,
                            status: 'completed' as const,
                        }
                        : f
                )
            );
        } catch (error) {
            console.error('Conversion error:', error);
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === id
                        ? {
                            ...f,
                            status: 'error' as const,
                            error: 'Conversion failed',
                        }
                        : f
                )
            );
        }
    };

    // Convert all images
    const convertAll = async () => {
        for (const file of files) {
            if (file.status === 'pending' || file.status === 'error') {
                await convertSingle(file.id);
            }
        }
    };

    // Download single file
    const downloadSingle = (id: string) => {
        const imageFile = files.find((f) => f.id === id);
        if (!imageFile || !imageFile.converted) return;

        const a = document.createElement('a');
        a.href = URL.createObjectURL(imageFile.converted);
        const originalName = imageFile.file.name.replace(/\.[^/.]+$/, '');
        const extension = imageFile.format === 'tinypng' ? 'png' : imageFile.format;
        a.download = `simpleverse_${originalName}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Download all as ZIP
    const downloadAllAsZip = async () => {
        const zip = new JSZip();

        for (const imageFile of files) {
            if (imageFile.converted) {
                const originalName = imageFile.file.name.replace(/\.[^/.]+$/, '');
                const extension = imageFile.format === 'tinypng' ? 'png' : imageFile.format;
                const fileName = `simpleverse_${originalName}.${extension}`;
                zip.file(fileName, imageFile.converted);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `converted-images-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const hasCompletedFiles = files.some((f) => f.status === 'completed');
    const isProcessing = files.some((f) => f.status === 'processing');

    return {
        files,
        globalFormat,
        setGlobalFormat: setGlobalFormatAndApply,
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
    };
};
