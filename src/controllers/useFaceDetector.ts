import { useState, useRef } from 'react';

interface DetectedFace {
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    landmarks?: Array<{
        type: string;
        locations: Array<{ x: number; y: number }>;
    }>;
}

export const useFaceDetector = () => {
    const [image, setImage] = useState<string | null>(null);
    const [faces, setFaces] = useState<DetectedFace[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Check if FaceDetector API is supported
    const checkSupport = () => {
        if (!('FaceDetector' in window)) {
            setIsSupported(false);
            setError('Face Detection API is not supported in this browser. Please use Chrome/Edge with experimental features enabled.');
            return false;
        }
        return true;
    };

    const handleImageUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file');
            return;
        }

        setError(null);
        setFaces([]);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const detectFaces = async () => {
        if (!checkSupport()) return;
        if (!image) {
            setError('Please upload an image first');
            return;
        }

        setIsDetecting(true);
        setError(null);

        try {
            // Create an image element to load the uploaded image
            const img = new Image();
            img.src = image;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            // Create FaceDetector instance
            const faceDetector = new (window as any).FaceDetector({
                maxDetectedFaces: 10,
                fastMode: false
            });

            // Detect faces
            const detectedFaces = await faceDetector.detect(img);

            if (detectedFaces.length === 0) {
                setError('No faces detected in the image');
                setFaces([]);
            } else {
                // Convert to our interface format
                const formattedFaces: DetectedFace[] = detectedFaces.map((face: any) => ({
                    boundingBox: {
                        x: face.boundingBox.x,
                        y: face.boundingBox.y,
                        width: face.boundingBox.width,
                        height: face.boundingBox.height
                    },
                    landmarks: face.landmarks?.map((landmark: any) => ({
                        type: landmark.type,
                        locations: landmark.locations
                    }))
                }));

                setFaces(formattedFaces);
                drawFaces(img, formattedFaces);
            }
        } catch (err) {
            console.error('Face detection error:', err);
            setError(`Detection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setFaces([]);
        } finally {
            setIsDetecting(false);
        }
    };

    const drawFaces = (img: HTMLImageElement, detectedFaces: DetectedFace[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Draw face bounding boxes
        detectedFaces.forEach((face, index) => {
            const { x, y, width, height } = face.boundingBox;

            // Draw rectangle
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw label
            ctx.fillStyle = '#3B82F6';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(`Face ${index + 1}`, x, y - 5);

            // Draw landmarks if available
            if (face.landmarks) {
                face.landmarks.forEach((landmark) => {
                    landmark.locations.forEach((point) => {
                        ctx.fillStyle = '#10B981';
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                        ctx.fill();
                    });
                });
            }
        });
    };

    const clear = () => {
        setImage(null);
        setFaces([]);
        setError(null);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
    };

    const downloadResult = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `face-detection-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return {
        image,
        faces,
        isDetecting,
        error,
        isSupported,
        canvasRef,
        handleImageUpload,
        detectFaces,
        clear,
        downloadResult
    };
};
