import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({

  plugins: [
    sveltekit(),
    // — remove this section if you moved everything into `static/`
    // viteStaticCopy({
    //   targets: [
    //     { src: 'src/lib/assets/data/*',       dest: 'data' },
    //     { src: 'src/lib/assets/images/*',     dest: 'assets/images' },
    //     { src: 'src/lib/assets/covenants/*',  dest: 'assets/covenants' },
    //     { src: 'src/lib/assets/map.pdf',      dest: 'assets' },
    //     { src: 'src/lib/assets/overlay.svg',  dest: 'assets' }
    //   ]
    // })
  ],
  optimizeDeps: {
    include: ['pdfjs']
  }
});
