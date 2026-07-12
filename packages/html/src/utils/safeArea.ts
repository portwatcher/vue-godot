import { DisplayServer, ProjectSettings } from 'godot'
import { zeroEdgeInsets } from './edgeInsets.js'
import {
  normalizeHtmlStyle,
  resolvePadding,
  type HtmlStyleInput,
} from './styleMapping.js'

export type SafeAreaEdge = 'top' | 'right' | 'bottom' | 'left'

export interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

interface Size2D {
  x: number
  y: number
}

interface Rect2D {
  x: number
  y: number
  width: number
  height: number
}

const VIEWPORT_WIDTH_SETTING = 'display/window/size/viewport_width'
const VIEWPORT_HEIGHT_SETTING = 'display/window/size/viewport_height'

export const allSafeAreaEdges: SafeAreaEdge[] = [
  'top',
  'right',
  'bottom',
  'left',
]

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function nonNegative(value: number): number {
  return Math.max(0, value)
}

function readVector2(value: unknown): Size2D | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const x = finiteNumber(record.x)
  const y = finiteNumber(record.y)
  return x != null && y != null ? { x, y } : null
}

function readRect(value: unknown): Rect2D | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const position = readVector2(record.position)
  const size = readVector2(record.size)
  if (position && size) {
    return {
      x: position.x,
      y: position.y,
      width: size.x,
      height: size.y,
    }
  }

  const x = finiteNumber(record.x)
  const y = finiteNumber(record.y)
  const width = finiteNumber(record.width)
  const height = finiteNumber(record.height)
  return x != null && y != null && width != null && height != null
    ? { x, y, width, height }
    : null
}

export function normalizeSafeAreaInsets(
  value: Partial<SafeAreaInsets> | undefined,
): SafeAreaInsets {
  return {
    top: nonNegative(finiteNumber(value?.top) ?? 0),
    right: nonNegative(finiteNumber(value?.right) ?? 0),
    bottom: nonNegative(finiteNumber(value?.bottom) ?? 0),
    left: nonNegative(finiteNumber(value?.left) ?? 0),
  }
}

export function computeSafeAreaInsets(
  safeAreaValue: unknown,
  viewportSizeValue: unknown,
  fallbackInsets?: Partial<SafeAreaInsets>,
  targetViewportSizeValue?: unknown,
): SafeAreaInsets {
  const safeArea = readRect(safeAreaValue)
  const viewportSize = readVector2(viewportSizeValue)
  if (!safeArea || !viewportSize) {
    return normalizeSafeAreaInsets(fallbackInsets)
  }

  const physicalInsets = {
    top: nonNegative(safeArea.y),
    left: nonNegative(safeArea.x),
    right: nonNegative(viewportSize.x - (safeArea.x + safeArea.width)),
    bottom: nonNegative(viewportSize.y - (safeArea.y + safeArea.height)),
  }
  const targetViewportSize = readVector2(targetViewportSizeValue)
  if (!targetViewportSize || viewportSize.x <= 0 || viewportSize.y <= 0) {
    return physicalInsets
  }

  const scaleX = targetViewportSize.x / viewportSize.x
  const scaleY = targetViewportSize.y / viewportSize.y
  return {
    top: physicalInsets.top * scaleY,
    right: physicalInsets.right * scaleX,
    bottom: physicalInsets.bottom * scaleY,
    left: physicalInsets.left * scaleX,
  }
}

function readProjectViewportSize(): Size2D | null {
  const width = finiteNumber(
    ProjectSettings.get_setting(VIEWPORT_WIDTH_SETTING),
  )
  const height = finiteNumber(
    ProjectSettings.get_setting(VIEWPORT_HEIGHT_SETTING),
  )
  return width != null && width > 0 && height != null && height > 0
    ? { x: width, y: height }
    : null
}

export function readDisplayServerSafeAreaInsets(
  fallbackInsets?: Partial<SafeAreaInsets>,
): SafeAreaInsets {
  try {
    const safeArea = DisplayServer.get_display_safe_area()
    let viewportSize = DisplayServer.window_get_size()
    if (!readVector2(viewportSize)) {
      viewportSize = DisplayServer.screen_get_size()
    }
    return computeSafeAreaInsets(
      safeArea,
      viewportSize,
      fallbackInsets,
      readProjectViewportSize(),
    )
  } catch (_error) {
    return normalizeSafeAreaInsets(fallbackInsets)
  }
}

export function resolveSafeAreaPadding(
  style: HtmlStyleInput,
  safeAreaInsets: SafeAreaInsets,
  edges: SafeAreaEdge[] | undefined,
): SafeAreaInsets {
  const activeEdges = new Set(edges ?? allSafeAreaEdges)
  const stylePadding =
    resolvePadding(normalizeHtmlStyle(style) ?? {}) ?? zeroEdgeInsets

  return {
    top: stylePadding.top + (activeEdges.has('top') ? safeAreaInsets.top : 0),
    right:
      stylePadding.right +
      (activeEdges.has('right') ? safeAreaInsets.right : 0),
    bottom:
      stylePadding.bottom +
      (activeEdges.has('bottom') ? safeAreaInsets.bottom : 0),
    left:
      stylePadding.left + (activeEdges.has('left') ? safeAreaInsets.left : 0),
  }
}
