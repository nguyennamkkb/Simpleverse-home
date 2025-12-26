import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './layout/Layout';
import { Hero } from './components/Hero';
import { AppGrid } from './components/AppGrid';
import { WorkExperience } from './components/WorkExperience';
import { Contact } from './components/Contact';

// Lazy load all tool pages for better performance
const ToolsPage = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })));
const QRCodeGenerator = lazy(() => import('./pages/tools/QRCodeGenerator').then(m => ({ default: m.QRCodeGenerator })));
const ImageConverter = lazy(() => import('./pages/tools/ImageConverter').then(m => ({ default: m.ImageConverter })));
const ImageCompressor = lazy(() => import('./pages/tools/ImageCompressor').then(m => ({ default: m.ImageCompressor })));
const ImageResize = lazy(() => import('./pages/tools/ImageResize').then(m => ({ default: m.ImageResize })));
const ImageCrop = lazy(() => import('./pages/tools/ImageCrop').then(m => ({ default: m.ImageCrop })));
const Base64Image = lazy(() => import('./pages/tools/Base64Image').then(m => ({ default: m.Base64Image })));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const HashEncode = lazy(() => import('./pages/tools/HashEncode').then(m => ({ default: m.HashEncode })));
const JsonFormatter = lazy(() => import('./pages/tools/JsonFormatter').then(m => ({ default: m.JsonFormatter })));
const RegexTester = lazy(() => import('./pages/tools/RegexTester').then(m => ({ default: m.RegexTester })));
const JwtDecoder = lazy(() => import('./pages/tools/JwtDecoder').then(m => ({ default: m.JwtDecoder })));
const ColorTools = lazy(() => import('./pages/tools/ColorTools').then(m => ({ default: m.ColorTools })));
const CaseConverter = lazy(() => import('./pages/tools/CaseConverter').then(m => ({ default: m.CaseConverter })));
const TimestampConverter = lazy(() => import('./pages/tools/TimestampConverter').then(m => ({ default: m.TimestampConverter })));
const UrlParser = lazy(() => import('./pages/tools/UrlParser').then(m => ({ default: m.UrlParser })));
const MarkdownPreviewer = lazy(() => import('./pages/tools/MarkdownPreviewer').then(m => ({ default: m.MarkdownPreviewer })));
const FaceDetector = lazy(() => import('./pages/tools/FaceDetector').then(m => ({ default: m.FaceDetector })));
const VoiceTools = lazy(() => import('./pages/tools/VoiceTools').then(m => ({ default: m.VoiceTools })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const Home = () => (
  <>
    <Hero />
    <AppGrid />
    <WorkExperience />
    <Contact />
  </>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/qr-generator" element={<QRCodeGenerator />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/image-resize" element={<ImageResize />} />
          <Route path="/tools/image-crop" element={<ImageCrop />} />
          <Route path="/tools/base64-image" element={<Base64Image />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/hash-encode" element={<HashEncode />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/color-tools" element={<ColorTools />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/url-parser" element={<UrlParser />} />
          <Route path="/tools/markdown-previewer" element={<MarkdownPreviewer />} />
          <Route path="/tools/face-detector" element={<FaceDetector />} />
          <Route path="/tools/voice-tools" element={<VoiceTools />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
