import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'vendor-motion': ['framer-motion'],
          // Heavy tools libraries
          'vendor-image': ['browser-image-compression', 'pica', 'jszip'],
          'vendor-qr': ['qr-code-styling', 'qrcode.react'],
          'vendor-crypto': ['crypto-js'],
          'vendor-markdown': ['marked'],
        }
      }
    }
  }
})
