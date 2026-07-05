import type { GodotPropBag } from './controlStyle.js'
import type { HtmlStyle } from './styleMapping.js'

/**
 * TextureRect.ExpandMode enum values (Godot 4.x).
 *
 * @see https://docs.godotengine.org/en/4.4/classes/class_texturerect.html#enum-texturerect-expandmode
 */
const ExpandMode = {
  EXPAND_KEEP_SIZE: 0,
  EXPAND_IGNORE_SIZE: 1,
  EXPAND_FIT_WIDTH: 2,
  EXPAND_FIT_WIDTH_PROPORTIONAL: 3,
  EXPAND_FIT_HEIGHT: 4,
  EXPAND_FIT_HEIGHT_PROPORTIONAL: 5,
} as const

/**
 * TextureRect.StretchMode enum values (Godot 4.x).
 *
 * @see https://docs.godotengine.org/en/4.4/classes/class_texturerect.html#enum-texturerect-stretchmode
 */
const StretchMode = {
  STRETCH_SCALE: 0,
  STRETCH_TILE: 1,
  STRETCH_KEEP: 2,
  STRETCH_KEEP_CENTERED: 3,
  STRETCH_KEEP_ASPECT: 4,
  STRETCH_KEEP_ASPECT_CENTERED: 5,
  STRETCH_KEEP_ASPECT_COVERED: 6,
} as const

export interface TextureRectFitMapping {
  expand_mode: number
  stretch_mode: number
}

/**
 * Maps CSS `object-fit` values to Godot TextureRect expand_mode / stretch_mode.
 *
 *   CSS object-fit   → Godot
 *   fill             → EXPAND_IGNORE_SIZE + STRETCH_SCALE
 *   contain          → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_CENTERED
 *   cover            → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_COVERED
 *   none             → EXPAND_IGNORE_SIZE + STRETCH_KEEP_CENTERED
 *   scale-down       → EXPAND_IGNORE_SIZE + STRETCH_KEEP_ASPECT_CENTERED
 */
export function resolveTextureRectObjectFit(
  fit: HtmlStyle['objectFit'] | undefined,
): TextureRectFitMapping | null {
  switch (fit) {
    case 'fill':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_SCALE,
      }
    case 'contain':
    case 'scale-down':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_ASPECT_CENTERED,
      }
    case 'cover':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_ASPECT_COVERED,
      }
    case 'none':
      return {
        expand_mode: ExpandMode.EXPAND_IGNORE_SIZE,
        stretch_mode: StretchMode.STRETCH_KEEP_CENTERED,
      }
    default:
      return null
  }
}

export function applyTextureRectObjectFitProps(
  nodeProps: GodotPropBag,
  style: HtmlStyle | undefined,
  hasExplicitSize: boolean,
): void {
  const fitMapping = resolveTextureRectObjectFit(style?.objectFit)
  if (fitMapping) {
    nodeProps['expand_mode'] = fitMapping.expand_mode
    nodeProps['stretch_mode'] = fitMapping.stretch_mode
  } else if (hasExplicitSize) {
    // When explicit size is set but no objectFit, respect the size and
    // preserve aspect ratio by default.
    nodeProps['expand_mode'] = ExpandMode.EXPAND_IGNORE_SIZE
    nodeProps['stretch_mode'] = StretchMode.STRETCH_KEEP_ASPECT_CENTERED
  }
}
