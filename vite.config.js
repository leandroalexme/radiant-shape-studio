
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { componentTagger } from "lovable-tagger";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), 
    sentryVitePlugin({
      org: "polotno",
      project: "polotno-studio"
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),

  server: {
    host: "::",
    port: 8080
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true
  }
}))
