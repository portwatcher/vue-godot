import { defineComponent, h, ref } from '@vue/runtime-core'
import {
  accessibilityPropOptions,
  applyAccessibilityProps,
} from '../utils/accessibility.js'
import {
  createBackgroundPanelStyle,
  createBackgroundTexturePanelProps,
  createBackgroundTexturePanelStyle,
} from '../utils/backgroundStyle.js'
import { useBackgroundTexture } from '../utils/backgroundTexture.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { FocusMode, readPressedState } from '../utils/controlInput.js'
import {
  applyAutoFocusProp,
  applyFocusTraversalProps,
  focusPropOptions,
} from '../utils/focus.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import { useHtmlComponentStyleResolver } from '../utils/styleResolver.js'
import {
  applyMinTouchTargetProps,
  touchTargetPropOptions,
} from '../utils/touchTarget.js'

export interface PressableState {
  hovered: boolean
  pressed: boolean
  focused: boolean
  disabled: boolean
}

const MouseFilter = {
  STOP: 0,
  IGNORE: 2,
} as const

const DEFAULT_LONG_PRESS_DELAY = 500

function normalizeDelay(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : DEFAULT_LONG_PRESS_DELAY
}

/**
 * <Pressable> — generic interactive wrapper backed by Godot Control input.
 */
export const Pressable = defineComponent({
  name: 'Pressable',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    longPressDelay: {
      type: Number,
      default: DEFAULT_LONG_PRESS_DELAY,
    },
    ...accessibilityPropOptions,
    ...focusPropOptions,
    ...touchTargetPropOptions,
    style: htmlStyleProp,
  },
  emits: [
    'press',
    'click',
    'longPress',
    'pressIn',
    'pressOut',
    'hoverIn',
    'hoverOut',
    'focus',
    'blur',
    'stateChange',
  ],
  setup(props, { attrs, slots, emit }) {
    const resolveStyle = useHtmlComponentStyleResolver('Pressable', attrs)
    const hovered = ref(false)
    const pressed = ref(false)
    const focused = ref(false)
    const backgroundTexture = useBackgroundTexture(
      () =>
        resolveStyle(props.style, {
          hover: hovered.value,
          pressed: pressed.value,
          focus: focused.value,
          focusVisible: focused.value,
          disabled: props.disabled === true,
      }).style,
      'Pressable',
    )
    let longPressTimer: ReturnType<typeof setTimeout> | null = null
    let longPressFired = false

    function state(): PressableState {
      return {
        hovered: hovered.value,
        pressed: pressed.value,
        focused: focused.value,
        disabled: props.disabled === true,
      }
    }

    function emitStateChange(): void {
      emit('stateChange', state())
    }

    function clearLongPressTimer(): void {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }

    function startLongPressTimer(event: unknown): void {
      clearLongPressTimer()
      longPressTimer = setTimeout(() => {
        longPressTimer = null
        if (pressed.value && props.disabled !== true) {
          longPressFired = true
          emit('longPress', event)
        }
      }, normalizeDelay(props.longPressDelay))
    }

    function beginPress(event: unknown): void {
      if (props.disabled === true || pressed.value) {
        return
      }
      pressed.value = true
      longPressFired = false
      emit('pressIn', event)
      emitStateChange()
      startLongPressTimer(event)
    }

    function endPress(event: unknown, shouldPress: boolean): void {
      if (!pressed.value) {
        return
      }
      clearLongPressTimer()
      pressed.value = false
      emit('pressOut', event)
      emitStateChange()
      if (shouldPress && !longPressFired && props.disabled !== true) {
        emit('press', event)
        emit('click', event)
      }
    }

    function setHovered(value: boolean): void {
      if (props.disabled === true || hovered.value === value) {
        return
      }
      hovered.value = value
      emit(value ? 'hoverIn' : 'hoverOut')
      emitStateChange()
    }

    function setFocused(value: boolean): void {
      if (props.disabled === true || focused.value === value) {
        return
      }
      focused.value = value
      emit(value ? 'focus' : 'blur')
      emitStateChange()
    }

    return () => {
      const nodeProps: Record<string, unknown> = {
        focus_mode: props.disabled === true ? FocusMode.NONE : FocusMode.ALL,
        mouse_filter:
          props.disabled === true ? MouseFilter.IGNORE : MouseFilter.STOP,
        onMouseEntered: () => {
          setHovered(true)
        },
        onMouseExited: () => {
          setHovered(false)
          endPress(undefined, false)
        },
        onFocusEntered: () => {
          setFocused(true)
        },
        onFocusExited: () => {
          setFocused(false)
          endPress(undefined, false)
        },
        onGuiInput: (event: unknown) => {
          if (props.disabled === true) {
            return
          }
          const pressedState = readPressedState(event)
          if (pressedState === true) {
            beginPress(event)
          } else if (pressedState === false) {
            endPress(event, true)
          }
        },
      }

      const style = resolveStyle(props.style, {
        hover: hovered.value,
        pressed: pressed.value,
        focus: focused.value,
        focusVisible: focused.value,
        disabled: props.disabled === true,
      }).style

      applyCommonControlStyleProps(nodeProps, style, 'Pressable')
      applyMinTouchTargetProps(nodeProps, props)
      applyAccessibilityProps(nodeProps, props)
      applyFocusTraversalProps(nodeProps, props)
      if (props.disabled !== true) {
        applyAutoFocusProp(nodeProps, props)
      }

      const backgroundStyle = createBackgroundPanelStyle(style)
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      if (backgroundStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundStyle
      } else if (backgroundTextureStyle) {
        nodeProps['theme_override_styles/panel'] = backgroundTextureStyle
      }

      const children = slots.default?.(state())
      if (!backgroundStyle || !backgroundTextureStyle) {
        return h('PanelContainer', nodeProps, children)
      }

      return h('PanelContainer', nodeProps, [
        h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          children,
        ),
      ])
    }
  },
})
