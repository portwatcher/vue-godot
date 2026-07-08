import { defineComponent, h, ref } from '@vue/runtime-core'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import { createDefaultSlot } from '../utils/slots.js'
import {
  findScreenRoute,
  resolveScreenRoute,
  type ScreenRoute,
  type ScreenStackSlotProps,
} from '../utils/screenStack.js'
import { Screen } from './Screen.js'

export type { ScreenRoute, ScreenStackSlotProps } from '../utils/screenStack.js'

/**
 * <ScreenStack> — route-name screen container with named-slot rendering.
 */
export const ScreenStack = defineComponent({
  name: 'ScreenStack',
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    initialRouteName: {
      type: String,
      default: undefined,
    },
    routes: {
      type: Array as () => readonly ScreenRoute[],
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    fullRect: {
      type: Boolean,
      default: true,
    },
    style: htmlStyleProp,
    contentStyle: htmlStyleProp,
  },
  emits: ['update:modelValue', 'navigate', 'back'],
  setup(props, { attrs, slots, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('ScreenStack', attrs)
    const currentRouteName = ref<string | undefined>(undefined)
    const routeHistory = ref<string[]>([])

    function activeRoute(): ScreenRoute | null {
      return resolveScreenRoute(
        props.routes,
        props.modelValue ?? currentRouteName.value,
        props.initialRouteName,
      )
    }

    function navigate(routeName: string): void {
      const nextRoute = findScreenRoute(props.routes, routeName)
      if (!nextRoute) {
        return
      }

      const currentRoute = activeRoute()
      if (currentRoute && currentRoute.name !== nextRoute.name) {
        routeHistory.value = [...routeHistory.value, currentRoute.name]
      }

      currentRouteName.value = nextRoute.name
      emit('update:modelValue', nextRoute.name)
      emit('navigate', nextRoute)
    }

    function back(): void {
      const previousRouteName = routeHistory.value[routeHistory.value.length - 1]
      if (!previousRouteName) {
        return
      }

      routeHistory.value = routeHistory.value.slice(0, -1)
      const previousRoute = findScreenRoute(props.routes, previousRouteName)
      if (!previousRoute) {
        return
      }

      currentRouteName.value = previousRoute.name
      emit('update:modelValue', previousRoute.name)
      emit('back', previousRoute)
    }

    return () => {
      const route = activeRoute()
      const routeIndex = route
        ? props.routes.findIndex((entry) => entry.name === route.name)
        : -1
      const slotProps: ScreenStackSlotProps | null = route
        ? {
            route,
            routeName: route.name,
            index: routeIndex,
            routes: props.routes,
            canGoBack: routeHistory.value.length > 0,
            navigate,
            back,
          }
        : null
      const activeSlot =
        route && slotProps
          ? slots[route.name] ?? slots.default
          : slots.default
      const screenSlots = activeSlot
        ? createDefaultSlot(() =>
            slotProps ? activeSlot(slotProps) : activeSlot(),
          )
        : undefined

      return h(
        Screen,
        {
          visible: props.visible,
          fullRect: props.fullRect,
          style: resolveStyle(props.style).style,
          contentStyle: props.contentStyle,
        },
        screenSlots,
      )
    }
  },
})
