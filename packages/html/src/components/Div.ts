import {
  Fragment,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
} from '@vue/runtime-core'
import type {
  VNodeArrayChildren,
  VNodeChild,
  VNodeNormalizedChildren,
} from '@vue/runtime-core'
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
import { applyTransformStyleProps } from '../utils/controlStyle.js'
import type { GodotContainerTag, HtmlStyle } from '../utils/styleMapping.js'
import {
  ControlSizeFlags,
  resolveContainerTag,
  resolveMargin,
  resolvePadding,
  warnUnsupportedStyleProps,
} from '../utils/styleMapping.js'

type LayoutAxis = 'horizontal' | 'vertical'

function containerAxes(tag: GodotContainerTag): {
  main?: LayoutAxis
  cross?: LayoutAxis
} {
  if (tag === 'HBoxContainer' || tag === 'HFlowContainer') {
    return { main: 'horizontal', cross: 'vertical' }
  }
  if (tag === 'VBoxContainer' || tag === 'VFlowContainer') {
    return { main: 'vertical', cross: 'horizontal' }
  }
  if (tag === 'GridContainer') {
    return { main: 'horizontal', cross: 'vertical' }
  }
  return {}
}

function alignSelfToSizeFlag(alignSelf: HtmlStyle['alignSelf']): number | null {
  if (alignSelf === 'center') {
    return ControlSizeFlags.SHRINK_CENTER
  }
  if (alignSelf === 'flex-end') {
    return ControlSizeFlags.SHRINK_END
  }
  if (alignSelf === 'flex-start') {
    return ControlSizeFlags.SHRINK_BEGIN
  }
  if (alignSelf === 'stretch') {
    return ControlSizeFlags.FILL
  }
  return null
}

function axisPropName(
  axis: LayoutAxis,
): 'size_flags_horizontal' | 'size_flags_vertical' {
  return axis === 'horizontal' ? 'size_flags_horizontal' : 'size_flags_vertical'
}

function resolveChildLayoutProps(
  childStyle: HtmlStyle | undefined,
  containerTag: GodotContainerTag,
  defaultAlignSelf: HtmlStyle['alignSelf'] | undefined,
  existingProps: Record<string, unknown> | null,
): Record<string, unknown> {
  const alignValue = childStyle?.alignSelf ?? defaultAlignSelf
  const hasFlex =
    typeof childStyle?.flex === 'number' &&
    Number.isFinite(childStyle.flex) &&
    childStyle.flex > 0

  if (!hasFlex && alignValue == null) {
    return {}
  }

  const resolved: Record<string, unknown> = {}
  const axes = containerAxes(containerTag)

  if (hasFlex && axes.main) {
    const axis = axisPropName(axes.main)
    if (!existingProps || !(axis in existingProps)) {
      resolved[axis] = ControlSizeFlags.EXPAND_FILL
    }
    if (!existingProps || !('size_flags_stretch_ratio' in existingProps)) {
      resolved['size_flags_stretch_ratio'] = childStyle!.flex
    }
  }

  const alignSelfFlag = alignSelfToSizeFlag(alignValue)
  if (alignSelfFlag != null && axes.cross) {
    const axis = axisPropName(axes.cross)
    if (!existingProps || !(axis in existingProps)) {
      resolved[axis] = alignSelfFlag
    }
  }

  return resolved
}

function toChildArray(children: VNodeNormalizedChildren): VNodeArrayChildren {
  if (Array.isArray(children)) {
    return children
  }
  if (typeof children === 'string') {
    return [children]
  }
  return []
}

