import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        // 如果后端实际没有 /api 前缀，可以加 rewrite
        // rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
