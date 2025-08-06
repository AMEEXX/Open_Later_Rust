import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  base: '/',
  server: {
    port: 5173,
    host: true,
    historyApiFallback: {
      index: '/index.html',
    }
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: {
      index: '/index.html',
    }
  }
  
})