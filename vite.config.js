import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path ensures seamless GitHub Pages deployment
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'canvas-confetti'],
          geodata: ['./src/data/countries.js', './src/data/states.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
