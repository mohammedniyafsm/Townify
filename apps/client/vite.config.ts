import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // needed for WSL/VM environments
    watch: {
      usePolling: true, // enables polling so Vite detects file changes
      interval: 100,    // check every 100ms
    },
    allowedHosts: [
      "nonhieratical-hoyt-handsomely.ngrok-free.dev", // your ngrok URL
      "localhost",
      "127.0.0.1",
    ],
  },
})
