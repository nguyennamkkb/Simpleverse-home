import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { Options, FileExtension, DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

export type QRType = 'url' | 'wifi' | 'vcard' | 'phone' | 'sms' | 'email';

interface WiFiData {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
}

interface VCardData {
    firstName: string;
    lastName: string;
    organization: string;
    phone: string;
    email: string;
    url: string;
}

interface PhoneData {
    number: string;
}

interface SMSData {
    number: string;
    message: string;
}

interface EmailData {
    address: string;
    subject: string;
    body: string;
}

export const useQRCodeGenerator = () => {
    // QR Type selection
    const [qrType, setQRType] = useState<QRType>('url');

    // URL/Text data
    const [text, setText] = useState('https://simpleverse.app');

    // WiFi data
    const [wifiData, setWifiData] = useState<WiFiData>({
        ssid: '',
        password: '',
        encryption: 'WPA',
        hidden: false,
    });

    // vCard data
    const [vCardData, setVCardData] = useState<VCardData>({
        firstName: '',
        lastName: '',
        organization: '',
        phone: '',
        email: '',
        url: '',
    });

    // Phone data
    const [phoneData, setPhoneData] = useState<PhoneData>({
        number: '',
    });

    // SMS data
    const [smsData, setSMSData] = useState<SMSData>({
        number: '',
        message: '',
    });

    // Email data
    const [emailData, setEmailData] = useState<EmailData>({
        address: '',
        subject: '',
        body: '',
    });

    // Styling options
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [dotStyle, setDotStyle] = useState<DotType>('square');
    const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>('square');
    const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('square');
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [fileExt, setFileExt] = useState<FileExtension>('png');

    const qrRef = useRef<HTMLDivElement>(null);
    const qrInstanceRef = useRef<QRCodeStyling | null>(null);

    // Generate QR data based on type
    const generateQRData = (): string => {
        switch (qrType) {
            case 'url':
                return text;

            case 'wifi':
                // WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
                return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden};;`;

            case 'vcard':
                // vCard 3.0 format
                const fullName = `${vCardData.firstName} ${vCardData.lastName}`.trim();
                return `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${vCardData.lastName};${vCardData.firstName};;;
${vCardData.organization ? `ORG:${vCardData.organization}` : ''}
${vCardData.phone ? `TEL:${vCardData.phone}` : ''}
${vCardData.email ? `EMAIL:${vCardData.email}` : ''}
${vCardData.url ? `URL:${vCardData.url}` : ''}
END:VCARD`.replace(/\n\n/g, '\n'); // Remove empty lines

            case 'phone':
                return `tel:${phoneData.number}`;

            case 'sms':
                return `SMSTO:${smsData.number}:${smsData.message}`;

            case 'email':
                const params = new URLSearchParams();
                if (emailData.subject) params.append('subject', emailData.subject);
                if (emailData.body) params.append('body', emailData.body);
                const queryString = params.toString();
                return `mailto:${emailData.address}${queryString ? '?' + queryString : ''}`;

            default:
                return text;
        }
    };

    // Build options object
    const options: Options = {
        width: size,
        height: size,
        data: generateQRData(),
        image: logoImage ?? undefined,
        margin: 10,
        qrOptions: {
            errorCorrectionLevel: 'Q',
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
        },
        dotsOptions: {
            color: fgColor,
            type: dotStyle,
        },
        backgroundOptions: {
            color: bgColor,
        },
        cornersSquareOptions: {
            type: cornerSquareStyle,
            color: fgColor,
        },
        cornersDotOptions: {
            type: cornerDotStyle,
            color: fgColor,
        },
    };

    // Initialize QRCodeStyling instance
    useEffect(() => {
        if (qrRef.current) {
            qrInstanceRef.current = new QRCodeStyling(options);
            qrInstanceRef.current.append(qrRef.current);
        }
        // Cleanup on unmount
        return () => {
            (qrInstanceRef.current as any)?.clear?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update QR code when options change
    useEffect(() => {
        qrInstanceRef.current?.update(options);
    }, [
        qrType,
        text,
        wifiData,
        vCardData,
        phoneData,
        smsData,
        emailData,
        size,
        fgColor,
        bgColor,
        dotStyle,
        cornerSquareStyle,
        cornerDotStyle,
        logoImage,
    ]);

    const downloadQRCode = async () => {
        if (!qrInstanceRef.current) return;
        const blob = await qrInstanceRef.current.getRawData(fileExt);
        if (!blob) return;
        const url = URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${qrType}.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return {
        // QR Type
        qrType,
        setQRType,

        // Type-specific data
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

        // Styling
        size,
        setSize,
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
        logoImage,
        setLogoImage,
        fileExt,
        setFileExt,

        // Actions
        qrRef,
        downloadQRCode,
    };
};
