import {
  applyTransformStyleProps,
  applyTransitionStyleProps,
} from './controlStyle.js'
import { createOpacityModulate } from './godotColor.js'
import {
  resolveContainerTag,
  warnUnsupportedStyleProps,
  type HtmlStyle,
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
  style: HtmlStyle | undefined,
  componentName: string,
): void {
  if (!style) {
    return
  }

  warnUnsupportedStyleProps(style, componentName)

  const styleProps = resolveContainerTag(style).props
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
  if (typeof style.opacity === 'number' && Number.isFinite(style.opacity)) {
    props['modulate'] = createOpacityModulate(style.opacity)
  }
  applyTransformStyleProps(props, style)
  applyTransitionStyleProps(props, style)
}
