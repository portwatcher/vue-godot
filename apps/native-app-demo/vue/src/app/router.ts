import { createMemoryHistory, createRouter } from 'vue-router'
import DeviceScreen from '../screens/DeviceScreen.vue'
import HomeScreen from '../screens/HomeScreen.vue'

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
  ],
})
