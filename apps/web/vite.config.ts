import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for React
      babel: {
        plugins: [],
      },
    }),
  ],

  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@hp/types': resolve(__dirname, '../../packages/types/src'),
      '@hp/core': resolve(__dirname, '../../packages/core/src'),
    },
  },

  // Dev server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'zustand-vendor': ['zustand'],
        },
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      '@tanstack/react-query',
      'wagmi',
      'viem',
      '@rainbow-me/rainbowkit',
      '@metamask/sdk',
    ],
  },
});
