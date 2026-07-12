import { defineComponent, h } from '@vue/runtime-core'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
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
    style: htmlStyleProp,
  },
  setup(props, context) {
    const resolveStyle = useHtmlComponentStyleResolver(
      'Progress',
      context?.attrs,
    )

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
      applyCommonControlStyleProps(
        nodeProps,
        resolveStyle(props.style).style,
        'Progress',
      )

      return h('ProgressBar', nodeProps)
    }
  },
})
