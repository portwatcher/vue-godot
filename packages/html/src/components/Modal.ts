import { defineComponent, h } from '@vue/runtime-core'
import type { HtmlStyle } from '../utils/styleMapping.js'
import {
  applyWindowBaseProps,
  emitWindowClose,
} from '../utils/windowProps.js'

/**
 * <Modal> — modal window backed by Godot Window.
 */
export const Modal = defineComponent({
  name: 'Modal',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: undefined,
    },
    width: {
      type: Number,
      default: undefined,
    },
    height: {
      type: Number,
      default: undefined,
    },
    minWidth: {
      type: Number,
      default: undefined,
    },
    minHeight: {
      type: Number,
      default: undefined,
    },
    exclusive: {
      type: Boolean,
      default: true,
    },
    transient: {
      type: Boolean,
      default: true,
    },
    popup: {
      type: Boolean,
      default: false,
    },
    unresizable: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    return () => {
      const nodeProps: Record<string, unknown> = {
        wrap_controls: true,
        transient: props.transient !== false,
        exclusive: props.exclusive !== false,
        popup_window: props.popup === true,
        unresizable: props.unresizable === true,
        onCloseRequested: () => {
          emitWindowClose(emit)
        },
      }

      applyWindowBaseProps(nodeProps, props, 'Modal')

      return h('Window', nodeProps, slots.default?.())
    }
  },
})
