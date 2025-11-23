import React, { useRef } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import {
    ArrowLeft,
    Scan,
    Upload,
    Trash2,
    Download,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFaceDetector } from '../../../controllers/useFaceDetector';

export const FaceDetector: React.FC = () => {
    const {
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
    } = useFaceDetector();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Face Detector</h1>
                    <p className="text-slate-400">
                        Detect faces in images using Chrome's Shape Detection API.
                    </p>
                </div>

                {/* Browser Support Warning */}
                {!isSupported && (
                    <Card className="p-6 mb-8 bg-yellow-500/10 border-yellow-500/30">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-yellow-400 mb-2">Browser Not Supported</h3>
                                <p className="text-sm text-slate-300 mb-3">
                                    The Face Detection API is currently experimental and only available in Chrome/Edge.
                                </p>
                                <p className="text-sm text-slate-400">
                                    <strong>To enable:</strong> Open <code className="bg-slate-900 px-2 py-0.5 rounded">chrome://flags</code> and enable "Experimental Web Platform features"
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Upload & Controls */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-400" />
                                Upload Image
                            </h3>

                            {/* Upload Area */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                            >
                                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                <p className="text-slate-400 mb-2">Click to upload or drag & drop</p>
                                <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <Button
                                    onClick={detectFaces}
                                    disabled={!image || isDetecting || !isSupported}
                                    variant="primary"
                                    className="flex-1"
                                    icon={isDetecting ? Loader2 : Scan}
                                >
                                    {isDetecting ? 'Detecting...' : 'Detect Faces'}
                                </Button>
                                <Button
                                    onClick={clear}
                                    disabled={!image}
                                    variant="outline"
                                    icon={Trash2}
                                >
                                    Clear
                                </Button>
                            </div>
                        </Card>

                        {/* Results Info */}
                        {faces.length > 0 && (
                            <Card className="p-6 bg-green-500/10 border-green-500/30">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-green-400 mb-2">
                                            {faces.length} Face{faces.length > 1 ? 's' : ''} Detected
                                        </h3>
                                        <div className="space-y-2">
                                            {faces.map((face, index) => (
                                                <div key={index} className="bg-slate-950 rounded p-3 text-sm">
                                                    <div className="font-semibold text-slate-300 mb-1">Face {index + 1}</div>
                                                    <div className="text-xs text-slate-500 space-y-1">
                                                        <div>X: {Math.round(face.boundingBox.x)}px</div>
                                                        <div>Y: {Math.round(face.boundingBox.y)}px</div>
                                                        <div>Width: {Math.round(face.boundingBox.width)}px</div>
                                                        <div>Height: {Math.round(face.boundingBox.height)}px</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Error Display */}
                        {error && (
                            <Card className="p-6 bg-red-500/10 border-red-500/30">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-red-400 mb-1">Error</h3>
                                        <p className="text-sm text-slate-300">{error}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Preview */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Preview</h3>
                            {faces.length > 0 && (
                                <Button
                                    onClick={downloadResult}
                                    variant="outline"
                                    size="sm"
                                    icon={Download}
                                >
                                    Download
                                </Button>
                            )}
                        </div>

                        <div className="bg-slate-950 rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center">
                            {image ? (
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto"
                                />
                            ) : (
                                <div className="text-center text-slate-500 p-8">
                                    <Scan className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Upload an image to detect faces</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
