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
    // outDir: '../muzikay-backend/public',
    // emptyOutDir: true
    outDir: '../backend/public',
    emptyOutDir: true,
  },
>>>>>>> 00fbeb08dd0c63f81b60576d29d0998fac1e0287
})
