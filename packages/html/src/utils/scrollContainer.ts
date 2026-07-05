import {
  applyTransformStyleProps,
  applyMotionStyleProps,
} from './controlStyle.js'
import { createOpacityModulate } from './godotColor.js'
import {
  normalizeHtmlStyle,
  resolveContainerTag,
  warnUnsupportedStyleProps,
  type HtmlStyleInput,
} from './styleMapping.js'

export type ScrollViewScrollbarMode =
  | 'auto'
  | 'always'
  | 'never'
  | 'disabled'

const ScrollMode = {
  DISABLED: 0,
  AUTO: 1,
  SHOW_ALWAYS: 2,
  SHOW_NEVER: 3,
} as const

export function toScrollMode(
  enabled: boolean,
  mode: ScrollViewScrollbarMode | undefined,
): number {
  if (!enabled) {
    return ScrollMode.DISABLED
  }

  switch (mode) {
    case 'always':
      return ScrollMode.SHOW_ALWAYS
    case 'never':
      return ScrollMode.SHOW_NEVER
    case 'disabled':
      return ScrollMode.DISABLED
    case 'auto':
    case undefined:
      return ScrollMode.AUTO
  }
}

export function applyFiniteNumberProp(
  props: Record<string, unknown>,
  name: string,
  value: number | undefined,
): void {
  if (typeof value === 'number' && Number.isFinite(value)) {
    props[name] = value
  }
}

export function applyScrollContainerStyleProps(
  props: Record<string, unknown>,
  style: HtmlStyleInput,
  componentName: string,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  if (!normalizedStyle) {
    return
  }

  warnUnsupportedStyleProps(normalizedStyle, componentName)

  const styleProps = resolveContainerTag(normalizedStyle).props
  for (const propName of [
    'visible',
    'custom_minimum_size:x',
    'custom_minimum_size:y',
    'anchor_left',
    'anchor_top',
    'anchor_right',
    'anchor_bottom',
    'offset_left',
    'offset_top',
    'offset_right',
    'offset_bottom',
  ]) {
    if (propName in styleProps) {
      props[propName] = styleProps[propName]
    }
  }
  if (
    typeof normalizedStyle.opacity === 'number' &&
    Number.isFinite(normalizedStyle.opacity)
  ) {
    props['modulate'] = createOpacityModulate(normalizedStyle.opacity)
  }
  applyTransformStyleProps(props, normalizedStyle)
  applyMotionStyleProps(props, normalizedStyle)
}
