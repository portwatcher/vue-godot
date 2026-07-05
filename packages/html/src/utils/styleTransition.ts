import type { VNode } from '@vue/runtime-core'
import {
  splitCssCommaSeparated,
  splitCssWhitespaceOutsideParens,
} from './cssParsing.js'
import { createOpacityModulate } from './godotColor.js'
import type {
  HtmlStyle,
  HtmlStyleInput,
  StyleAnimationDirection,
  StyleAnimationIterationCount,
  StyleTime,
  StyleTransitionProperty,
  StyleTransitionTimingFunction,
} from './styleMapping.js'
import { normalizeHtmlStyle, toNumericPixels } from './styleMapping.js'
import { resolveTransformStyle, type ResolvedTransform } from './transformStyle.js'
import type { GodotPropBag } from './controlStyle.js'

type VNodeHandler = (vnode: VNode) => void

interface GodotPropertyTweenerLike {
  set_delay?: (delay: number) => GodotPropertyTweenerLike
  set_trans?: (transition: number) => GodotPropertyTweenerLike
  set_ease?: (ease: number) => GodotPropertyTweenerLike
}

interface GodotTweenLike {
  kill?: () => void
  set_loops?: (loops?: number) => GodotTweenLike
  set_parallel?: (parallel?: boolean) => GodotTweenLike
  tween_property: (
    object: object,
    property: string,
    finalValue: unknown,
    duration: number,
  ) => GodotPropertyTweenerLike
}

interface TweenableGodotNode {
  create_tween?: () => GodotTweenLike
  set?: (property: string, value: unknown) => void
}

export interface ResolvedStyleTransition {
  property: StyleTransitionProperty
  duration: number
  delay: number
  timingFunction: StyleTransitionTimingFunction
  godotTransitionType: number
  godotEaseType: number
}

type TransitionableStyleProperty = Exclude<StyleTransitionProperty, 'all'>

interface TransitionTarget {
  styleProperty: TransitionableStyleProperty
  godotProperty: string
  value: unknown
}

export type StyleKeyframeStyle = Pick<
  HtmlStyle,
  'opacity' | 'transform' | 'width' | 'height'
>

export interface StyleKeyframe {
  offset: number
  style: StyleKeyframeStyle
}

interface NormalizedStyleKeyframe extends StyleKeyframe {
  targets: Map<string, unknown>
}

export interface ResolvedStyleAnimation {
  name: string
  duration: number
  delay: number
  timingFunction: StyleTransitionTimingFunction
  godotTransitionType: number
  godotEaseType: number
  iterationCount: StyleAnimationIterationCount
  direction: StyleAnimationDirection
  frames: NormalizedStyleKeyframe[]
  signature: string
}

const TweenTransition = {
  LINEAR: 0,
  SINE: 1,
} as const

const TweenEase = {
  IN: 0,
  OUT: 1,
  IN_OUT: 2,
} as const

const defaultTimingFunction: StyleTransitionTimingFunction = 'ease'
const transitionableStyleProperties = [
  'opacity',
  'transform',
  'width',
  'height',
] as const satisfies readonly TransitionableStyleProperty[]

const lastTargetsByNode = new WeakMap<object, Map<string, TransitionTarget>>()
const activeTweensByNode = new WeakMap<object, GodotTweenLike[]>()
const registeredStyleKeyframes = new Map<string, NormalizedStyleKeyframe[]>()
const activeAnimationsByNode = new WeakMap<
  object,
  { signature: string; tween: GodotTweenLike }
>()

function isTransitionableStyleProperty(
  value: string,
): value is TransitionableStyleProperty {
  return transitionableStyleProperties.includes(
    value as TransitionableStyleProperty,
  )
}

function isStyleTransitionProperty(
  value: string,
): value is StyleTransitionProperty {
  return value === 'all' || isTransitionableStyleProperty(value)
}

function parseTimingFunction(
  value: string | undefined,
): StyleTransitionTimingFunction | null {
  switch (value?.trim().toLowerCase()) {
    case 'linear':
      return 'linear'
    case 'ease':
      return 'ease'
    case 'ease-in':
      return 'ease-in'
    case 'ease-out':
      return 'ease-out'
    case 'ease-in-out':
      return 'ease-in-out'
    default:
      return null
  }
}

