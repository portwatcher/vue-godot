import vue from '@vitejs/plugin-vue'
import { commonJsBundleBanner } from '@vue-godot/runtime-tscn/bundle-format'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // There are no browser-native HTML elements in Godot
          isNativeTag: () => false,
          // Uppercase tags → Godot nodes via ClassDB (custom elements)
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
        banner: commonJsBundleBanner,
        // Stable chunk paths avoid stale Godot editor resource dependencies
        // when Vite rebuilds while the project is open.
        chunkFileNames: 'chunks/[name].js',
        exports: 'named',
      },
    },
    target: 'es2020',
  },
})
