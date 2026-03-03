import type { App, Component } from '@vue/runtime-core'
import { Button } from './components/Button'
import { Canvas } from './components/Canvas'
import { Div } from './components/Div'
import { Img } from './components/Img'
import { Input } from './components/Input'
import { Option, Select } from './components/Select'
import { Span } from './components/Span'
import { Svg } from './components/Svg'
import { Textarea } from './components/Textarea'
import { Video } from './components/Video'

const components: Record<string, Component> = {
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
  // TODO: Audio, ...
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
