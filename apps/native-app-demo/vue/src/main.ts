import { installBrowserAPIs } from '@vue-godot/browser'
import {
  onAppLifecycleEvent,
  type GodotAppLifecycleSubscription,
} from '@vue-godot/device/system'
import { htmlPlugin } from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { OS, VBoxContainer } from 'godot'
import App from './App.vue'
import {
  recordNativeLifecycleEvent,
  setNativeLifecycleListenerInstalled,
  type NativeBackAction,
} from './app/nativeLifecycleEvidence'
import {
  NATIVE_RELEASE_CHECKS_PREFIX,
  logProductionProfileCheckSummary,
  runProductionProfileChecks,
} from './app/productionProfileChecks'
import { router } from './app/router'

installBrowserAPIs()

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] native-app-demo passed'
const RELEASE_CHECKS_ENV = 'VUE_GODOT_RELEASE_CHECKS'
const RELEASE_CHECKS_DELAY_ENV = 'VUE_GODOT_RELEASE_CHECKS_DELAY_MS'
const RELEASE_CHECKS_PASS_MARKER =
  '[native-release-checks] native-app-demo passed'

function isEnvironmentEnabled(name: string): boolean {
  return OS.has_environment(name) && OS.get_environment(name) !== '0'
}

function readEnvironmentDelayMs(name: string): number {
  if (!OS.has_environment(name)) {
    return 0
  }

  const value = Number.parseInt(OS.get_environment(name), 10)
  return Number.isFinite(value) && value > 0 ? value : 0
}

function waitMs(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null
  private lifecycleSubscription: GodotAppLifecycleSubscription | null = null

  _ready() {
    this.lifecycleSubscription = onAppLifecycleEvent((event) => {
      if (event.type === 'back-request') {
        recordNativeLifecycleEvent(event.type, this.handleBackRequest())
        return
      }

      if (event.type === 'blur' || event.type === 'focus') {
        recordNativeLifecycleEvent(event.type)
      }
    })
    setNativeLifecycleListenerInstalled(this.lifecycleSubscription !== null)
    void this.mountApp()
  }

  private async mountApp(): Promise<void> {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin, { defaultStyles: 'native-app' })
    app.use(router)
    await router.replace('/')
    await router.isReady()
    app.mount(this)
    this.app = app

    if (isEnvironmentEnabled(SMOKE_ENV)) {
      console.log(SMOKE_PASS_MARKER)
      this.get_tree().quit(0)
      return
    }

    if (isEnvironmentEnabled(RELEASE_CHECKS_ENV)) {
      await this.runAutomatedReleaseChecks()
    }
  }

  private async runAutomatedReleaseChecks(): Promise<void> {
    try {
      const delayMs = readEnvironmentDelayMs(RELEASE_CHECKS_DELAY_ENV)
      if (delayMs > 0) {
        console.log(
          `${NATIVE_RELEASE_CHECKS_PREFIX} waiting ${delayMs}ms before automated run`,
        )
        await waitMs(delayMs)
      }
      const summary = await runProductionProfileChecks()
      logProductionProfileCheckSummary(summary)
      if (summary.failed === 0) {
        console.log(RELEASE_CHECKS_PASS_MARKER)
      }
      this.get_tree().quit(summary.failed === 0 ? 0 : 1)
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      console.error(`${NATIVE_RELEASE_CHECKS_PREFIX} fatal ${detail}`)
      this.get_tree().quit(1)
    }
  }

  private handleBackRequest(): NativeBackAction {
    if (router.currentRoute.value.path !== '/') {
      void router.push('/')
      return 'navigate-home'
    }

    return 'root'
  }

  _exit_tree() {
    this.lifecycleSubscription?.disconnect()
    this.lifecycleSubscription = null
    setNativeLifecycleListenerInstalled(false)
    this.app?.unmount()
    this.app = null
  }
}
