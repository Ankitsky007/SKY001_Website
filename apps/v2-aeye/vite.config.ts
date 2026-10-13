import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { defineVersionConfig } from '../../vite.shared.ts'

// v2 aeye. Dev server: http://localhost:5172 (front page) and /sky-001.html (SKY-001 launch page).
export default mergeConfig(defineVersionConfig(5172), {
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        sky: fileURLToPath(new URL('./sky-001.html', import.meta.url)),
      },
    },
  },
})
