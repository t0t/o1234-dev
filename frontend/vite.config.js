import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',

  server: {
    proxy: {
      '/ask': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  preview: {
    port: 4173,
    strictPort: true,
    base: '/o1234-qa/'
  }
})