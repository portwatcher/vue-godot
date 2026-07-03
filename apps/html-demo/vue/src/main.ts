import { installBrowserAPIs } from '@vue-godot/browser'
import { htmlPlugin } from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { Node, OS, VBoxContainer } from 'godot'
import App from './App.vue'

installBrowserAPIs()

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_RELOADS_ENV = 'VUE_GODOT_SMOKE_RELOADS'
const DEFAULT_SMOKE_RELOADS = 3

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
    app.use(htmlPlugin)
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

    let pressedConnections = 0
    for (const button of buttons) {
      pressedConnections += button.get_signal_connection_list('pressed').size()
    }

    if (pressedConnections !== buttons.length) {
      throw new Error(
        `cycle ${cycle}: expected one pressed connection per Button, found ${pressedConnections} across ${buttons.length} buttons`,
      )
    }

    const result = buttons[0].emit_signal('pressed')
    if (result !== 0) {
      throw new Error(`cycle ${cycle}: failed to emit pressed signal: ${result}`)
    }
  }

  private async runSmokeLifecycleCheck() {
    const reloads = readPositiveIntegerEnv(
      SMOKE_RELOADS_ENV,
      DEFAULT_SMOKE_RELOADS,
    )
    const expectedChildCount = this.get_child_count()

    try {
      this.assertMountedTree(0, expectedChildCount)

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
