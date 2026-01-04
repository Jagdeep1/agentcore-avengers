// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { remarkBaseUrl } from './src/lib/remark-base-url.mjs';
import { rehypeCopyButton } from './src/lib/rehype-copy-button.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://jagdeep1.github.io',
  base: process.env.NODE_ENV === 'production' ? '/agentcore-avengers/' : '/',
  integrations: [
    react(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
      remarkPlugins: [remarkBaseUrl],
      rehypePlugins: [rehypeCopyButton],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [remarkBaseUrl],
    rehypePlugins: [rehypeCopyButton],
  },
});