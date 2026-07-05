export interface ScreenRoute {
  name: string
  title?: string
  params?: Record<string, unknown>
  meta?: Record<string, unknown>
}

export interface ScreenStackSlotProps {
  route: ScreenRoute
  routeName: string
  index: number
  routes: readonly ScreenRoute[]
  canGoBack: boolean
  navigate: (routeName: string) => void
  back: () => void
}

export function findScreenRoute(
  routes: readonly ScreenRoute[],
  routeName: string | undefined,
): ScreenRoute | null {
  if (!routeName) {
    return null
  }
  return routes.find((route) => route.name === routeName) ?? null
}

export function resolveScreenRoute(
  routes: readonly ScreenRoute[],
  routeName: string | undefined,
  initialRouteName: string | undefined,
): ScreenRoute | null {
  return (
    findScreenRoute(routes, routeName) ??
    findScreenRoute(routes, initialRouteName) ??
    routes[0] ??
    null
  )
}