function timingToGodot(
  timingFunction: StyleTransitionTimingFunction,
): Pick<ResolvedStyleTransition, 'godotTransitionType' | 'godotEaseType'> {
  switch (timingFunction) {
    case 'linear':
      return {
        godotTransitionType: TweenTransition.LINEAR,
        godotEaseType: TweenEase.IN,
      }
    case 'ease-in':
      return {
        godotTransitionType: TweenTransition.SINE,
        godotEaseType: TweenEase.IN,
      }
    case 'ease-out':
      return {
        godotTransitionType: TweenTransition.SINE,
        godotEaseType: TweenEase.OUT,
      }
    case 'ease-in-out':
    case 'ease':
      return {
        godotTransitionType: TweenTransition.SINE,
        godotEaseType: TweenEase.IN_OUT,
      }
  }
}

function parseStyleTime(value: StyleTime | undefined): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, value)
  }

  if (typeof value !== 'string') {
    return null
  }

  const matched = value
    .trim()
    .toLowerCase()
    .match(/^(-?\d+(?:\.\d+)?)(ms|s)$/)
  if (!matched) {
    return null
  }

  const amount = Number(matched[1])
  if (!Number.isFinite(amount)) {
    return null
  }

  const seconds = matched[2] === 'ms' ? amount / 1000 : amount
  return Math.max(0, seconds)
}

function normalizeTransitionProperty(
  value: string,
): StyleTransitionProperty | null {
  const normalized = value.trim().toLowerCase()
  return isStyleTransitionProperty(normalized) ? normalized : null
}

function resolveTransition(
  property: StyleTransitionProperty,
  duration: number | null,
  delay: number | null,
  timingFunction: StyleTransitionTimingFunction | null,
): ResolvedStyleTransition | null {
  const resolvedDuration = duration ?? 0
  if (resolvedDuration <= 0) {
    return null
  }

  const resolvedTiming = timingFunction ?? defaultTimingFunction
  return {
    property,
    duration: resolvedDuration,
    delay: delay ?? 0,
    timingFunction: resolvedTiming,
    ...timingToGodot(resolvedTiming),
  }
}

function parseTransitionShorthandItem(
  value: string,
): ResolvedStyleTransition | null {
  const tokens = splitCssWhitespaceOutsideParens(value)
  let property: StyleTransitionProperty = 'all'
  let duration: number | null = null
  let delay: number | null = null
  let timingFunction: StyleTransitionTimingFunction | null = null

  for (const token of tokens) {
    const time = parseStyleTime(token)
    if (time != null) {
      if (duration == null) {
        duration = time
      } else if (delay == null) {
        delay = time
      }
      continue
    }

    const timing = parseTimingFunction(token)
    if (timing) {
      timingFunction = timing
      continue
    }

    const parsedProperty = normalizeTransitionProperty(token)
    if (parsedProperty) {
      property = parsedProperty
    }
  }

  return resolveTransition(property, duration, delay, timingFunction)
}

function parseTransitionShorthand(
  value: string | undefined,
): ResolvedStyleTransition[] {
  if (typeof value !== 'string' || value.trim() === '') {
    return []
  }

  return splitCssCommaSeparated(value)
    .map(parseTransitionShorthandItem)
    .filter((transition): transition is ResolvedStyleTransition =>
      Boolean(transition),
    )
}

function normalizeStringList(
  value: string | readonly string[] | undefined,
): string[] {
  if (value == null) {
    return []
  }

  if (isReadonlyStringArray(value)) {
    return value.flatMap((entry) => splitCssCommaSeparated(entry))
  }

  return splitCssCommaSeparated(value)
}

function normalizeTimeList(
  value: StyleTime | readonly StyleTime[] | undefined,
): StyleTime[] {
  if (value == null) {
    return []
  }

  if (isReadonlyStyleTimeArray(value)) {
    return [...value]
  }

  return typeof value === 'string' ? splitCssCommaSeparated(value) : [value]
}

function isReadonlyStringArray(
  value: string | readonly string[],
): value is readonly string[] {
  return Array.isArray(value)
}

