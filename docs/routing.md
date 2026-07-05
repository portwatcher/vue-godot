# Routing And Navigation

Vue Godot supports two navigation styles:

- Use `<ScreenStack>` from `@vue-godot/html` for native-style screen stacks
  when you do not need the Vue Router ecosystem.
- Use Vue Router with `@vue-godot/browser` when you want route records,
  guards, nested routes, route params, and existing Vue app patterns.

Godot is not a browser. `@vue-godot/browser` provides in-memory `history`,
`location`, and `popstate` APIs so routers can run, but there is no address bar,
document scroll restoration, server fallback, or page reload navigation.

## Vue Router Setup

Install browser globals before creating the router. `createWebHistory()` works
against the in-memory history/location pair supplied by `@vue-godot/browser`.

```ts
import { createApp } from '@vue-godot/runtime-tscn'
import { installBrowserAPIs } from '@vue-godot/browser'
import { createRouter, createWebHistory } from 'vue-router'
import Root from './Root.vue'

installBrowserAPIs()

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    { path: '/', name: 'home', component: () => import('./screens/Home.vue') },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./screens/Settings.vue'),
    },
  ],
})

const app = createApp(Root)
app.use(router)
```

Use `createMemoryHistory()` instead when you explicitly do not want URL-shaped
paths. `createWebHistory()` is the better default for migration from Vue web
apps because it exercises the same route path behavior, even though the history
is still process-local inside Godot.

Avoid router features that require a DOM document, such as browser anchor
scrolling. If you need per-screen scroll restoration, store offsets in your
screen component state or in `sessionStorage`.

## ScreenStack Setup

For app shells that only need route names and a native back stack,
`<ScreenStack>` is simpler than Vue Router:

```vue
<template>
  <ScreenStack v-model="activeRoute" :routes="routes">
    <template #home="{ navigate }">
      <HomeScreen @settings="navigate('settings')"></HomeScreen>
    </template>

    <template #settings="{ back }">
      <SettingsScreen @done="back()"></SettingsScreen>
    </template>
  </ScreenStack>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ScreenStack } from '@vue-godot/html'
import HomeScreen from './screens/HomeScreen.vue'
import SettingsScreen from './screens/SettingsScreen.vue'

const activeRoute = ref('home')
const routes = [
  { name: 'home', title: 'Home' },
  { name: 'settings', title: 'Settings' },
]
</script>
```

Use this for game menus, settings stacks, inventory screens, and small native
apps where path parsing is not useful.

## Stacks, Tabs, And Modals

With Vue Router, model navigation presentation in route metadata:

```ts
const routes = [
  { path: '/', name: 'home', component: HomeScreen, meta: { tab: 'main' } },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryScreen,
    meta: { tab: 'main' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsScreen,
    meta: { presentation: 'modal' },
  },
]
```

Then render the current route into the Godot UI primitive that matches the
presentation:

```vue
<template>
  <Screen v-if="route.meta.presentation !== 'modal'">
    <RouterView></RouterView>
  </Screen>

  <Modal v-else :model-value="true" title="Settings" @close="router.back()">
    <RouterView></RouterView>
  </Modal>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Modal, Screen } from '@vue-godot/html'

const route = useRoute()
const router = useRouter()
</script>
```

For tabs, keep tab state in route params, route names, or a small store. Godot
does not have browser tab focus semantics, so make the selected tab an explicit
part of your UI state.

## Deep Links

Incoming links require a native plugin or app-specific bridge. Register a
`DeepLinkAdapter`, then route the initial URL and runtime URL events:

