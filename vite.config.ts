// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === 'development'
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));


import { defineConfig } from 'vite'
import { ConfigEnv, UserConfigExport } from 'vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// Import your plugins properly
import react from '@vitejs/plugin-react-swc'
// If you're using other plugins, import them here

export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: 'localhost',
    port: 8080
  },
  plugins: [
    react(),
    nodePolyfills(),
    // Add other plugins here, but don't include boolean values
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      crypto: 'crypto-js'
    }
  },
  optimizeDeps: {
    exclude: ['crypto']
  }
}))