function isReadonlyStyleTimeArray(
  value: StyleTime | readonly StyleTime[],
): value is readonly StyleTime[] {
  return Array.isArray(value)
}

function readCycled<T>(values: readonly T[], index: number): T | undefined {
  if (values.length === 0) {
    return undefined
  }
  return values[index] ?? values[values.length - 1]
}

function parseTransitionPropertyList(
  value: HtmlStyle['transitionProperty'],
): StyleTransitionProperty[] {
  const parsed = normalizeStringList(value)
    .map(normalizeTransitionProperty)
    .filter((property): property is StyleTransitionProperty => property != null)

  return parsed.length > 0 ? parsed : ['all']
}

function parseTransitionTimingList(
  value: HtmlStyle['transitionTimingFunction'],
): StyleTransitionTimingFunction[] {
  return normalizeStringList(value)
    .map(parseTimingFunction)
    .filter(
      (timingFunction): timingFunction is StyleTransitionTimingFunction =>
        timingFunction != null,
    )
}

function parseTransitionTimeList(
  value: StyleTime | readonly StyleTime[] | undefined,
): Array<number | null> {
  return normalizeTimeList(value).map(parseStyleTime)
}

function hasTransitionLonghands(style: HtmlStyle): boolean {
  return (
    style.transitionProperty != null ||
    style.transitionDuration != null ||
    style.transitionDelay != null ||
    style.transitionTimingFunction != null
  )
}

function hasTransitionDeclaration(style: HtmlStyle | undefined): boolean {
  return Boolean(
    style &&
      (style.transition != null ||
        style.transitionProperty != null ||
        style.transitionDuration != null ||
        style.transitionDelay != null ||
        style.transitionTimingFunction != null),
  )
}

export function resolveStyleTransitions(
  style: HtmlStyleInput,
): ResolvedStyleTransition[] {
  const normalizedStyle = normalizeHtmlStyle(style)
  if (!normalizedStyle) {
    return []
  }

  if (!hasTransitionLonghands(normalizedStyle)) {
    return parseTransitionShorthand(normalizedStyle.transition)
  }

  const properties = parseTransitionPropertyList(normalizedStyle.transitionProperty)
  const durations = parseTransitionTimeList(normalizedStyle.transitionDuration)
  const delays = parseTransitionTimeList(normalizedStyle.transitionDelay)
  const timingFunctions = parseTransitionTimingList(
    normalizedStyle.transitionTimingFunction,
  )

  return properties
    .map((property, index) =>
      resolveTransition(
        property,
        readCycled(durations, index) ?? null,
        readCycled(delays, index) ?? null,
        readCycled(timingFunctions, index) ?? null,
      ),
    )
    .filter((transition): transition is ResolvedStyleTransition =>
      Boolean(transition),
    )
}

function transitionMatchesProperty(
  transition: ResolvedStyleTransition,
  property: TransitionableStyleProperty,
): boolean {
  return transition.property === 'all' || transition.property === property
}

function hasTransitionForProperty(
  transitions: readonly ResolvedStyleTransition[],
  property: TransitionableStyleProperty,
): boolean {
  return transitions.some((transition) =>
    transitionMatchesProperty(transition, property),
  )
}

function readTransitionForProperty(
  transitions: readonly ResolvedStyleTransition[],
  property: TransitionableStyleProperty,
): ResolvedStyleTransition | null {
  return (
    transitions.find((transition) => transition.property === property) ??
    transitions.find((transition) => transition.property === 'all') ??
    null
  )
}

function createIdentityTransform(): ResolvedTransform {
  return {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  }
}

function addMotionTarget(
  targets: Map<string, unknown>,
  godotProperty: string,
  value: unknown,
): void {
  targets.set(godotProperty, value)
}

