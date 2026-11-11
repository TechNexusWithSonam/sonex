import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Same PORT the API server (server/index.js) reads from .env.
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT || 4100;
  return {
    plugins: [react()],
    base: '/',
    server: {
      port: 5174,
      proxy: { '/api': `http://localhost:${apiPort}` },
    },
    build: { assetsInlineLimit: 4096 },
  };
});
