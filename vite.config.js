import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default defineConfig({
	preprocess: vitePreprocess(),
	plugins: [sveltekit()],
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

