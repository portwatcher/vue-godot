import { installBrowserAPIs } from '@vue-godot/browser'
import {
  onAppLifecycleEvent,
  type GodotAppLifecycleSubscription,
} from '@vue-godot/device/system'
import {
  createHtmlStyleContext,
  createHtmlStyleSheet,
  htmlPlugin,
  refreshHtmlStyleContextViewport,
} from '@vue-godot/html'
import { createApp } from '@vue-godot/runtime-tscn'
import { Callable, Engine, OS, VBoxContainer } from 'godot'
import { runtimeVersion } from 'godot-js'
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

const nativeAppStyleContext = createHtmlStyleContext({
  defaultStyles: 'native-app',
  stylesheets: [
    createHtmlStyleSheet(
      `
        .native-app-shell {
          width: 720px;
          min-height: 520px;
          background-color: #111827;
          padding: 8px;
        }

        .native-home-screen {
          flex-direction: column;
          gap: 12px;
          padding: 8px;
        }

        .native-home-header {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .native-status-grid {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 520px) {
          .native-app-shell {
            width: 100%;
            min-height: 0;
            padding: 6px;
          }

          .native-home-screen {
            gap: 10px;
            padding: 4px;
          }

          .native-home-header {
            flex-direction: column;
            align-items: stretch;
          }

          .native-status-grid {
            flex-direction: column;
          }
        }

        @media (min-width: 900px) {
          .native-app-shell {
            width: 860px;
            min-height: 600px;
            padding: 16px;
          }

          .native-home-screen {
            gap: 16px;
          }
        }
      `,
      { source: 'native-app-demo.css' },
    ),
  ],
})

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] native-app-demo passed'
const EXPORT_SMOKE_FEATURE = 'godot_js_runtime_export_smoke'
const EXPORT_SMOKE_PASS_MARKER = '[godot-js-runtime-export] VUE PASS'
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

interface GodotSignal {
  connect(callable: Callable): unknown
  disconnect(callable: Callable): unknown
  is_connected?: (callable: Callable) => boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGodotSignal(value: unknown): value is GodotSignal {
  return (
    isRecord(value) &&
    typeof value['connect'] === 'function' &&
    typeof value['disconnect'] === 'function'
  )
}

function readGodotSignal(
  target: unknown,
  signalName: string,
): GodotSignal | null {
  if (!isRecord(target)) {
    return null
  }

  const signal = target[signalName]
  return isGodotSignal(signal) ? signal : null
}

function isSignalConnected(signal: GodotSignal, callable: Callable): boolean {
  return typeof signal.is_connected === 'function'
    ? signal.is_connected(callable)
    : true
}

export default class Root extends VBoxContainer {
  private app: ReturnType<typeof createApp> | null = null
  private lifecycleSubscription: GodotAppLifecycleSubscription | null = null
  private viewportResizeCallable: Callable | null = null
  private viewportResizeSignal: GodotSignal | null = null

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
    this.connectViewportResize()
    void this.mountApp()
  }

  private connectViewportResize(): void {
    refreshHtmlStyleContextViewport(nativeAppStyleContext)
    const signal = readGodotSignal(this.get_tree().root, 'size_changed')
    if (!signal) {
      return
    }

    const callable = new Callable(
      Callable.create(() => {
        refreshHtmlStyleContextViewport(nativeAppStyleContext)
      }),
    )
    signal.connect(callable)
    this.viewportResizeSignal = signal
    this.viewportResizeCallable = callable
  }

  private async mountApp(): Promise<void> {
    this.app?.unmount()
    const app = createApp(App)
    app.use(htmlPlugin, { styleContext: nativeAppStyleContext })
    app.use(router)
    await router.replace('/')
    await router.isReady()
    app.mount(this)
    this.app = app

    if (OS.has_feature(EXPORT_SMOKE_FEATURE)) {
      const godotVersion = String(Engine.get_version_info().get('string'))
      console.log(
        `${EXPORT_SMOKE_PASS_MARKER} runtime=${runtimeVersion()} godot=${godotVersion} platform=${OS.get_name()}`,
      )
      if (OS.get_name() !== 'Web') this.get_tree().quit(0)
      return
    }

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
    if (
      this.viewportResizeSignal &&
      this.viewportResizeCallable &&
      isSignalConnected(this.viewportResizeSignal, this.viewportResizeCallable)
    ) {
      this.viewportResizeSignal.disconnect(this.viewportResizeCallable)
    }
    this.viewportResizeSignal = null
    this.viewportResizeCallable = null
    this.lifecycleSubscription?.disconnect()
    this.lifecycleSubscription = null
    setNativeLifecycleListenerInstalled(false)
    this.app?.unmount()
    this.app = null
  }
}
