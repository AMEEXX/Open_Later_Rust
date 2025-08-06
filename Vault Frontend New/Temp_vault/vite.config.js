import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true, 
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash].[ext]', 
        chunkFileNames: 'js/[name].[hash].js', 
        entryFileNames: 'js/[name].[hash].js', 
      },
    },
    chunkSizeWarningLimit: 1000, 
  },
  base: '/',
  server: {
    port: 5173,
    host: true,
    strictPort: true, 
    open: true, 
    historyApiFallback: {
      index: '/index.html',
    },
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: true, 
    historyApiFallback: {
      index: '/index.html',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});