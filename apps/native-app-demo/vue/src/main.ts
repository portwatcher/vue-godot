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
import { router } from './app/router'

installBrowserAPIs()

const SMOKE_ENV = 'VUE_GODOT_SMOKE'
const SMOKE_PASS_MARKER = '[vue-godot-smoke] native-app-demo passed'

function isSmokeEnabled(): boolean {
  return OS.has_environment(SMOKE_ENV) && OS.get_environment(SMOKE_ENV) !== '0'
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
    app.use(htmlPlugin)
    app.use(router)
    await router.replace('/')
    await router.isReady()
    app.mount(this)
    this.app = app

    if (isSmokeEnabled()) {
      console.log(SMOKE_PASS_MARKER)
      this.get_tree().quit(0)
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
