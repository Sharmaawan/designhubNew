import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'canonical-localhost-origin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.headers.host?.split(':')[0] === '127.0.0.1') {
            res.writeHead(302, { Location: `http://localhost:5173${req.url ?? '/'}` })
            res.end()
            return
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
  optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
  build: { chunkSizeWarningLimit: 1200 },
})
