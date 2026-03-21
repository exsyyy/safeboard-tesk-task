import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Эта строчка принудительно заставит все библиотеки использовать
    // только ту копию React, которая установлена в корне проекта
    dedupe: ['react', 'react-dom']
  }
})