```ts
import {
  onOpenUrl,
  readInitialOpenUrl,
} from '@vue-godot/device/system'
import { registerDeviceCapability } from '@vue-godot/device'

registerDeviceCapability({
  capability: 'deep-links',
  pluginName: 'my-links-plugin',
  isSupported() {
    return myLinksPlugin.isAvailable()
  },
  getInitialUrl() {
    return myLinksPlugin.getInitialUrl()
  },
  subscribeUrlOpen(handler) {
    return myLinksPlugin.onOpenUrl((url) => handler({ url }))
  },
})

function routeForUrl(url: string) {
  const parsed = new URL(url)
  const customSchemePath =
    parsed.protocol !== 'http:' && parsed.protocol !== 'https:' && parsed.host
      ? `/${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}`
      : parsed.pathname

  return `${customSchemePath || '/'}${parsed.search}${parsed.hash}`
}

const initialUrl = await readInitialOpenUrl()
if (initialUrl) {
  await router.replace(routeForUrl(initialUrl))
}

onOpenUrl((event) => {
  void router.push(routeForUrl(event.url))
})
```

Android intent filters, iOS universal/app links, URL schemes, entitlements, and
export settings remain native plugin responsibilities.

## Back And Escape

Use `onAppLifecycleEvent()` for Android back requests and window close
requests. Route back through the highest-priority UI layer first: open modal,
screen stack, router history, then app-specific quit/confirm behavior.

```ts
import { onAppLifecycleEvent } from '@vue-godot/device/system'

const lifecycle = onAppLifecycleEvent((event) => {
  if (event.type !== 'back-request' && event.type !== 'quit-request') {
    return
  }

  if (isSettingsModalOpen.value) {
    isSettingsModalOpen.value = false
    return
  }

  if (globalThis.history.length > 1) {
    router.back()
    return
  }

  showQuitConfirm.value = true
})
```

For keyboard and controller escape behavior, map Godot input actions such as
`ui_cancel` and project-specific actions to component events. `<Form>` can emit
`reset` from `ui_cancel`; `<Pressable>` and focused buttons should use
`ui_accept` for activation. Keep back/escape behavior in one app-shell module
so modals, tabs, and stacks resolve conflicts predictably.

Disconnect lifecycle subscriptions on scene teardown or app unmount:

```ts
lifecycle?.disconnect()
```

Apps that use `createMemoryHistory()` should keep an app-owned route depth or
back stack instead of checking `globalThis.history.length`.

## State Persistence

Use route query/params for shareable logical navigation state and Web Storage
for local restoration:

```ts
router.afterEach((route) => {
  sessionStorage.setItem('last-route', route.fullPath)
})

const lastRoute = sessionStorage.getItem('last-route')
if (lastRoute) {
  await router.replace(lastRoute)
}
```

Use `localStorage` for durable app preferences and `sessionStorage` for runtime
navigation restoration. Storage is Godot-backed where available, but it is not a
replacement for save-game or database formats when you need schema migrations,
large payloads, or transactional writes.

## Errors

Use Vue Router error hooks and Vue app error handling together:

```ts
router.onError((error) => {
  console.error('[router]', error)
})

app.config.errorHandler = (error) => {
  console.error('[vue]', error)
}
```

For screen-level recovery, use Vue's `onErrorCaptured()` in layout components
and route to a known fallback screen or modal. Keep fatal Godot/native plugin
errors out of route guards when possible; adapter capability checks should run
before showing screens that need the capability.

## Project Structure

A production app should keep routing concerns separate from Godot scene setup:

```text
vue/
  src/
    app/
      router.ts
      navigation.ts
      storage.ts
      device.ts
    screens/
      HomeScreen.vue
      SettingsScreen.vue
      InventoryScreen.vue
    components/
      AppShell.vue
      TabBar.vue
      ModalHost.vue
    main.ts
```

- `router.ts` owns route records and history selection.
- `navigation.ts` owns deep links, Android back, modal precedence, and route
  restoration.
- `device.ts` registers native capability adapters before browser APIs install.
- Screens stay UI-focused and receive native capability status as props or via a
  small store.

This structure keeps editor reloads predictable and makes it clear which layer
is responsible for Godot-native behavior versus Vue route state.
