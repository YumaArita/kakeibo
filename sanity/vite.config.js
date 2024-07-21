import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@sanity/base',
        '@sanity/components',
        '@sanity/core',
        '@sanity/default-layout',
        '@sanity/default-login',
        '@sanity/desk-tool',
        '@sanity/vision',
      ],
    },
  },
})
