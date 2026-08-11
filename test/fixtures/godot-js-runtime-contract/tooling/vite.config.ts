import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { commonJsBundleBanner } from '@vue-godot/runtime-tscn/bundle-format'
import { defineConfig } from 'vite'

const fixtureRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

export default defineConfig({
  root: fixtureRoot,
  build: {
    lib: {
      entry: path.join(fixtureRoot, 'src/main.ts'),
      formats: ['cjs'],
      fileName: () => 'app.js',
    },
    outDir: path.join(fixtureRoot, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['godot'],
      output: {
        banner: commonJsBundleBanner,
        chunkFileNames: 'chunks/[name].js',
        exports: 'named',
      },
    },
    target: 'es2020',
    minify: false,
  },
})
