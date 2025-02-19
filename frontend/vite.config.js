import { defineConfig } from 'vite'

export default defineConfig({
  base: '/o1234-qa/',  // Para GitHub Pages

  server: {
    proxy: {
      '/o1234-qa/ask': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/o1234-qa/, '')
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
