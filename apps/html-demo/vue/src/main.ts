import { installBrowserAPIs } from '@vue-godot/browser'
import { createHtmlStyleSheet, htmlPlugin } from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { Node, OS, VBoxContainer } from 'godot'
import App from './App.vue'
import {
  assertBrowserSmokeResults,
  formatBrowserSmokeResults,
  runBrowserSmokeTests,
} from './browserSmoke'
import './vite-global.css'

installBrowserAPIs()

const htmlDemoStyleSheet = createHtmlStyleSheet(
  `
    :root {
      --demo-css-surface: #102a43;
      --demo-css-border: #38bdf8;
      --demo-css-text: #e0f2fe;
      --demo-css-muted: #bae6fd;
      --demo-css-action: #0ea5e9;
      --demo-css-action-pressed: #0369a1;
      --demo-css-radius: 8px;
      --demo-css-space: 10px;
    }

    .css-theme-card {
      background-color: var(--demo-css-surface);
      border: 1px solid var(--demo-css-border);
      border-radius: var(--demo-css-radius);
      padding: var(--demo-css-space);
      gap: 8px;
      width: 420px;
    }

    .css-theme-title {
      color: var(--demo-css-text);
      font-size: 18px;
      font-weight: bold;
    }

    .css-theme-copy {
      color: var(--demo-css-muted);
      font-size: 14px;
    }

    .css-theme-row {
      flex-direction: row;
      gap: 8px;
      align-items: center;
    }

    Button.css-theme-action {
      background-color: var(--demo-css-action);
      border: 1px solid var(--demo-css-border);
      border-radius: 6px;
      color: #ffffff;
      padding: 8px 12px;
    }

    Button.css-theme-action:hover,
    Button.css-theme-action:pressed {
      background-color: var(--demo-css-action-pressed);
    }

    Button.css-theme-action:disabled {
      opacity: 0.45;
    }

    Input.css-theme-input:focus,
    Input.css-theme-input:focus-visible {
      border-color: #facc15;
      border-width: 2px;
    }

    .css-theme-grow {
      flex: 1;
    }

    @media (max-width: 520px) {
      .css-theme-card {
        width: 100%;
        padding: 8px;
      }

      .css-theme-row {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
  { source: 'html-demo.css' },
)

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_RELOADS_ENV = 'VUE_GODOT_SMOKE_RELOADS'
const SMOKE_FETCH_URL_ENV = 'VUE_GODOT_SMOKE_FETCH_URL'
const SMOKE_FETCH_TEXT_ENV = 'VUE_GODOT_SMOKE_FETCH_TEXT'
const DEFAULT_SMOKE_RELOADS = 3

function readOptionalEnv(name: string): string | undefined {
  return OS.has_environment(name) ? OS.get_environment(name) : undefined
}

function readPositiveIntegerEnv(name: string, fallback: number): number {
  if (!OS.has_environment(name)) {
    return fallback
  }

  const value = Number.parseInt(OS.get_environment(name), 10)
  return Number.isInteger(value) && value > 0 ? value : fallback
}

function isSmokeEnabled(): boolean {
  return OS.has_environment(SMOKE_ENV) && OS.get_environment(SMOKE_ENV) !== '0'
}

function findNodesByClass(root: Node, className: string): Node[] {
  const matches: Node[] = []
  const childCount = root.get_child_count()

  for (let i = 0; i < childCount; i++) {
    const child = root.get_child(i)
    if (!child) {
      continue
    }

    if (child.is_class(className)) {
      matches.push(child)
    }

    matches.push(...findNodesByClass(child, className))
  }

  return matches
}

function getStringProperty(node: Node, property: string): string | undefined {
  const value: unknown = node.get(property)
  return typeof value === 'string' ? value : undefined
}

function findNodeByStringProperty(
  nodes: readonly Node[],
  property: string,
  expected: string,
): Node | undefined {
  return nodes.find((node) => getStringProperty(node, property) === expected)
}

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null
  private smokeMounts = 0
  private smokeUnmounts = 0

  _ready() {
    this.mountApp()

    if (isSmokeEnabled()) {
      void this.runSmokeLifecycleCheck()
    }
  }

  _exit_tree() {
    this.unmountApp()
  }

  private mountApp() {
    this.unmountApp()
    const app = createApp(App)
    app.use(htmlPlugin, {
      defaultStyles: 'browser',
      stylesheets: [htmlDemoStyleSheet],
    })
    app.mount(this)
    this.app = app
    this.smokeMounts++
  }

  private unmountApp() {
    if (!this.app) {
      return
    }

    this.app.unmount()
    this.app = null
    this.smokeUnmounts++
  }

  private async nextFrame() {
    await this.get_tree().create_timer(0).timeout.as_promise()
  }

  private async assertAfterUnmount(cycle: number) {
    this.unmountApp()
    await this.nextFrame()

    const childCount = this.get_child_count()
    if (childCount !== 0) {
      throw new Error(
        `cycle ${cycle}: expected 0 children after unmount, found ${childCount}`,
      )
    }
  }

  private assertMountedTree(cycle: number, expectedChildCount: number): void {
    const childCount = this.get_child_count()
    if (childCount !== expectedChildCount) {
      throw new Error(
        `cycle ${cycle}: expected ${expectedChildCount} mounted children, found ${childCount}`,
      )
    }

    const buttons = findNodesByClass(this, 'Button')
    if (buttons.length === 0) {
      throw new Error(`cycle ${cycle}: expected at least one Button node`)
    }

    let connectedButton: Node | null = null
    for (const button of buttons) {
      const connectionCount = button.get_signal_connection_list('pressed').size()
      if (connectionCount > 1) {
        throw new Error(
          `cycle ${cycle}: expected at most one pressed connection per Button, found ${connectionCount}`,
        )
      }
      if (connectionCount === 1 && !connectedButton) {
        connectedButton = button
      }
    }

    if (!connectedButton) {
      throw new Error(`cycle ${cycle}: expected at least one connected Button`)
    }

    const result = connectedButton.emit_signal('pressed')
    if (result !== 0) {
      throw new Error(
        `cycle ${cycle}: failed to emit pressed signal: ${result}`,
      )
    }
  }

  private async assertBrowserSmoke(): Promise<void> {
    const results = await runBrowserSmokeTests({
      fetchUrl: readOptionalEnv(SMOKE_FETCH_URL_ENV),
      fetchText: readOptionalEnv(SMOKE_FETCH_TEXT_ENV),
    })
    console.log(
      `[vue-godot-smoke] browser=${formatBrowserSmokeResults(results)}`,
    )
    assertBrowserSmokeResults(results)
  }

  private assertSignalConnectionCount(
    node: Node,
    signalName: string,
    expected: number,
  ): void {
    const actual = node.get_signal_connection_list(signalName).size()
    if (actual !== expected) {
      throw new Error(
        `expected ${expected} ${signalName} connection(s) on ${node.get_class()}, found ${actual}`,
      )
    }
  }

  private assertLabelText(expected: string): void {
    const labels = findNodesByClass(this, 'Label')
    if (!findNodeByStringProperty(labels, 'text', expected)) {
      throw new Error(`expected Label text "${expected}"`)
    }
  }

  private emitChecked(
    node: Node,
    signalName: string,
    ...args: unknown[]
  ): void {
    const result = node.emit_signal(signalName, ...args)
    if (result !== 0) {
      throw new Error(
        `failed to emit ${signalName} on ${node.get_class()}: ${result}`,
      )
    }
  }

  private async assertFormSmoke(): Promise<void> {
    const lineEdits = findNodesByClass(this, 'LineEdit')
    const textInput = findNodeByStringProperty(
      lineEdits,
      'placeholder_text',
      'Type something...',
    )
    const passwordInput = findNodeByStringProperty(
      lineEdits,
      'placeholder_text',
      'Secret',
    )

    if (!textInput || !passwordInput) {
      throw new Error('expected text and password LineEdit nodes')
    }

    this.assertSignalConnectionCount(textInput, 'text_changed', 1)
    this.emitChecked(textInput, 'text_changed', 'Smoke text')
    await this.nextFrame()
    this.assertLabelText('Text input: Smoke text')

    this.assertSignalConnectionCount(passwordInput, 'text_changed', 1)
    this.emitChecked(passwordInput, 'text_changed', 'hunter2')
    await this.nextFrame()
    this.assertLabelText('Password length: 7')

    const checkboxes = findNodesByClass(this, 'CheckBox')
    const checkbox = checkboxes[0]
    if (!checkbox) {
      throw new Error('expected CheckBox node')
    }

    this.assertSignalConnectionCount(checkbox, 'toggled', 1)
    this.emitChecked(checkbox, 'toggled', true)
    await this.nextFrame()
    this.assertLabelText('Checked: true')

    const sliders = findNodesByClass(this, 'HSlider')
    const slider = sliders[0]
    if (!slider) {
      throw new Error('expected HSlider node')
    }

    this.assertSignalConnectionCount(slider, 'value_changed', 1)
    this.emitChecked(slider, 'value_changed', 75)
    await this.nextFrame()
    this.assertLabelText('Range: 75')

    const textEdits = findNodesByClass(this, 'TextEdit')
    const textarea = findNodeByStringProperty(
      textEdits,
      'placeholder_text',
      'Multi-line text...',
    )
    if (!textarea) {
      throw new Error('expected TextEdit node')
    }

    this.assertSignalConnectionCount(textarea, 'text_changed', 1)
    textarea.set('text', 'line one\nline two')
    this.emitChecked(textarea, 'text_changed')
    await this.nextFrame()
    this.assertLabelText('Textarea lines: 2')

    const optionButtons = findNodesByClass(this, 'OptionButton')
    const optionButton = optionButtons[0]
    if (!optionButton) {
      throw new Error('expected OptionButton node')
    }

    this.assertSignalConnectionCount(optionButton, 'item_selected', 1)
    this.emitChecked(optionButton, 'item_selected', 1)
    await this.nextFrame()
    this.assertLabelText('Selected: banana')

    console.log('[vue-godot-smoke] forms=ok')
  }

  private async assertAssetSmoke(): Promise<void> {
    await this.nextFrame()

    const textureRects = findNodesByClass(this, 'TextureRect')
    if (textureRects.length < 2) {
      throw new Error('expected Img and Svg TextureRect nodes')
    }

    let loadedTextureCount = 0
    for (const node of textureRects) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const texture = node.get('texture')
        if (texture != null) {
          loadedTextureCount += 1
          break
        }
        await this.nextFrame()
      }
    }

    if (loadedTextureCount < 2) {
      throw new Error('expected loaded textures for Img and Svg')
    }

    console.log('[vue-godot-smoke] assets=ok')
  }

  private async runSmokeLifecycleCheck() {
    const reloads = readPositiveIntegerEnv(
      SMOKE_RELOADS_ENV,
      DEFAULT_SMOKE_RELOADS,
    )
    const expectedChildCount = this.get_child_count()

    try {
      this.assertMountedTree(0, expectedChildCount)
      await this.assertBrowserSmoke()
      await this.assertFormSmoke()
      await this.assertAssetSmoke()

      for (let cycle = 1; cycle <= reloads; cycle++) {
        await this.assertAfterUnmount(cycle)
        this.mountApp()
        this.assertMountedTree(cycle, expectedChildCount)
      }

      await this.assertAfterUnmount(reloads + 1)

      console.log(
        `[vue-godot-smoke] passed reloads=${reloads} mounts=${this.smokeMounts} unmounts=${this.smokeUnmounts}`,
      )
      this.get_tree().quit(0)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`[vue-godot-smoke] failed: ${message}`)
      this.get_tree().quit(1)
    }
  }
}
