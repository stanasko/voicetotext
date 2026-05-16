import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/VoiceToText/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['dexie', 'axios', 'lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
