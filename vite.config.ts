import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // [Critical Fix 1] Use relative path './' so assets load correctly on GitHub Pages
    // regardless of the repository name (solves 404/white screen).
    base: './',
    define: {
      // [Critical Fix 2] Polyfill process.env so the app can read API keys
      // injected during the GitHub Action build process.
      'process.env': {
        API_KEY: env.API_KEY,
        VITE_FINNHUB_API_KEY: env.VITE_FINNHUB_API_KEY,
        VITE_FIREBASE_CONFIG_STRING: env.VITE_FIREBASE_CONFIG_STRING
      }
    }
  }
})