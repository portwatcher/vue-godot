import type { App, Component } from '@vue/runtime-core'
import { A } from './components/A.js'
import { ActivityIndicator } from './components/ActivityIndicator.js'
import { Audio } from './components/Audio.js'
import { Button } from './components/Button.js'
import { CameraView } from './components/CameraView.js'
import { Canvas } from './components/Canvas.js'
import { Dialog } from './components/Dialog.js'
import { Div } from './components/Div.js'
import { Form } from './components/Form.js'
import { Img } from './components/Img.js'
import { Input } from './components/Input.js'
import { KeyboardAvoidingView } from './components/KeyboardAvoidingView.js'
import { Label } from './components/Label.js'
import { Modal } from './components/Modal.js'
import { Option, Select } from './components/Select.js'
import { Overlay } from './components/Overlay.js'
import { Pressable } from './components/Pressable.js'
import { Progress } from './components/Progress.js'
import { SafeAreaView } from './components/SafeAreaView.js'
import { Screen } from './components/Screen.js'
import { ScreenStack } from './components/ScreenStack.js'
import { ScrollView } from './components/ScrollView.js'
import { Span } from './components/Span.js'
import { Svg } from './components/Svg.js'
import { Switch } from './components/Switch.js'
import { Textarea } from './components/Textarea.js'
import { Video } from './components/Video.js'
import { VirtualList } from './components/VirtualList.js'
import {
  createHtmlStyleContext,
  htmlStyleContextKey,
  type HtmlPluginOptions,
} from './utils/styleResolver.js'

const components: Record<string, Component> = {
  A,
  ActivityIndicator,
  Audio,
  CameraView,
  Dialog,
  Div,
  Form,
  Img,
  Span,
  Button,
  Input,
  KeyboardAvoidingView,
  Label,
  Modal,
  Overlay,
  Pressable,
  Textarea,
  Select,
  Option,
  Progress,
  SafeAreaView,
  Screen,
  ScreenStack,
  ScrollView,
  Canvas,
  Video,
  Svg,
  Switch,
  VirtualList,
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
  install(app: App, options?: HtmlPluginOptions) {
    if (typeof app.provide === 'function') {
      app.provide(htmlStyleContextKey, createHtmlStyleContext(options))
    }

    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
      app.component(name.toLowerCase(), component)
    }
  },
}
