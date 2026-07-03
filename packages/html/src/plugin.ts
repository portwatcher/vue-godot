import type { App, Component } from '@vue/runtime-core'
import { A } from './components/A.js'
import { Audio } from './components/Audio.js'
import { Button } from './components/Button.js'
import { Canvas } from './components/Canvas.js'
import { Div } from './components/Div.js'
import { Img } from './components/Img.js'
import { Input } from './components/Input.js'
import { Option, Select } from './components/Select.js'
import { Span } from './components/Span.js'
import { Svg } from './components/Svg.js'
import { Textarea } from './components/Textarea.js'
import { Video } from './components/Video.js'

const components: Record<string, Component> = {
  A,
  Audio,
  Div,
  Img,
  Span,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Canvas,
  Video,
  Svg,
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
 *         isNativeTag: () => false,
 *         isCustomElement: (tag) =>
 *           tag[0] === tag[0].toUpperCase() &&
 *           !htmlTags.includes(tag.toLowerCase()),
 *       }
 *     }
 *   })
 */
export const htmlTags: string[] = Object.keys(components).map((k) =>
  k.toLowerCase(),
)

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
