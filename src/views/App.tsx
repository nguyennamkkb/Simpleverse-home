import { Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Hero } from './components/Hero';
import { AppGrid } from './components/AppGrid';
import { ToolsPage } from './pages/ToolsPage';
import { QRCodeGenerator } from './pages/tools/QRCodeGenerator';
import { ImageConverter } from './pages/tools/ImageConverter';
import { ImageCompressor } from './pages/tools/ImageCompressor';
import { ImageResize } from './pages/tools/ImageResize';
import { ImageCrop } from './pages/tools/ImageCrop';
import { Base64Image } from './pages/tools/Base64Image';
import { PasswordGenerator } from './pages/tools/PasswordGenerator';
import { HashEncode } from './pages/tools/HashEncode';

const Home = () => (
  <>
    <Hero />
    <AppGrid />
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">About Simpleverse</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
          Simpleverse is a collection of open-source tools built by developers, for developers.
          Our mission is to create software that respects your privacy, your time, and your intelligence.
        </p>
      </div>
    </section>
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
      </Routes>
    </Layout>
  );
}

export default App;
