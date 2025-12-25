import { Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Hero } from './components/Hero';
import { AppGrid } from './components/AppGrid';
import { WorkExperience } from './components/WorkExperience';
import { Contact } from './components/Contact';
import { ToolsPage } from './pages/ToolsPage';
import { QRCodeGenerator } from './pages/tools/QRCodeGenerator';
import { ImageConverter } from './pages/tools/ImageConverter';
import { ImageCompressor } from './pages/tools/ImageCompressor';
import { ImageResize } from './pages/tools/ImageResize';
import { ImageCrop } from './pages/tools/ImageCrop';
import { Base64Image } from './pages/tools/Base64Image';
import { PasswordGenerator } from './pages/tools/PasswordGenerator';
import { HashEncode } from './pages/tools/HashEncode';
import { JsonFormatter } from './pages/tools/JsonFormatter';
import { RegexTester } from './pages/tools/RegexTester';
import { JwtDecoder } from './pages/tools/JwtDecoder';
import { ColorTools } from './pages/tools/ColorTools';
import { CaseConverter } from './pages/tools/CaseConverter';
import { TimestampConverter } from './pages/tools/TimestampConverter';
import { UrlParser } from './pages/tools/UrlParser';
import { MarkdownPreviewer } from './pages/tools/MarkdownPreviewer';
import { FaceDetector } from './pages/tools/FaceDetector';
import { VoiceTools } from './pages/tools/VoiceTools';

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
    </Layout>
  );
}

export default App;
