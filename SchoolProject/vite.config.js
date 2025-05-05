// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // ESM import
import autoprefixer from 'autoprefixer'; // ESM import

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Use imported modules
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          cropper: ['react-advanced-cropper'],
          animations: ['framer-motion'],
          forms: ['react-hook-form'],
          http: ['axios']
        }
      }
    }
  }
});