
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [
    react(), 
    sentryVitePlugin({
      org: "polotno",
      project: "polotno-studio"
    })
  ];

  // Only load componentTagger in development mode and handle ESM import
  if (mode === 'development') {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (error) {
      console.warn('lovable-tagger not available:', error.message);
    }
  }

  return {
    plugins,

    server: {
      host: "::",
      port: 8080,
      hmr: {
        clientPort: 443
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      sourcemap: true
    },

    define: {
      __WS_TOKEN__: JSON.stringify(process.env.WS_TOKEN || '')
    }
  };
});
