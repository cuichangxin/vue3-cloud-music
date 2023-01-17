import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cookie from 'js-cookie'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    cors:true,
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // headers:{
        //   Cookie:cookie.get('ssoToken')
        // }
      }
    }
  }
})
