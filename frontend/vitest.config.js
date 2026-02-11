import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['src/__tests__/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', 'build', 'coverage'],
    css: false,
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'text-summary', 'lcov'],
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/styles/**',
        'src/**/__tests__/**',
      ],
    },
    testTimeout: 15000,
    hookTimeout: 15000,
    watch: false,
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
