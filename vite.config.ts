/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'TICKER_',
  server: {
    port: 3000,
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
    },
    testTimeout: 10000,
  },
})