function resolveKeyframeTargets(style: StyleKeyframeStyle): Map<string, unknown> {
  const targets = new Map<string, unknown>()

  if (typeof style.opacity === 'number' && Number.isFinite(style.opacity)) {
    addMotionTarget(targets, 'modulate', createOpacityModulate(style.opacity))
  }

  if (typeof style.transform === 'string') {
    const transform = resolveTransformStyle(style.transform)
    if (transform) {
      addMotionTarget(targets, 'position:x', transform.translateX)
      addMotionTarget(targets, 'position:y', transform.translateY)
      addMotionTarget(targets, 'scale:x', transform.scaleX)
      addMotionTarget(targets, 'scale:y', transform.scaleY)
      addMotionTarget(targets, 'rotation', transform.rotation)
    }
  }

  const width = toNumericPixels(style.width)
  if (width != null) {
    addMotionTarget(targets, 'custom_minimum_size:x', width)
  }

  const height = toNumericPixels(style.height)
  if (height != null) {
    addMotionTarget(targets, 'custom_minimum_size:y', height)
  }

  return targets
}

function normalizeStyleKeyframes(
  frames: readonly StyleKeyframe[],
): NormalizedStyleKeyframe[] {
  return frames
    .filter((frame) => Number.isFinite(frame.offset))
    .map((frame) => ({
      offset: Math.max(0, Math.min(1, frame.offset)),
      style: frame.style,
      targets: resolveKeyframeTargets(frame.style),
    }))
    .filter((frame) => frame.targets.size > 0)
    .sort((left, right) => left.offset - right.offset)
}

export function registerStyleKeyframes(
  name: string,
  frames: readonly StyleKeyframe[],
): () => void {
  const normalizedName = name.trim()
  if (normalizedName.length === 0) {
    return () => {}
  }

  const normalizedFrames = normalizeStyleKeyframes(frames)
  if (normalizedFrames.length < 2) {
    registeredStyleKeyframes.delete(normalizedName)
  } else {
    registeredStyleKeyframes.set(normalizedName, normalizedFrames)
  }

  return () => unregisterStyleKeyframes(normalizedName)
}

export function unregisterStyleKeyframes(name: string): void {
  registeredStyleKeyframes.delete(name.trim())
}

export function clearStyleKeyframesForTests(): void {
  registeredStyleKeyframes.clear()
}

function addTarget(
  targets: TransitionTarget[],
  nodeProps: GodotPropBag,
  styleProperty: TransitionableStyleProperty,
  godotProperty: string,
  value: unknown,
): void {
  nodeProps[godotProperty] = value
  targets.push({ styleProperty, godotProperty, value })
}

export function resolveTransitionTargets(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): TransitionTarget[] {
  const normalizedStyle = normalizeHtmlStyle(style)
  const transitions = resolveStyleTransitions(normalizedStyle)
  if (transitions.length === 0) {
    return []
  }

  const targets: TransitionTarget[] = []

  if (hasTransitionForProperty(transitions, 'opacity')) {
    addTarget(
      targets,
      nodeProps,
      'opacity',
      'modulate',
      nodeProps.modulate ?? createOpacityModulate(normalizedStyle?.opacity ?? 1),
    )
  }

  if (hasTransitionForProperty(transitions, 'transform')) {
    const transform =
      resolveTransformStyle(normalizedStyle?.transform) ??
      createIdentityTransform()
    addTarget(
      targets,
      nodeProps,
      'transform',
      'position:x',
      transform.translateX,
    )
    addTarget(
      targets,
      nodeProps,
      'transform',
      'position:y',
      transform.translateY,
    )
    addTarget(targets, nodeProps, 'transform', 'scale:x', transform.scaleX)
    addTarget(targets, nodeProps, 'transform', 'scale:y', transform.scaleY)
    addTarget(targets, nodeProps, 'transform', 'rotation', transform.rotation)
  }

  if (
    hasTransitionForProperty(transitions, 'width') &&
    'custom_minimum_size:x' in nodeProps
  ) {
    targets.push({
      styleProperty: 'width',
      godotProperty: 'custom_minimum_size:x',
      value: nodeProps['custom_minimum_size:x'],
    })
  }

  if (
    hasTransitionForProperty(transitions, 'height') &&
    'custom_minimum_size:y' in nodeProps
  ) {
    targets.push({
      styleProperty: 'height',
      godotProperty: 'custom_minimum_size:y',
      value: nodeProps['custom_minimum_size:y'],
    })
  }

  return targets
}

