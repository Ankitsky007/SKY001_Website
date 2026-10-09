/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const corePublic = fileURLToPath(new URL('./packages/core/public', import.meta.url))
const testSetup = fileURLToPath(new URL('./packages/core/src/test/setup.ts', import.meta.url))

// One config for every site version; only the dev port differs.
export function defineVersionConfig(port: number) {
  return defineConfig({
    plugins: [react(), tailwindcss()],
    publicDir: corePublic,
    resolve: { dedupe: ['react', 'react-dom', 'three'] },
    server: { port, strictPort: true, host: true },
    preview: { port: port - 1000, strictPort: true, host: true },
    build: { target: 'es2022', chunkSizeWarningLimit: 1200 },
    test: {
      environment: 'jsdom',
      setupFiles: [testSetup],
    },
  })
}
