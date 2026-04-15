import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiKey = env.VITE_SPORTS_API_KEY

  return {
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      /**
       * v2 requires X-API-KEY header. Browsers block this cross-origin via CORS.
       * Proxy through Vite dev server so requests are same-origin from the browser.
       */
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
          headers: apiKey ? { "X-API-KEY": apiKey } : {},
        },
      },
    },
  }
})
