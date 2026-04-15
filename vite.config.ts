import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

const strictSecurityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://graphqlzero.almansi.me https://graphqlzero.almansi.me/api ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

const devSecurityHeaders = {
  ...strictSecurityHeaders,
  // Vite + @vitejs/plugin-react inject inline and eval-based dev runtime/HMR scripts.
  // Keep CSP relaxed in dev to avoid blocking the preamble.
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://graphqlzero.almansi.me https://graphqlzero.almansi.me/api ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:*",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; '),
}

function inlineBuiltCssPlugin(): Plugin {
  const inlinedCssFiles = new Set<string>()

  return {
    name: 'inline-built-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      const bundle = ctx?.bundle
      if (!bundle) {
        return html
      }

      return html.replace(
        /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css)["'][^>]*>/g,
        (tag, href: string) => {
          const normalizedHref = href.startsWith('/') ? href.slice(1) : href
          const matchedAsset = Object.values(bundle).find(
            (entry) => entry.type === 'asset' && entry.fileName === normalizedHref
          )

          if (!matchedAsset || !('source' in matchedAsset)) {
            return tag
          }

          const cssText =
            typeof matchedAsset.source === 'string'
              ? matchedAsset.source
              : matchedAsset.source.toString()

          inlinedCssFiles.add(normalizedHref)
          return `<style data-inline-css="${normalizedHref}">${cssText}</style>`
        }
      )
    },
    generateBundle(_, bundle) {
      for (const cssFile of inlinedCssFiles) {
        delete bundle[cssFile]
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isServe = command === 'serve'

  return {
    plugins: [react(), tailwindcss(), inlineBuiltCssPlugin()],
    server: {
      headers: isServe ? devSecurityHeaders : strictSecurityHeaders,
    },
    preview: {
      headers: strictSecurityHeaders,
    },
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
  }
})
