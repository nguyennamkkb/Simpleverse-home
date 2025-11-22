import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export type ConversionMode = 'image-to-base64' | 'base64-to-image';

export interface Base64Conversion {
    mode: ConversionMode;
    // Image to Base64
    imageFile?: File;
    imagePreview?: string;
    base64String?: string;
    // Base64 to Image
    inputBase64?: string;
    decodedImage?: string;
    decodedFileName?: string;
    decodedMimeType?: string;
}

export const useBase64Image = () => {
    const [conversion, setConversion] = useState<Base64Conversion>({
        mode: 'image-to-base64',
    });

    // Upload image for Image → Base64
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);

        // Convert to Base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setConversion({
                mode: 'image-to-base64',
                imageFile: file,
                imagePreview: preview,
                base64String: base64,
            });
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg']
        },
        maxFiles: 1,
        multiple: false
    });

    // Switch mode
    const switchMode = (mode: ConversionMode) => {
        setConversion({ mode });
    };

    // Convert Base64 → Image
    const convertBase64ToImage = (base64Input: string) => {
        try {
            // Clean up input (remove data:image/... prefix if exists)
            let base64String = base64Input.trim();

            // Extract MIME type if present
            let mimeType = 'image/png'; // default
            let fileName = 'image.png';

            if (base64String.startsWith('data:')) {
                const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
                if (matches) {
                    mimeType = matches[1];
                    base64String = matches[2];

                    // Determine file extension from MIME type
                    const ext = mimeType.split('/')[1];
                    fileName = `image.${ext}`;
                }
            }

            // Validate Base64
            try {
                atob(base64String);
            } catch (e) {
                throw new Error('Invalid Base64 string');
            }

            // Create data URL
            const dataUrl = `data:${mimeType};base64,${base64String}`;

            setConversion({
                mode: 'base64-to-image',
                inputBase64: base64Input,
                decodedImage: dataUrl,
                decodedFileName: fileName,
                decodedMimeType: mimeType,
            });
        } catch (error) {
            console.error('Base64 conversion error:', error);
            alert('Invalid Base64 string. Please check your input.');
        }
    };

    // Copy Base64 to clipboard
    const copyBase64 = async () => {
        if (!conversion.base64String) return;

        try {
            await navigator.clipboard.writeText(conversion.base64String);
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            return false;
        }
    };

    // Download decoded image
    const downloadDecodedImage = () => {
        if (!conversion.decodedImage || !conversion.decodedFileName) return;

        const a = document.createElement('a');
        a.href = conversion.decodedImage;
        a.download = `simpleverse_${conversion.decodedFileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Clear conversion
    const clear = () => {
        setConversion({ mode: conversion.mode });
    };

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return {
        conversion,
        getRootProps,
        getInputProps,
        isDragActive,
        switchMode,
        convertBase64ToImage,
        copyBase64,
        downloadDecodedImage,
        clear,
        formatSize,
    };
};
