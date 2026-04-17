import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wi-ts.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['three', 'gsap', 'lenis'],
    },
  },
});
