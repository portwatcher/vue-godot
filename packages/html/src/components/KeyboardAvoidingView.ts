import { defineComponent, h } from '@vue/runtime-core'
import {
  createBackgroundPanelStyle,
  createBackgroundTexturePanelProps,
  createBackgroundTexturePanelStyle,
} from '../utils/backgroundStyle.js'
import { useBackgroundTexture } from '../utils/backgroundTexture.js'
import { applyCommonControlStyleProps } from '../utils/controlStyle.js'
import { createMarginThemeOverrides } from '../utils/edgeInsets.js'
import {
  normalizeKeyboardAvoidingBehavior,
  readVirtualKeyboardHeight,
  resolveKeyboardAvoidanceHeight,
  resolveKeyboardAvoidingHeight,
  resolveKeyboardAvoidingInsets,
  type KeyboardAvoidingBehavior,
} from '../utils/keyboardAvoiding.js'
import type { HtmlStyle } from '../utils/styleMapping.js'
import { Div } from './Div.js'

/**
 * <KeyboardAvoidingView> — keeps content above the on-screen keyboard.
 */
export const KeyboardAvoidingView = defineComponent({
  name: 'KeyboardAvoidingView',
  props: {
    behavior: {
      type: String as () => KeyboardAvoidingBehavior,
      default: 'padding',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    keyboardVerticalOffset: {
      type: Number,
      default: 0,
    },
    fallbackKeyboardHeight: {
      type: Number,
      default: 0,
    },
    style: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
    contentStyle: {
      type: Object as () => HtmlStyle,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const backgroundTexture = useBackgroundTexture(
      () => props.style,
      'KeyboardAvoidingView',
    )

    return () => {
      const behavior = normalizeKeyboardAvoidingBehavior(props.behavior)
      const keyboardHeight = readVirtualKeyboardHeight(
        props.fallbackKeyboardHeight,
      )
      const avoidance = resolveKeyboardAvoidanceHeight(
        keyboardHeight,
        props.keyboardVerticalOffset,
        props.enabled !== false,
      )
      const nodeProps: Record<string, unknown> = {}
      applyCommonControlStyleProps(
        nodeProps,
        props.style,
        'KeyboardAvoidingView',
      )

      const adjustedHeight =
        behavior === 'height'
          ? resolveKeyboardAvoidingHeight(props.style, avoidance)
          : null
      if (adjustedHeight != null) {
        nodeProps['custom_minimum_size:y'] = adjustedHeight
        nodeProps['clip_contents'] = true
      }
      if (behavior === 'position' && avoidance > 0) {
        nodeProps['position:y'] = -avoidance
      }

      const includePaddingAvoidance =
        behavior === 'padding' ||
        (behavior === 'height' && adjustedHeight == null)
      const insets = resolveKeyboardAvoidingInsets(
        props.style,
        avoidance,
        includePaddingAvoidance,
      )
      const marginProps = createMarginThemeOverrides(insets)
      const content = h(
        Div,
        { style: props.contentStyle ?? {} },
        slots.default?.(),
      )
      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      const backgroundStyle = createBackgroundPanelStyle(props.style)
      let paddedContent = h('MarginContainer', marginProps, [content])

      if (backgroundStyle && backgroundTextureStyle) {
        paddedContent = h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          [paddedContent],
        )
      }

      if (!backgroundStyle && !backgroundTextureStyle) {
        return h('MarginContainer', { ...nodeProps, ...marginProps }, [content])
      }

      const panelProps: Record<string, unknown> = { ...nodeProps }
      panelProps['theme_override_styles/panel'] =
        backgroundStyle ?? backgroundTextureStyle

      return h('PanelContainer', panelProps, [paddedContent])
    }
  },
})
