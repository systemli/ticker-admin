/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'TICKER_',
  server: {
    port: 3000,
    // Mirrors production: the app requests /api and the proxy maps it onto the
    // API's /v1 routes. Origin has to be set explicitly, because a same-origin
    // GET does not send one and the API resolves the ticker from it.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewrite: path => path.replace(/^\/api/, '/v1'),
        ws: true,
        headers: { Origin: 'http://localhost:3000' },
      },
    },
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
