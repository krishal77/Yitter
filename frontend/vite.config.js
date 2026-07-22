import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('recharts/')) {
              return 'vendor-charts';
            }
            if (id.includes('framer-motion/')) {
              return 'vendor-motion';
            }
            if (id.includes('@tanstack/react-query/') || id.includes('axios/')) {
              return 'vendor-query';
            }
            if (id.includes('lucide-react/')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
})
