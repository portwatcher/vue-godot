import type { App } from '@vue/runtime-core'
import { Div } from './components/Div'
import { Img } from './components/Img'

const components: Record<string, any> = {
  Div,
  Img,
  // TODO: Span, Button, Input, Textarea, Select, Video, Audio, Svg, ...
}

/**
 * HTML tag names that this package provides components for.
 * Used to configure Vue's compiler so these tags are resolved
 * as components instead of being treated as native HTML elements.
 *
 * Usage in vite.config.ts:
 *   import { htmlTags } from '@vue-godot/html'
 *
 *   vue({
 *     template: {
 *       compilerOptions: {
 *         isNativeTag: (tag) => !htmlTags.includes(tag),
 *       }
 *     }
 *   })
 */
export const htmlTags: string[] = Object.keys(components).map((k) => k.toLowerCase())

/**
 * Vue plugin that globally registers all HTML-like components.
 * Registers both PascalCase and lowercase names so that
 * existing SPAs using <div>, <img> work without renaming.
 *
 * Usage:
 *   import { createApp } from '@vue-godot/runtime-tscn'
 *   import { htmlPlugin } from '@vue-godot/html'
 *
 *   const app = createApp(Root)
 *   app.use(htmlPlugin)
 *   app.mount(this)
 */
export const htmlPlugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
      app.component(name.toLowerCase(), component)
    }
  },
}
