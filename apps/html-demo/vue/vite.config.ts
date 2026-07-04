import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Tags provided by @vue-godot/html — kept in sync with htmlTags from the package.
// Listed here to avoid importing at config-load time (Node ESM resolution).
const htmlTags = [
  'a',
  'audio',
  'div',
  'img',
  'span',
  'button',
  'input',
  'textarea',
  'select',
  'option',
  'canvas',
  'video',
  'svg',
]

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Nothing is a native platform element in Godot
          isNativeTag: () => false,
          // Uppercase tags are Godot nodes (custom elements) UNLESS
          // @vue-godot/html provides a component for them
          isCustomElement: (tag) =>
            tag[0] === tag[0].toUpperCase() &&
            !htmlTags.includes(tag.toLowerCase()),
        },
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: { vue: '@vue/runtime-core' },
  },
  build: {
    lib: {
      entry: 'vue/src/main.ts',
      formats: ['cjs'],
      fileName: () => 'app.js',
    },
    rollupOptions: {
      external: ['godot'],
      output: {
        // Stable chunk paths avoid stale Godot editor resource dependencies
        // when Vite rebuilds while the project is open.
        chunkFileNames: 'chunks/[name].js',
        exports: 'named',
      },
    },
    target: 'es2020',
    minify: false,
  },
})
