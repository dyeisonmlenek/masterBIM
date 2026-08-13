import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/masterBIM/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ["web-ifc", "@thatopen/components", "@thatopen/fragments", "@thatopen/ui", "@thatopen/ui-obc"]
  }
})