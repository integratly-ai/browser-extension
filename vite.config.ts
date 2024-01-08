import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve('src/'),
    },
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background.ts'), // Add this line
      },
    },
  },
});
