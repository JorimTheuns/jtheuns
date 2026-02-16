// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

import mdx from '@astrojs/mdx';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
  output: 'static',
  integrations: [mdx()],
});