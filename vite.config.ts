import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 450,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 12000,
          groups: [
            {
              name: "react-core",
              test: /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//,
            },
            {
              name: "apollo-graphql",
              test: /node_modules\/(@apollo|graphql|graphql-tag|optimism)\//,
            },
            {
              name: "ui-kit",
              test: /node_modules\/(radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge|tw-animate-css|@fontsource-variable)\//,
            },
            {
              name: "vendor",
              test: /node_modules\//,
            },
          ],
        },
      },
    },
  },
})
