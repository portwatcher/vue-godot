import { DisplayServer } from 'godot'
import { zeroEdgeInsets, type EdgeInsets } from './edgeInsets.js'
import {
  resolvePadding,
  toNumericPixels,
  type HtmlStyle,
} from './styleMapping.js'

export type KeyboardAvoidingBehavior = 'padding' | 'position' | 'height'

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function nonNegative(value: number): number {
  return Math.max(0, value)
}

export function normalizeKeyboardHeight(
  value: unknown,
  fallbackHeight?: number,
): number {
  return nonNegative(
    finiteNumber(value) ?? finiteNumber(fallbackHeight) ?? 0,
  )
}

export function readVirtualKeyboardHeight(
  fallbackHeight?: number,
): number {
  try {
    return normalizeKeyboardHeight(
      DisplayServer.virtual_keyboard_get_height(),
      fallbackHeight,
    )
  } catch (_error) {
    return normalizeKeyboardHeight(undefined, fallbackHeight)
  }
}

export function normalizeKeyboardAvoidingBehavior(
  value: string | undefined,
): KeyboardAvoidingBehavior {
  switch (value) {
    case 'height':
    case 'position':
    case 'padding':
      return value
    case undefined:
      return 'padding'
    default:
      return 'padding'
  }
}

export function resolveKeyboardAvoidanceHeight(
  keyboardHeight: number,
  keyboardVerticalOffset: number | undefined,
  enabled: boolean,
): number {
  if (!enabled) {
    return 0
  }

  return nonNegative(
    keyboardHeight - (finiteNumber(keyboardVerticalOffset) ?? 0),
  )
}

export function resolveKeyboardAvoidingInsets(
  style: HtmlStyle | undefined,
  keyboardAvoidance: number,
  includeKeyboardAvoidance: boolean,
): EdgeInsets {
  const stylePadding = resolvePadding(style ?? {}) ?? zeroEdgeInsets

  return {
    top: stylePadding.top,
    right: stylePadding.right,
    bottom:
      stylePadding.bottom +
      (includeKeyboardAvoidance ? keyboardAvoidance : 0),
    left: stylePadding.left,
  }
}

export function resolveKeyboardAvoidingHeight(
  style: HtmlStyle | undefined,
  keyboardAvoidance: number,
): number | null {
  const height = toNumericPixels(style?.height)
  return height == null ? null : nonNegative(height - keyboardAvoidance)
}
