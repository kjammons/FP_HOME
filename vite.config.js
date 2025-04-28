import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    sveltekit(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/lib/assets/data/*',
          dest: 'data'
        },
        {
          src: 'src/lib/assets/images/*',
          dest: 'assets/images'
        },
        {
          src: 'src/lib/assets/covenants/*',
          dest: 'assets/covenants'
        },
        {
          src: 'src/lib/assets/map.pdf',
          dest: 'assets'
        },
        {
          src: 'src/lib/assets/overlay.svg',
          dest: 'assets'
        }
      ]
    })
  ],
  optimizeDeps: {
    include: ['pdfjs'],
  },
});
