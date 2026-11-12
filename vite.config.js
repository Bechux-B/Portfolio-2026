import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Portfolio-2026/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
