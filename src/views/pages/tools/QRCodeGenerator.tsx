import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Download, ArrowLeft, Settings, Palette, Image as ImageIcon, Type, Wifi, Phone, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQRCodeGenerator, type QRType } from '../../../controllers/useQRCodeGenerator';

export const QRCodeGenerator: React.FC = () => {
    const {
        qrType,
        setQRType,
        text,
        setText,
        wifiData,
        setWifiData,
        vCardData,
        setVCardData,
        phoneData,
        setPhoneData,
        smsData,
        setSMSData,
        emailData,
        setEmailData,
        fgColor,
        setFgColor,
        bgColor,
        setBgColor,
        dotStyle,
        setDotStyle,
        cornerSquareStyle,
        setCornerSquareStyle,
        cornerDotStyle,
        setCornerDotStyle,
        setLogoImage,
        fileExt,
        setFileExt,
        qrRef,
        downloadQRCode,
    } = useQRCodeGenerator();

    const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'design' | 'logo'>('content');

    const tabs = [
        { id: 'content', label: 'Content', icon: Type },
        { id: 'colors', label: 'Colors', icon: Palette },
        { id: 'design', label: 'Design', icon: Settings },
        { id: 'logo', label: 'Logo', icon: ImageIcon },
    ] as const;

    const qrTypes: { value: QRType; label: string; icon: any }[] = [
        { value: 'url', label: 'URL / Text', icon: Type },
        { value: 'wifi', label: 'WiFi Network', icon: Wifi },
        { value: 'vcard', label: 'Contact (vCard)', icon: User },
        { value: 'phone', label: 'Phone Number', icon: Phone },
        { value: 'sms', label: 'SMS Message', icon: MessageSquare },
        { value: 'email', label: 'Email', icon: Mail },
    ];

    // Handlers
    const handleExtensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFileExt(e.target.value as any);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setLogoImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Render content form based on QR type
    const renderContentForm = () => {
        switch (qrType) {
            case 'url':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">URL or Text</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                );

            case 'wifi':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Network Name (SSID)</label>
                            <input
                                type="text"
                                value={wifiData.ssid}
                                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="My WiFi Network"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="text"
                                value={wifiData.password}
                                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Encryption</label>
                            <select
                                value={wifiData.encryption}
                                onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value as any })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">No Password</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hidden"
                                checked={wifiData.hidden}
                                onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                                className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="hidden" className="ml-2 text-sm font-medium text-slate-300">
                                Hidden Network
                            </label>
                        </div>
                    </div>
                );

            case 'vcard':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={vCardData.firstName}
                                    onChange={(e) => setVCardData({ ...vCardData, firstName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={vCardData.lastName}
                                    onChange={(e) => setVCardData({ ...vCardData, lastName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                            <input
                                type="text"
                                value={vCardData.organization}
                                onChange={(e) => setVCardData({ ...vCardData, organization: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Company Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={vCardData.phone}
                                onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="+1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={vCardData.email}
                                onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                            <input
                                type="url"
                                value={vCardData.url}
                                onChange={(e) => setVCardData({ ...vCardData, url: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                );

            case 'phone':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneData.number}
                                onChange={(e) => setPhoneData({ ...phoneData, number: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="+1234567890"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Include country code for best results (e.g., +1 for USA)
                            </p>
                        </div>
                    </div>
                );

            case 'sms':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={smsData.number}
                                onChange={(e) => setSMSData({ ...smsData, number: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="+1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea
                                value={smsData.message}
                                onChange={(e) => setSMSData({ ...smsData, message: e.target.value })}
                                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                placeholder="Your pre-filled message here"
                            />
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={emailData.address}
                                onChange={(e) => setEmailData({ ...emailData, address: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Subject (Optional)</label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Email subject"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Body (Optional)</label>
                            <textarea
                                value={emailData.body}
                                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                placeholder="Email body"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/tools" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-7 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">QR Code Studio</h1>
                        <p className="text-slate-400">Create professional, branded QR codes for any purpose.</p>
                    </div>

                    {/* QR Type Selector */}
                    <Card className="p-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">QR Code Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {qrTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setQRType(type.value)}
                                        className={`flex items-center justify-center px-4 py-3 rounded-lg border transition-all ${qrType === type.value
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <div className="flex border-b border-slate-800 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-slate-800 text-white border-b-2 border-blue-500'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="p-6">
                            {activeTab === 'content' && renderContentForm()}

                            {activeTab === 'colors' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Dots Color</label>
                                            <input
                                                type="color"
                                                value={fgColor}
                                                onChange={(e) => setFgColor(e.target.value)}
                                                className="w-full h-12 rounded cursor-pointer bg-transparent border border-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="w-full h-12 rounded cursor-pointer bg-transparent border border-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'design' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Dots Style</label>
                                        <select
                                            value={dotStyle}
                                            onChange={(e) => setDotStyle(e.target.value as any)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="square">Square</option>
                                            <option value="dots">Dots</option>
                                            <option value="rounded">Rounded</option>
                                            <option value="extra-rounded">Extra Rounded</option>
                                            <option value="classy">Classy</option>
                                            <option value="classy-rounded">Classy Rounded</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Corner Square Style</label>
                                            <select
                                                value={cornerSquareStyle}
                                                onChange={(e) => setCornerSquareStyle(e.target.value as any)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="square">Square</option>
                                                <option value="dot">Dot</option>
                                                <option value="extra-rounded">Extra Rounded</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Corner Dot Style</label>
                                            <select
                                                value={cornerDotStyle}
                                                onChange={(e) => setCornerDotStyle(e.target.value as any)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="square">Square</option>
                                                <option value="dot">Dot</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logo' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Upload Logo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                        />
                                        <p className="mt-2 text-xs text-slate-500">
                                            Add a logo to the center of your QR code
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-6">
                        <Card className="p-8 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border-slate-800">
                            <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-2xl" />
                        </Card>

                        <Card className="p-6">
                            <div className="flex space-x-4 mb-4">
                                <select
                                    value={fileExt}
                                    onChange={handleExtensionChange}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WEBP</option>
                                    <option value="svg">SVG</option>
                                </select>
                                <Button onClick={downloadQRCode} icon={Download} fullWidth>
                                    Download
                                </Button>
                            </div>
                            <p className="text-xs text-center text-slate-500">
                                High-quality {fileExt.toUpperCase()} file generated locally.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
