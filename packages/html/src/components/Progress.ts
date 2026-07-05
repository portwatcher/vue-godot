import { defineComponent, h } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import {
  applyProgressBarProps,
  type ProgressFillMode,
} from '../utils/progressBar.js'

export type { ProgressFillMode }

/**
 * <Progress> — determinate or indeterminate progress bar.
 *
 * Maps to Godot `ProgressBar`, including Range value props and native
 * indeterminate animation support.
 */
export const Progress = defineComponent({
  name: 'Progress',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: undefined,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    showPercentage: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: String as () => ProgressFillMode,
      default: 'begin-to-end',
    },
    ...accessibilityPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      const nodeProps: Record<string, unknown> = {}

      applyProgressBarProps(nodeProps, {
        value: props.value,
        min: props.min,
        max: props.max,
        step: props.step,
        indeterminate: props.indeterminate,
        showPercentage: props.showPercentage,
        fill: props.fill,
      })
      applyCommonControlStyleProps(nodeProps, props.style, 'Progress')
      applyAccessibilityProps(nodeProps, props)

      return h('ProgressBar', nodeProps)
    }
  },
})
