import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: 'index.html'
    }),
    paths: {
      base: base = process.env.VITE_BASE?.replace(/\/$/, '') || ''
    }
  }
};
