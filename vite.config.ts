import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    copyPublicDir: true,
    target: 'es2015', // Better compatibility
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Use .js extension explicitly to avoid MIME type issues
        entryFileNames: 'assets/main-[hash].js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep font files in root for easier access
          if (assetInfo.name && assetInfo.name.endsWith('.woff')) {
            return '[name].[ext]'
          }
          // Keep CSS files with .css extension
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/style-[hash].css'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  },
  server: {
    fs: {
      strict: true
    }
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.png', '**/*.jpg', '**/*.jpeg'],
  // Ensure proper module resolution
  esbuild: {
    target: 'es2015',
    format: 'esm'
  }
})
