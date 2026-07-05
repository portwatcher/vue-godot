import { defineComponent, h } from '@vue/runtime-core'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import {
  applyProgressBarProps,
  type ProgressFillMode,
} from '../utils/progressBar.js'

export type { ProgressFillMode as ActivityIndicatorFillMode }

/**
 * <ActivityIndicator> — indeterminate loading indicator.
 *
 * Maps to Godot `ProgressBar` with `indeterminate` enabled. This is a native
 * bar-style busy indicator; a spinner variant can be added later without
 * changing the basic loading-state API.
 */
export const ActivityIndicator = defineComponent({
  name: 'ActivityIndicator',
  props: {
    active: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: undefined,
    },
    fill: {
      type: String as () => ProgressFillMode,
      default: 'begin-to-end',
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      const active = props.active !== false
      const nodeProps: Record<string, unknown> = {}

      applyProgressBarProps(nodeProps, {
        value: 0,
        min: 0,
        max: 100,
        indeterminate: active,
        showPercentage: false,
        fill: props.fill,
      })

      if (!active) {
        nodeProps['visible'] = false
      }
      if (typeof props.size === 'number' && Number.isFinite(props.size)) {
        nodeProps['custom_minimum_size:x'] = props.size
        nodeProps['custom_minimum_size:y'] = props.size
      }

      applyCommonControlStyleProps(nodeProps, props.style)

      return h('ProgressBar', nodeProps)
    }
  },
})
