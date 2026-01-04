import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src/DOM'),
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
