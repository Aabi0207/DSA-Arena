import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/questions': {
        target: 'http://127.0.0.1:8000', // or wherever your Django backend is running
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
