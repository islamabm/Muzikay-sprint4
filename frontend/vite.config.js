import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
<<<<<<< HEAD
    outDir: '../muzikay-backend/public',
    emptyOutDir: true
  }
=======
    outDir: '../backend/public',
    emptyOutDir: true,
  },
>>>>>>> ce5dce4ca34a3038ca53c5cc57b5eaf0d56caf0e
})

