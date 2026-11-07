import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // Real pages, so /founders/ is its own crawlable URL on the Worker.
    rollupOptions: {
      input: {
        main: 'index.html',
        founders: 'founders/index.html',
        faq: 'faq/index.html',
        privacy: 'privacy/index.html',
        cookies: 'cookies/index.html',
        terms: 'terms/index.html',
      },
    },
  },
});
