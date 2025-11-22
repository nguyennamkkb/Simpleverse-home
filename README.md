# Simpleverse Home

A modern, privacy-focused web application providing a suite of useful tools - all processed locally in your browser. Built with React, TypeScript, and Vite.

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

### 🔧 **Tools Collection**

#### **QR Code Generator**
- **Multiple QR Types**: URL, WiFi, vCard (Contact), Phone, SMS, Email
- **Full Customization**: Colors (dots, corners, background), logo upload, corner styles
- **Download Formats**: PNG, SVG, JPEG, WEBP
- **Dynamic Forms**: Type-specific input forms with validation
- **Real-time Preview**: See changes instantly

#### **Image Converter**
- **Batch Processing**: Convert multiple images simultaneously
- **6 Formats**: PNG, JPEG, WEBP, BMP, GIF, TinyPNG (optimized)
- **Format Preservation**: Original format automatically detected
- **ZIP Download**: Download all converted images as a single archive
- **Privacy-First**: All processing happens in your browser

#### **Image Compressor**
- **5 Compression Modes**:
  - **Auto**: Smart compression based on file size
  - **Lossless**: No quality loss (100%/100%)
  - **Balanced**: Good balance (80%/80%)
  - **Max**: Maximum compression (60%/60%)
  - **Custom**: Manual control with dual sliders
- **Dual Compression**:
  1. **Resize**: Reduce image dimensions (10-100%)
  2. **Quality**: Reduce pixel density/quality (10-100%)
- **Batch Support**: Compress multiple images with same settings
- **Statistics Dashboard**: Real-time savings tracker
- **Metadata Stripping**: Remove EXIF data for privacy and size reduction

### 🎨 **Design**
- **Dark Mode**: Modern dark theme with glassmorphism
- **Responsive**: Works on all devices (desktop, tablet, mobile)
- **PWA**: Install as a native app on any platform
- **Offline Support**: Core functionality works without internet

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

### Key Libraries

- **QR Code**: [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- **Image Processing**: [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- **File Upload**: [react-dropzone](https://react-dropzone.js.org/)
- **ZIP Creation**: [JSZip](https://stuk.github.io/jszip/)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/simpleverse-home.git
cd simpleverse-home

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Development

```bash
# Run development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
simpleverse-home/
├── src/
│   ├── controllers/       # Custom hooks (logic layer)
│   │   ├── useQRCodeGenerator.ts
│   │   ├── useImageConverter.ts
│   │   └── useImageCompressor.ts
│   ├── views/            # React components (UI layer)
│   │   ├── pages/        # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Tools.tsx
│   │   │   └── tools/    # Tool-specific pages
│   │   └── ui/           # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Layout.tsx
│   ├── models/           # Data models and types
│   │   ├── types.ts
│   │   ├── toolsData.ts
│   │   └── appsData.ts
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
│   ├── manifest.webmanifest
│   └── icons/
├── dist/                 # Production build output
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔒 Privacy & Security

- **No Server**: All processing happens locally in your browser
- **No Uploads**: Files never leave your device
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Full transparency of all code

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/yourusername/simpleverse-home](https://github.com/yourusername/simpleverse-home)

## 🙏 Acknowledgments

- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for amazing QR code generation
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
