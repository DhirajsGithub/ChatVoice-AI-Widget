import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/widget',
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'AgentWidget',
      fileName: 'widget.bundle',
      formats: ['umd'], 
    },
    rollupOptions: {
      external: [], // bundle everything
      output: {
        // Force browser-compatible UMD
        format: 'umd',
        entryFileNames: 'widget.bundle.umd.js',
        globals: {}, // standalone bundle
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
  },
});
