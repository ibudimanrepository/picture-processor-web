import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/picture-processor-web/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
