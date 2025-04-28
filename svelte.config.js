import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: 'index.html'
    }),
    paths: {
      // dev:       ''
      // preview: '/FP_HOME'
      base: process.env.VITE_BASE || ''
    }
  }
};
