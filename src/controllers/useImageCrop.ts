import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export type CropAspectRatio = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16' | '2:3';

export interface CropArea {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
}

export interface CropSettings {
    aspectRatio: CropAspectRatio;
    cropArea: CropArea;
}

export interface CroppedImage {
    id: string;
    originalFile: File;
    originalPreview: string;
    originalWidth: number;
    originalHeight: number;
    settings: CropSettings;
    croppedFile?: File;
    croppedPreview?: string;
    croppedWidth?: number;
    croppedHeight?: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export const useImageCrop = () => {
    const [file, setFile] = useState<CroppedImage | null>(null);
    const [globalSettings, setGlobalSettings] = useState<CropSettings>({
        aspectRatio: '16:9',
        cropArea: { x: 10, y: 10, width: 80, height: 80 },
    });

    // Calculate initial crop area based on aspect ratio
    const calculateInitialCropArea = (
        imgWidth: number,
        imgHeight: number,
        aspectRatio: CropAspectRatio
    ): CropArea => {
        if (aspectRatio === 'free') {
            return { x: 0, y: 0, width: 100, height: 100 };
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

        let cropWidth = 100;
        let cropHeight = 100;

        if (currentRatio > targetRatio) {
            // Image is wider, limit width
            cropWidth = (imgHeight * targetRatio / imgWidth) * 100;
        } else {
            // Image is taller, limit height
            cropHeight = (imgWidth / targetRatio / imgHeight) * 100;
        }

        // Center the crop
        const x = (100 - cropWidth) / 2;
        const y = (100 - cropHeight) / 2;

        return { x, y, width: cropWidth, height: cropHeight };
    };

    // Upload single file
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const uploadedFile = acceptedFiles[0];
        const id = `${Date.now()}-${Math.random()}`;
        const preview = URL.createObjectURL(uploadedFile);

        // Load image to get dimensions
        const img = new Image();
        img.src = preview;
        await new Promise((resolve) => { img.onload = resolve; });

        const initialCropArea = calculateInitialCropArea(
            img.width,
            img.height,
            globalSettings.aspectRatio
        );

        setFile({
            id,
            originalFile: uploadedFile,
            originalPreview: preview,
            originalWidth: img.width,
            originalHeight: img.height,
            settings: {
                aspectRatio: globalSettings.aspectRatio,
                cropArea: initialCropArea,
            },
            status: 'pending',
        });
    }, [globalSettings.aspectRatio]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
        },
        maxFiles: 1,
        multiple: false
    });

    const clearFile = () => {
        setFile(null);
    };

    const updateAspectRatio = (aspectRatio: CropAspectRatio) => {
        if (!file) return;

        const newCropArea = calculateInitialCropArea(
            file.originalWidth,
            file.originalHeight,
            aspectRatio
        );

        setFile({
            ...file,
            settings: {
                aspectRatio,
                cropArea: newCropArea,
            },
            status: 'pending',
            croppedFile: undefined,
            croppedPreview: undefined,
        });
        setGlobalSettings({ aspectRatio, cropArea: newCropArea });
    };

    const updateCropArea = (cropArea: CropArea) => {
        if (!file) return;
        setFile({
            ...file,
            settings: {
                ...file.settings,
                cropArea,
            },
            status: 'pending',
            croppedFile: undefined,
            croppedPreview: undefined,
        });
    };

    // Crop image
    const cropImage = async () => {
        if (!file) return;

        setFile({ ...file, status: 'processing' });

        try {
            const img = new Image();
            img.src = file.originalPreview;
            await new Promise((resolve) => { img.onload = resolve; });

            // Convert percentage to pixels
            const cropX = (file.settings.cropArea.x / 100) * img.width;
            const cropY = (file.settings.cropArea.y / 100) * img.height;
            const cropWidth = (file.settings.cropArea.width / 100) * img.width;
            const cropHeight = (file.settings.cropArea.height / 100) * img.height;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            canvas.width = cropWidth;
            canvas.height = cropHeight;
            ctx.drawImage(
                img,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), file.originalFile.type, 0.95);
            });

            const croppedFile = new File([blob], file.originalFile.name, {
                type: file.originalFile.type,
            });

            const croppedPreview = URL.createObjectURL(croppedFile);

            setFile({
                ...file,
                croppedFile,
                croppedPreview,
                croppedWidth: canvas.width,
                croppedHeight: canvas.height,
                status: 'completed',
            });
        } catch (error) {
            console.error('Crop error:', error);
            setFile({
                ...file,
                status: 'error',
                error: 'Crop failed',
            });
        }
    };

    const downloadCropped = () => {
        if (!file || !file.croppedFile) return;

        const url = URL.createObjectURL(file.croppedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simpleverse_cropped_${file.originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return {
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
    };
};
