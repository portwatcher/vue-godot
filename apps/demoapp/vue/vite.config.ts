import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with uppercase letters as custom elements
          isCustomElement: (tag) => tag[0] === tag[0].toUpperCase(),
        },
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    // `vue` → `@vue/runtime-core` so the DOM renderer is tree-shaken
    alias: { vue: '@vue/runtime-core' },
  },
  build: {
    lib: {
      entry: 'vue/src/main.ts',
      formats: ['cjs'],
      fileName: () => 'app.js',
    },
    // everything provided by the engine/runtime stays external
    rollupOptions: {
      external: ['godot'],
      output: {
        exports: 'named',
      },
    },
    target: 'es2020',
  },
})
