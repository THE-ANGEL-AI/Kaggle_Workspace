/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const GH_PAGES_BASE = '/Kaggle_Workspace_FreeGPU/';

export default defineConfig(({ mode }) => ({
  base: GH_PAGES_BASE,
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: false, open: false },
  build: {
    outDir: 'docs-site/dist',
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
}));
