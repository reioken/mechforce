import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  oxc: {
    jsx: { runtime: 'automatic', importSource: 'preact' },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 4000,
  },
  server: { host: true, port: 5173 },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
} as any);
