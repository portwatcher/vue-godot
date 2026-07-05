import type { App, Component } from '@vue/runtime-core'
import { A } from './components/A.js'
import { ActivityIndicator } from './components/ActivityIndicator.js'
import { Audio } from './components/Audio.js'
import { Button } from './components/Button.js'
import { Canvas } from './components/Canvas.js'
import { Dialog } from './components/Dialog.js'
import { Div } from './components/Div.js'
import { Img } from './components/Img.js'
import { Input } from './components/Input.js'
import { Modal } from './components/Modal.js'
import { Option, Select } from './components/Select.js'
import { Overlay } from './components/Overlay.js'
import { Pressable } from './components/Pressable.js'
import { Progress } from './components/Progress.js'
import { SafeAreaView } from './components/SafeAreaView.js'
import { ScrollView } from './components/ScrollView.js'
import { Span } from './components/Span.js'
import { Svg } from './components/Svg.js'
import { Switch } from './components/Switch.js'
import { Textarea } from './components/Textarea.js'
import { Video } from './components/Video.js'

const components: Record<string, Component> = {
  A,
  ActivityIndicator,
  Audio,
  Dialog,
  Div,
  Img,
  Span,
  Button,
  Input,
  Modal,
  Overlay,
  Pressable,
  Textarea,
  Select,
  Option,
  Progress,
  SafeAreaView,
  ScrollView,
  Canvas,
  Video,
  Svg,
  Switch,
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