function targetListToMap(targets: readonly TransitionTarget[]) {
  const mapped = new Map<string, TransitionTarget>()
  for (const target of targets) {
    mapped.set(target.godotProperty, target)
  }
  return mapped
}

function readVNodeHandler(value: unknown): VNodeHandler | null {
  return typeof value === 'function' ? (value as VNodeHandler) : null
}

function toTweenableNode(node: unknown): (object & TweenableGodotNode) | null {
  return typeof node === 'object' && node !== null
    ? (node as object & TweenableGodotNode)
    : null
}

function killActiveTweens(node: object): void {
  const activeTweens = activeTweensByNode.get(node)
  if (!activeTweens) {
    return
  }

  for (const tween of activeTweens) {
    tween.kill?.()
  }
  activeTweensByNode.delete(node)
}

function isColorLike(value: unknown): value is {
  r: number
  g: number
  b: number
  a: number
} {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.r === 'number' &&
    typeof record.g === 'number' &&
    typeof record.b === 'number' &&
    typeof record.a === 'number'
  )
}

function targetValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true
  }

  if (isColorLike(left) && isColorLike(right)) {
    return (
      Object.is(left.r, right.r) &&
      Object.is(left.g, right.g) &&
      Object.is(left.b, right.b) &&
      Object.is(left.a, right.a)
    )
  }

  return false
}

function applyTargetValue(
  node: object & TweenableGodotNode,
  property: string,
  value: unknown,
): void {
  if (node.set) {
    node.set(property, value)
    return
  }

  const record = node as Record<string, unknown>
  record[property] = value
}

function runTransitions(
  node: object & TweenableGodotNode,
  transitions: readonly ResolvedStyleTransition[],
  targets: readonly TransitionTarget[],
): void {
  const previousTargets = lastTargetsByNode.get(node)
  const nextTargets = targetListToMap(targets)
  lastTargetsByNode.set(node, nextTargets)

  if (!previousTargets || typeof node.create_tween !== 'function') {
    return
  }

  const changedTargets = targets.filter((target) => {
    const previous = previousTargets.get(target.godotProperty)
    return previous && !targetValuesEqual(previous.value, target.value)
  })

  if (changedTargets.length === 0) {
    return
  }

  killActiveTweens(node)
  const tween = node.create_tween()
  tween.set_parallel?.(true)

  for (const target of changedTargets) {
    const previous = previousTargets.get(target.godotProperty)
    const transition = readTransitionForProperty(
      transitions,
      target.styleProperty,
    )
    if (!previous || !transition) {
      continue
    }

    applyTargetValue(node, target.godotProperty, previous.value)
    const tweener = tween.tween_property(
      node,
      target.godotProperty,
      target.value,
      transition.duration,
    )
    tweener.set_delay?.(transition.delay)
    tweener.set_trans?.(transition.godotTransitionType)
    tweener.set_ease?.(transition.godotEaseType)
  }

  activeTweensByNode.set(node, [tween])
}

function forgetTransitionState(node: unknown): void {
  const tweenable = toTweenableNode(node)
  if (!tweenable) {
    return
  }

  killActiveTweens(tweenable)
  lastTargetsByNode.delete(tweenable)
}

function hasAnimationDeclaration(style: HtmlStyle | undefined): boolean {
  return Boolean(
    style &&
      (style.animationName != null ||
        style.animationDuration != null ||
        style.animationDelay != null ||
        style.animationTimingFunction != null ||
        style.animationIterationCount != null ||
        style.animationDirection != null),
  )
}

function normalizeAnimationIterationCount(
  value: StyleAnimationIterationCount | undefined,
): StyleAnimationIterationCount {
  if (value === 'infinite') {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.max(1, Math.floor(value))
  }

  return 1
}

function normalizeAnimationDirection(
  value: StyleAnimationDirection | undefined,
): StyleAnimationDirection {
  return value === 'reverse' ? 'reverse' : 'normal'
}