function mapChildForContainerLayout(
  child: VNodeChild,
  containerTag: GodotContainerTag,
  defaultAlignSelf: HtmlStyle['alignSelf'] | undefined,
): VNodeArrayChildren {
  if (Array.isArray(child)) {
    return child.flatMap((entry) =>
      mapChildForContainerLayout(entry, containerTag, defaultAlignSelf),
    )
  }

  if (!isVNode(child)) {
    return [child]
  }

  if (child.type === Fragment) {
    const mappedFragmentChildren = mapChildrenForContainerLayout(
      toChildArray(child.children),
      containerTag,
      defaultAlignSelf,
    )
    const fragmentProps =
      child.key != null
        ? { ...(child.props ?? {}), key: child.key }
        : (child.props ?? undefined)

    return [h(Fragment, fragmentProps, mappedFragmentChildren)]
  }

  const existingProps = (child.props ?? null) as Record<string, unknown> | null
  const childStyle =
    existingProps &&
    typeof existingProps.style === 'object' &&
    !Array.isArray(existingProps.style)
      ? (existingProps.style as HtmlStyle)
      : undefined
  const layoutProps = resolveChildLayoutProps(
    childStyle,
    containerTag,
    defaultAlignSelf,
    existingProps,
  )

  if (Object.keys(layoutProps).length === 0) {
    return [child]
  }

  return [cloneVNode(child, layoutProps)]
}

function mapChildrenForContainerLayout(
  children: VNodeArrayChildren | undefined,
  containerTag: GodotContainerTag,
  defaultAlignSelf: HtmlStyle['alignSelf'] | undefined,
): VNodeArrayChildren | undefined {
  return children?.flatMap((child) =>
    mapChildForContainerLayout(child, containerTag, defaultAlignSelf),
  )
}

function withThemeConstantOverrides(
  baseProps: Record<string, unknown>,
  overrides: Record<string, number>,
): Record<string, unknown> {
  const props = { ...baseProps }
  for (const name in overrides) {
    props[`theme_override_constants/${name}`] = overrides[name]
  }
  return props
}

/**
 * <Div> — the general-purpose layout container.
 *
 * Maps to a Godot container node based on the style prop:
 *   flex-direction: row    → HBoxContainer
 *   flex-direction: column → VBoxContainer
 *   flex-wrap: wrap        → HFlowContainer / VFlowContainer
 *   display: grid          → GridContainer
 *   (default)              → VBoxContainer
 *
 * Usage:
 *   <Div :style="{ flexDirection: 'row', gap: 10 }">
 *     <Div :style="{ flex: 1 }">Left</Div>
 *     <Div :style="{ flex: 2 }">Right</Div>
 *   </Div>
 */
export const Div = defineComponent({
  name: 'Div',
  props: {
    ...accessibilityPropOptions,
    style: {
      type: Object as () => HtmlStyle,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const backgroundTexture = useBackgroundTexture(() => props.style, 'Div')

    return () => {
      const style = props.style ?? {}
      warnUnsupportedStyleProps(style, 'Div')
      const {
        tag,
        themeOverrides,
        props: godotProps,
      } = resolveContainerTag(style)
      applyAccessibilityProps(godotProps, props)
      applyTransformStyleProps(godotProps, style)
      const slotChildren = slots.default?.()
      const childrenWithLayout = mapChildrenForContainerLayout(
        slotChildren,
        tag,
        style.alignItems,
      )
      let content = h(
        tag,
        withThemeConstantOverrides(godotProps, themeOverrides),
        childrenWithLayout,
      )

      if (style.display === 'none') {
        return content
      }

      const padding = resolvePadding(style)
      if (padding) {
        const marginOverrides = {
          margin_top: padding.top,
          margin_right: padding.right,
          margin_bottom: padding.bottom,
          margin_left: padding.left,
        }

        content = h(
          'MarginContainer',
          withThemeConstantOverrides({}, marginOverrides),
          [content],
        )
      }

      const backgroundTextureStyle = createBackgroundTexturePanelStyle(
        backgroundTexture.value,
      )
      if (backgroundTextureStyle) {
        content = h(
          'PanelContainer',
          createBackgroundTexturePanelProps(backgroundTextureStyle),
          [content],
        )
      }

      const backgroundStyle = createBackgroundPanelStyle(style)
      if (backgroundStyle) {
        content = h(
          'PanelContainer',
          { 'theme_override_styles/panel': backgroundStyle },
          [content],
        )
      }

      const margin = resolveMargin(style)
      if (!margin) {
        return content
      }

      const marginOverrides = {
        margin_top: margin.top,
        margin_right: margin.right,
        margin_bottom: margin.bottom,
        margin_left: margin.left,
      }

      return h(
        'MarginContainer',
        withThemeConstantOverrides({}, marginOverrides),
        [content],
      )
    }
  },
})
