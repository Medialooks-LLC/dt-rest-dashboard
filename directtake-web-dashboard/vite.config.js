import { defineConfig } from 'vite';

const directTakeTarget = process.env.DIRECTTAKE_REST_TARGET || 'http://127.0.0.1:9531';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 9001,
    proxy: {
      '/dt-api': {
        target: directTakeTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dt-api/, '/api')
      }
    }
  }
});
