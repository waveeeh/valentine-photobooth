import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './src',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    host: 'localhost', 
    port: 5173,
    strictPort: true, 
    open: true, 
    watch: {
      usePolling: false,
    },
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'motion', 'react-webcam', 'lucide-react'],
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})