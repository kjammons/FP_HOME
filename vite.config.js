// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // Uncomment and adjust the base URL if needed:
  // base: '/FP_HOME/',
});
