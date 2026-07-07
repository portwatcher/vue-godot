import { createMemoryHistory, createRouter } from 'vue-router'
import DeviceScreen from '../screens/DeviceScreen.vue'
import HomeScreen from '../screens/HomeScreen.vue'
import ReleaseChecksScreen from '../screens/ReleaseChecksScreen.vue'

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeScreen,
    },
    {
      path: '/device',
      name: 'device',
      component: DeviceScreen,
    },
    {
      path: '/release-checks',
      name: 'release-checks',
      component: ReleaseChecksScreen,
    },
  ],
})
