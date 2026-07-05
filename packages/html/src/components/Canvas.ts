import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  applyTransformStyleProps,
  applyMotionStyleProps,
} from '../utils/controlStyle.js'
import { createOpacityModulate } from '../utils/godotColor.js'
import {
  applyStyleSizeProps,
  normalizeHtmlStyle,
  warnUnsupportedStyleProps,
  type HtmlStyle,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'

/** Default canvas width matching the HTML `<canvas>` default. */
const DEFAULT_WIDTH = 300

/** Default canvas height matching the HTML `<canvas>` default. */
const DEFAULT_HEIGHT = 150

/**
 * <Canvas> — 2D drawing surface component.
 *
 * Maps to a Godot `Control` node with `custom_minimum_size` set to the
 * requested `width` × `height` (defaulting to 300×150, matching HTML
 * `<canvas>` defaults).
 *
 * **MVP scope**: This component renders a bare `Control` node that can be
 * accessed via a Vue template ref. Advanced users can call Godot draw methods
 * (`_draw()` / `queue_redraw()`) on the underlying node directly.
 *
 * `getContext('2d')` is intentionally deferred for the current beta. A future
 * Canvas2D adapter should wrap Godot's `CanvasItem` draw commands with clear
 * lifecycle ownership for retained drawing state.
 *
 * Props:
 *   - `width`  — canvas width in pixels (default: 300)
 *   - `height` — canvas height in pixels (default: 150)
 *   - `style`  — subset of CSS styles
 *
 * Usage:
 *   <Canvas ref="canvasRef" :width="400" :height="300"></Canvas>
 *
 *   <!-- access the Godot Control node via template ref -->
 *   <script setup>
 *   import { ref, onMounted } from '@vue/runtime-core'
 *   const canvasRef = ref(null)
 *   onMounted(() => {
 *     // canvasRef.value is the Godot Control node
 *     canvasRef.value.queue_redraw()
 *   })
 *   </script>
 */
export const Canvas = defineComponent({
  name: 'Canvas',
  props: {
    width: {
      type: Number,
      default: DEFAULT_WIDTH,
    },
    height: {
      type: Number,
      default: DEFAULT_HEIGHT,
    },
    ...accessibilityPropOptions,
    style: htmlStyleProp,
  },
  setup(props) {
    return () => {
      const style = normalizeHtmlStyle(props.style)
      warnUnsupportedStyleProps(style, 'Canvas')
      const nodeProps: Record<string, unknown> = {}

      const resolvedSize = applyStyleSizeProps(nodeProps, style)
      const width =
        resolvedSize.widthPixels != null || resolvedSize.widthRatio != null
          ? null
          : props.width
      const height =
        resolvedSize.heightPixels != null || resolvedSize.heightRatio != null
          ? null
          : props.height

      if (typeof width === 'number' && Number.isFinite(width)) {
        nodeProps['custom_minimum_size:x'] = width
      }
      if (typeof height === 'number' && Number.isFinite(height)) {
        nodeProps['custom_minimum_size:y'] = height
      }

      // Clip drawing to the control bounds
      nodeProps['clip_contents'] = true

      // display: none
      if (style?.display === 'none') {
        nodeProps['visible'] = false
      }

      // opacity
      if (
        typeof style?.opacity === 'number' &&
        Number.isFinite(style.opacity)
      ) {
        nodeProps['modulate'] = createOpacityModulate(style.opacity)
      }
      applyTransformStyleProps(nodeProps, style)
      applyAccessibilityProps(nodeProps, props)
      applyMotionStyleProps(nodeProps, style)

      return h('Control', nodeProps)
    }
  },
})
