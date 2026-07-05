import { defineComponent, h } from '@vue/runtime-core'
import {
  createFocusContainmentController,
  focusContainmentPropOptions,
} from '../utils/focus.js'
import { normalizeHtmlStyle, type HtmlStyle } from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import {
  applyWindowBaseProps,
  emitWindowClose,
  isWindowOpen,
} from '../utils/windowProps.js'

/**
 * <Dialog> — confirmation dialog backed by Godot AcceptDialog.
 */
export const Dialog = defineComponent({
  name: 'Dialog',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: undefined,
    },
    message: {
      type: String,
      default: undefined,
    },
    confirmText: {
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
    closeOnEscape: {
      type: Boolean,
      default: true,
    },
    hideOnOk: {
      type: Boolean,
      default: true,
    },
    ...focusContainmentPropOptions,
    style: htmlStyleProp,
  },
  emits: ['update:modelValue', 'confirm', 'cancel', 'close'],
  setup(props, { slots, emit }) {
    const focusContainment = createFocusContainmentController()

    return () => {
      const style = normalizeHtmlStyle(props.style)
      const visible =
        isWindowOpen(props.modelValue) && style?.display !== 'none'
      const nodeProps: Record<string, unknown> = {
        transient: true,
        exclusive: true,
        dialog_close_on_escape: props.closeOnEscape !== false,
        dialog_hide_on_ok: props.hideOnOk !== false,
        onConfirmed: () => {
          emit('confirm')
          if (props.hideOnOk !== false) {
            emit('update:modelValue', false)
          }
        },
        onCanceled: () => {
          emit('cancel')
          emitWindowClose(emit)
        },
        onCloseRequested: () => {
          emitWindowClose(emit)
        },
      }

      if (props.message) {
        nodeProps['dialog_text'] = props.message
      }
      if (props.confirmText) {
        nodeProps['ok_button_text'] = props.confirmText
      }

      applyWindowBaseProps(nodeProps, props, 'Dialog')
      focusContainment.apply(nodeProps, props, { open: visible })

      return h('AcceptDialog', nodeProps, slots.default?.())
    }
  },
})
