import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // `vue` → `@vue/runtime-core` so the DOM renderer is tree-shaken
    alias: { vue: '@vue/runtime-core' },
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: () => 'app.js',
    },
    // everything provided by the engine/runtime stays external
    rollupOptions: {
      external: ['@vue/runtime-core', 'godot'],
    },
    target: 'es2020',
  },
})
