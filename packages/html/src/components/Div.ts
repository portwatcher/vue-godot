import {
  Fragment,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
} from '@vue/runtime-core'
import type {
  VNode,
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
import {
  applyTransformStyleProps,
  applyMotionStyleProps,
} from '../utils/controlStyle.js'
import type {
  GodotContainerTag,
  HtmlStyle,
  HtmlStyleInput,
} from '../utils/styleMapping.js'
import { htmlStyleProp } from '../utils/styleProps.js'
import {
  resolveHtmlComponentStyle,
  useHtmlComponentStyleResolver,
  useHtmlStyleContext,
  type HtmlStyleContext,
} from '../utils/styleResolver.js'
import {
  ControlSizeFlags,
  normalizeHtmlStyle,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function resolveVNodeHtmlComponentName(child: VNode): string | null {
  return isRecord(child.type) && typeof child.type['name'] === 'string'
    ? child.type['name']
    : null
}

function resolveChildStyleForLayout(
  child: VNode,
  existingProps: Record<string, unknown> | null,
  styleContext: HtmlStyleContext,
): HtmlStyle | undefined {
  if (!existingProps) {
    return undefined
  }

  const componentName = resolveVNodeHtmlComponentName(child)
  if (!componentName) {
    return normalizeHtmlStyle(existingProps.style as HtmlStyleInput)
  }

  return resolveHtmlComponentStyle(styleContext, {
    componentName,
    class: existingProps['class'],
    className: existingProps['className'],
    inlineStyle: existingProps.style as HtmlStyleInput,
  }).style
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
  styleContext: HtmlStyleContext,
): VNodeArrayChildren {
  if (Array.isArray(child)) {
    return child.flatMap((entry) =>
      mapChildForContainerLayout(
        entry,
        containerTag,
        defaultAlignSelf,
        styleContext,
      ),
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
      styleContext,
    )
    const fragmentProps =
      child.key != null
        ? { ...(child.props ?? {}), key: child.key }
        : (child.props ?? undefined)

    return [h(Fragment, fragmentProps, mappedFragmentChildren)]
  }

  const existingProps = (child.props ?? null) as Record<string, unknown> | null
  const childStyle = resolveChildStyleForLayout(
    child,
    existingProps,
    styleContext,
  )
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
  styleContext: HtmlStyleContext,
): VNodeArrayChildren | undefined {
  return children?.flatMap((child) =>
    mapChildForContainerLayout(
      child,
      containerTag,
      defaultAlignSelf,
      styleContext,
    ),
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

function withRootProps(
  vnode: VNode,
  rootProps: Record<string, unknown>,
): VNode {
  return Object.keys(rootProps).length === 0
    ? vnode
    : cloneVNode(vnode, rootProps)
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
    style: htmlStyleProp,
  },
  setup(props, { attrs, slots }) {
    const styleContext = useHtmlStyleContext()
    const resolveStyle = useHtmlComponentStyleResolver('Div', attrs)
    const backgroundTexture = useBackgroundTexture(
      () => resolveStyle(props.style).style,
      'Div',
    )

    return () => {
      const style = resolveStyle(props.style).style ?? {}
      warnUnsupportedStyleProps(style, 'Div')
      const {
        tag,
        themeOverrides,
        props: godotProps,
      } = resolveContainerTag(style)
      const rootProps: Record<string, unknown> = {}
      applyAccessibilityProps(rootProps, props)
      applyTransformStyleProps(rootProps, style)
      applyMotionStyleProps(rootProps, style)
      const slotChildren = slots.default?.()
      const childrenWithLayout = mapChildrenForContainerLayout(
        slotChildren,
        tag,
        style.alignItems,
        styleContext,
      )
      let content = h(
        tag,
        withThemeConstantOverrides(godotProps, themeOverrides),
        childrenWithLayout,
      )

      if (style.display === 'none') {
        return withRootProps(content, rootProps)
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
        return withRootProps(content, rootProps)
      }

      const marginOverrides = {
        margin_top: margin.top,
        margin_right: margin.right,
        margin_bottom: margin.bottom,
        margin_left: margin.left,
      }

      return withRootProps(
        h(
          'MarginContainer',
          withThemeConstantOverrides({}, marginOverrides),
          [content],
        ),
        rootProps,
      )
    }
  },
})
