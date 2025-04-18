// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: process.env.VITE_BASE,
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker'],
  },
});