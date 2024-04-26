/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'TICKER_',
  server: {
    port: 3000,
  },
  plugins: [react()],
  test: {
    silent: true,
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
    },
  },
})