function createAnimationSignature(
  name: string,
  duration: number,
  delay: number,
  timingFunction: StyleTransitionTimingFunction,
  iterationCount: StyleAnimationIterationCount,
  direction: StyleAnimationDirection,
  frames: readonly NormalizedStyleKeyframe[],
): string {
  return JSON.stringify({
    name,
    duration,
    delay,
    timingFunction,
    iterationCount,
    direction,
    frames: frames.map((frame) => ({
      offset: frame.offset,
      opacity: frame.style.opacity ?? null,
      transform: frame.style.transform ?? null,
      width: frame.style.width ?? null,
      height: frame.style.height ?? null,
    })),
  })
}

export function resolveStyleAnimation(
  style: HtmlStyleInput,
): ResolvedStyleAnimation | null {
  const normalizedStyle = normalizeHtmlStyle(style)
  if (!normalizedStyle) {
    return null
  }

  const name = normalizedStyle.animationName?.trim()
  if (!name || name === 'none') {
    return null
  }

  const frames = registeredStyleKeyframes.get(name)
  const duration = parseStyleTime(normalizedStyle.animationDuration)
  if (!frames || frames.length < 2 || duration == null || duration <= 0) {
    return null
  }

  const timingFunction =
    parseTimingFunction(normalizedStyle.animationTimingFunction) ??
    defaultTimingFunction
  const delay = parseStyleTime(normalizedStyle.animationDelay) ?? 0
  const iterationCount = normalizeAnimationIterationCount(
    normalizedStyle.animationIterationCount,
  )
  const direction = normalizeAnimationDirection(normalizedStyle.animationDirection)

  return {
    name,
    duration,
    delay,
    timingFunction,
    iterationCount,
    direction,
    frames,
    signature: createAnimationSignature(
      name,
      duration,
      delay,
      timingFunction,
      iterationCount,
      direction,
      frames,
    ),
    ...timingToGodot(timingFunction),
  }
}

function orderedAnimationFrames(
  animation: ResolvedStyleAnimation,
): NormalizedStyleKeyframe[] {
  return animation.direction === 'reverse'
    ? [...animation.frames].reverse()
    : [...animation.frames]
}

function killActiveAnimation(node: object): void {
  const active = activeAnimationsByNode.get(node)
  if (!active) {
    return
  }

  active.tween.kill?.()
  activeAnimationsByNode.delete(node)
}

function applyAnimationFrameTargets(
  node: object & TweenableGodotNode,
  frame: NormalizedStyleKeyframe,
): void {
  for (const [property, value] of frame.targets) {
    applyTargetValue(node, property, value)
  }
}

function runAnimation(
  node: object & TweenableGodotNode,
  animation: ResolvedStyleAnimation,
): void {
  const active = activeAnimationsByNode.get(node)
  if (active?.signature === animation.signature) {
    return
  }

  killActiveAnimation(node)

  const frames = orderedAnimationFrames(animation)
  const firstFrame = frames[0]
  if (!firstFrame) {
    return
  }

  applyAnimationFrameTargets(node, firstFrame)

  if (typeof node.create_tween !== 'function') {
    return
  }

  const tween = node.create_tween()
  tween.set_parallel?.(true)
  if (
    typeof animation.iterationCount === 'number' &&
    animation.iterationCount > 1
  ) {
    tween.set_loops?.(animation.iterationCount)
  } else if (animation.iterationCount === 'infinite') {
    tween.set_loops?.()
  }

  let elapsed = animation.delay
  for (let index = 1; index < frames.length; index += 1) {
    const previous = frames[index - 1]
    const next = frames[index]
    const segmentDuration =
      Math.abs(next.offset - previous.offset) * animation.duration

    if (segmentDuration <= 0) {
      continue
    }

    for (const [property, value] of next.targets) {
      const tweener = tween.tween_property(
        node,
        property,
        value,
        segmentDuration,
      )
      tweener.set_delay?.(elapsed)
      tweener.set_trans?.(animation.godotTransitionType)
      tweener.set_ease?.(animation.godotEaseType)
    }

    elapsed += segmentDuration
  }

  activeAnimationsByNode.set(node, {
    signature: animation.signature,
    tween,
  })
}

function forgetAnimationState(node: unknown): void {
  const tweenable = toTweenableNode(node)
  if (!tweenable) {
    return
  }

  killActiveAnimation(tweenable)
}

