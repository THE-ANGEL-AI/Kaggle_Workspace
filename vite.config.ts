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
        manualChunks(id) {
          // React ecosystem (includes react-dom/client, scheduler, router)
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }
          // Animation library
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion-vendor';
          }
          // Three.js ecosystem (R3F, drei, stdlib, utilities)
          if (
            id.includes('node_modules/three/') ||
            id.includes('node_modules/@react-three/') ||
            id.includes('node_modules/three-stdlib/') ||
            id.includes('node_modules/three-mesh-bvh/') ||
            id.includes('node_modules/troika-three-text/') ||
            id.includes('node_modules/meshline/') ||
            id.includes('node_modules/maath/') ||
            id.includes('node_modules/@monogrid/gainmap-js/') ||
            id.includes('node_modules/@use-gesture/') ||
            id.includes('node_modules/zustand/') ||
            id.includes('node_modules/tunnel-rat/')
          ) {
            return 'three-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // three-vendor (R3F+three+drei) lazy chunk ~914 KB — intentionally large
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
}));
