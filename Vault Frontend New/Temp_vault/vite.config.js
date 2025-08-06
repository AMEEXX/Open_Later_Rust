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

    historyApiFallback: {

      rewrites: [
        { from: /^\/capsule\/[a-zA-Z0-9_-]+$/, to: '/index.html' },  
        { from: /^\/capsules$/, to: '/index.html' },
        { from: /^\/create$/, to: '/index.html' },
        { from: /^\/(?!api|assets|src|@|node_modules).*/, to: '/index.html' }
      ]
    }
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/capsule\/[a-zA-Z0-9_-]+$/, to: '/index.html' }, 
        { from: /^\/capsules$/, to: '/index.html' },
        { from: /^\/create$/, to: '/index.html' },
        { from: /^\/(?!api|assets|src|@|node_modules).*/, to: '/index.html' }
      ]
    }
  }
})