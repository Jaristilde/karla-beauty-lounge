import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/karla-beauty-lounge/',  // 👈 ensures assets load correctly on GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],   // ✅ optional, keeps your icons working
  },
})
