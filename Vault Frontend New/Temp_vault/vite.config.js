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
  },
  base: './',
  server: {
    port: 5173,
    host: true,
    // Simple approach - this should work
    historyApiFallback: true
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: true
  }
})