function applyAnimationCleanupProps(nodeProps: GodotPropBag): void {
  const previousUpdated = readVNodeHandler(nodeProps['onVnodeUpdated'])
  const previousBeforeUnmount = readVNodeHandler(
    nodeProps['onVnodeBeforeUnmount'],
  )

  nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
    previousUpdated?.(vnode)
    forgetAnimationState(vnode.el)
  }

  nodeProps['onVnodeBeforeUnmount'] = (vnode: VNode) => {
    previousBeforeUnmount?.(vnode)
    forgetAnimationState(vnode.el)
  }
}

export function applyAnimationStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  const animation = resolveStyleAnimation(normalizedStyle)
  if (!animation) {
    if (hasAnimationDeclaration(normalizedStyle)) {
      applyAnimationCleanupProps(nodeProps)
    }
    return
  }

  const previousMounted = readVNodeHandler(nodeProps['onVnodeMounted'])
  const previousUpdated = readVNodeHandler(nodeProps['onVnodeUpdated'])
  const previousBeforeUnmount = readVNodeHandler(
    nodeProps['onVnodeBeforeUnmount'],
  )

  nodeProps['onVnodeMounted'] = (vnode: VNode) => {
    previousMounted?.(vnode)
    const node = toTweenableNode(vnode.el)
    if (node) {
      runAnimation(node, animation)
    }
  }

  nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
    previousUpdated?.(vnode)
    const node = toTweenableNode(vnode.el)
    if (node) {
      runAnimation(node, animation)
    }
  }

  nodeProps['onVnodeBeforeUnmount'] = (vnode: VNode) => {
    previousBeforeUnmount?.(vnode)
    forgetAnimationState(vnode.el)
  }
}

function applyTransitionCleanupProps(nodeProps: GodotPropBag): void {
  const previousUpdated = readVNodeHandler(nodeProps['onVnodeUpdated'])
  const previousBeforeUnmount = readVNodeHandler(
    nodeProps['onVnodeBeforeUnmount'],
  )

  nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
    previousUpdated?.(vnode)
    forgetTransitionState(vnode.el)
  }

  nodeProps['onVnodeBeforeUnmount'] = (vnode: VNode) => {
    previousBeforeUnmount?.(vnode)
    forgetTransitionState(vnode.el)
  }
}

export function applyTransitionStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): void {
  const normalizedStyle = normalizeHtmlStyle(style)
  const transitions = resolveStyleTransitions(normalizedStyle)
  if (transitions.length === 0) {
    if (hasTransitionDeclaration(normalizedStyle)) {
      applyTransitionCleanupProps(nodeProps)
    }
    return
  }

  const targets = resolveTransitionTargets(nodeProps, normalizedStyle)
  if (targets.length === 0) {
    if (hasTransitionDeclaration(normalizedStyle)) {
      applyTransitionCleanupProps(nodeProps)
    }
    return
  }

  const previousMounted = readVNodeHandler(nodeProps['onVnodeMounted'])
  const previousUpdated = readVNodeHandler(nodeProps['onVnodeUpdated'])
  const previousBeforeUnmount = readVNodeHandler(
    nodeProps['onVnodeBeforeUnmount'],
  )

  nodeProps['onVnodeMounted'] = (vnode: VNode) => {
    previousMounted?.(vnode)
    const node = toTweenableNode(vnode.el)
    if (node) {
      lastTargetsByNode.set(node, targetListToMap(targets))
    }
  }

  nodeProps['onVnodeUpdated'] = (vnode: VNode) => {
    previousUpdated?.(vnode)
    const node = toTweenableNode(vnode.el)
    if (node) {
      runTransitions(node, transitions, targets)
    }
  }

  nodeProps['onVnodeBeforeUnmount'] = (vnode: VNode) => {
    previousBeforeUnmount?.(vnode)
    forgetTransitionState(vnode.el)
  }
}

export function applyMotionStyleProps(
  nodeProps: GodotPropBag,
  style: HtmlStyleInput,
): void {
  applyTransitionStyleProps(nodeProps, style)
  applyAnimationStyleProps(nodeProps, style)
}
