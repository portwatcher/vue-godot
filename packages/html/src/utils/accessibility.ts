import type { PropType } from '@vue/runtime-core'
import type { GodotPropBag } from './controlStyle.js'

export interface AccessibilityProps {
  accessibilityLabel?: string
  ariaLabel?: string
  'aria-label'?: string
  accessibilityHint?: string
  title?: string
}

export interface AccessibilityFallbacks {
  label?: string
  hint?: string
}

export const accessibilityPropOptions = {
  accessibilityLabel: {
    type: String,
    default: undefined,
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
  'aria-label': {
    type: String,
    default: undefined,
  },
  accessibilityHint: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
} satisfies Record<keyof AccessibilityProps, PropType<string> | object>

function nonEmptyText(value: string | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function firstNonEmptyText(
  ...values: Array<string | undefined>
): string | null {
  for (const value of values) {
    const text = nonEmptyText(value)
    if (text) {
      return text
    }
  }
  return null
}

export function resolveAccessibilityTooltipText(
  props: AccessibilityProps,
  fallbacks: AccessibilityFallbacks = {},
): string | null {
  const label = firstNonEmptyText(
    props.accessibilityLabel,
    props.ariaLabel,
    props['aria-label'],
    fallbacks.label,
  )
  const hint = firstNonEmptyText(
    props.accessibilityHint,
    props.title,
    fallbacks.hint,
  )

  if (label && hint && label !== hint) {
    return `${label}\n${hint}`
  }

  return label ?? hint
}

export function applyAccessibilityProps(
  nodeProps: GodotPropBag,
  props: AccessibilityProps,
  fallbacks?: AccessibilityFallbacks,
): void {
  const tooltipText = resolveAccessibilityTooltipText(props, fallbacks)
  if (tooltipText) {
    nodeProps['tooltip_text'] = tooltipText
  }
}
