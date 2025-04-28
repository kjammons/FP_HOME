import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    sveltekit(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/lib/assets/data/*',   // GeoJSON, CSV, etc
          dest: 'data'
        },
        {
          src: 'src/lib/assets/images/*', // Images (optional but you have it)
          dest: 'assets/images'
        },
        {
          src: 'src/lib/assets/covenants/*', // Anything inside covenants (optional)
          dest: 'assets/covenants'
        },
        {
          src: 'src/lib/assets/map.pdf',  // Your map.pdf
          dest: 'assets'
        },
        {
          src: 'src/lib/assets/overlay.svg', // Your overlay.svg
          dest: 'assets'
        }
      ]
    })
  ],
  optimizeDeps: {
    include: ['pdfjs'],
  },
});
