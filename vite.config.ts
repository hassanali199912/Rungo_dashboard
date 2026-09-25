import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@features": path.resolve(import.meta.dirname, "src/feature"),
      "@assets": path.resolve(import.meta.dirname, "src/assets"),
      "@config": path.resolve(import.meta.dirname, "src/config"),
      "@styles": path.resolve(import.meta.dirname, "src/styles"),

    }
  }
})
