import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
		  pages: 'dist',
		  assets: 'dist',
		  fallback: null
		}),
		paths: {
			base: process.env.VITE_BASE || ''
		  }
		},
	optimizeDeps: {
	  include: ['pdfjs'],
	},
});

