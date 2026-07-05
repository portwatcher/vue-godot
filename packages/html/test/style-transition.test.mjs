import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { applyCommonControlStyleProps } = await import(
  '../dist/utils/controlStyle.js'
)
const {
  applyMotionStyleProps,
  clearStyleKeyframesForTests,
  registerStyleKeyframes,
  resolveStyleAnimation,
  resolveStyleTransitions,
  resolveTransitionTargets,
} = await import('../dist/utils/styleTransition.js')

function createTweenNode() {
  return {
    setCalls: [],
    tweens: [],
    set(property, value) {
      this.setCalls.push({ property, value })
      this[property] = value
    },
    create_tween() {
      const tween = {
        killed: false,
        loops: null,
        parallel: false,
        calls: [],
        set_loops(loops = 0) {
          this.loops = loops
          return this
        },
        set_parallel(parallel = true) {
          this.parallel = parallel
          return this
        },
        tween_property(object, property, finalValue, duration) {
          const call = {
            object,
            property,
            finalValue,
            duration,
            delay: null,
            trans: null,
            ease: null,
          }
          this.calls.push(call)
          return {
            set_delay(delay) {
              call.delay = delay
              return this
            },
            set_trans(trans) {
              call.trans = trans
              return this
            },
            set_ease(ease) {
              call.ease = ease
              return this
            },
          }
        },
        kill() {
          this.killed = true
        },
      }
      this.tweens.push(tween)
      return tween
    },
  }
}

test('resolves CSS transition shorthand and longhands', () => {
  assert.deepEqual(
    resolveStyleTransitions({
      transition: 'opacity 150ms ease-out, transform 0.2s ease-in 50ms',
    }),
    [
      {
        property: 'opacity',
        duration: 0.15,
        delay: 0,
        timingFunction: 'ease-out',
        godotTransitionType: 1,
        godotEaseType: 1,
      },
      {
        property: 'transform',
        duration: 0.2,
        delay: 0.05,
        timingFunction: 'ease-in',
        godotTransitionType: 1,
        godotEaseType: 0,
      },
    ],
  )

  assert.deepEqual(
    resolveStyleTransitions({
      transitionProperty: 'opacity, width',
      transitionDuration: ['100ms', '0.3s'],
      transitionTimingFunction: 'linear',
    }).map((transition) => ({
      property: transition.property,
      duration: transition.duration,
      timingFunction: transition.timingFunction,
      godotTransitionType: transition.godotTransitionType,
    })),
    [
      {
        property: 'opacity',
        duration: 0.1,
        timingFunction: 'linear',
        godotTransitionType: 0,
      },
      {
        property: 'width',
        duration: 0.3,
        timingFunction: 'linear',
        godotTransitionType: 0,
      },
    ],
  )
})

test('transition targets add explicit opacity and transform end-state props', () => {
  const props = {}

  applyCommonControlStyleProps(
    props,
    {
      opacity: 0.4,
      transform: 'translateX(10px)',
      transition: 'opacity 100ms, transform 200ms',
    },
    'TransitionBox',
  )

  assert.equal(props.modulate.__kind, 'color')
  assert.equal(props.modulate.a, 0.4)
  assert.equal(props['position:x'], 10)
  assert.equal(props['position:y'], 0)
  assert.equal(props['scale:x'], 1)
  assert.equal(props['scale:y'], 1)
  assert.equal(props.rotation, 0)
  assert.equal(typeof props.onVnodeMounted, 'function')
  assert.equal(typeof props.onVnodeUpdated, 'function')

  assert.deepEqual(
    resolveTransitionTargets(props, {
      opacity: 0.4,
      transform: 'translateX(10px)',
      transition: 'opacity 100ms, transform 200ms',
    }).map((target) => [target.styleProperty, target.godotProperty]),
    [
      ['opacity', 'modulate'],
      ['transform', 'position:x'],
      ['transform', 'position:y'],
      ['transform', 'scale:x'],
      ['transform', 'scale:y'],
      ['transform', 'rotation'],
    ],
  )
})

test('transition hooks tween changed Godot properties from previous targets', () => {
  const node = createTweenNode()
  const initialProps = {}
  const updatedProps = {}

  applyCommonControlStyleProps(
    initialProps,
    {
      opacity: 0.2,
      transform: 'translateX(2px)',
      transition: 'opacity 100ms ease-out, transform 200ms linear 50ms',
    },
    'TransitionBox',
  )
  initialProps.onVnodeMounted({ el: node })

  applyCommonControlStyleProps(
    updatedProps,
    {
      opacity: 0.8,
      transform: 'translateX(10px) scale(2)',
      transition: 'opacity 100ms ease-out, transform 200ms linear 50ms',
    },
    'TransitionBox',
  )
  updatedProps.onVnodeUpdated({ el: node })

  assert.equal(node.tweens.length, 1)
  assert.equal(node.tweens[0].parallel, true)
  assert.equal(node.setCalls[0].property, 'modulate')
  assert.equal(node.setCalls[0].value.a, 0.2)
  assert.deepEqual(
    node.tweens[0].calls.map((call) => ({
      property: call.property,
      duration: call.duration,
      delay: call.delay,
      trans: call.trans,
      ease: call.ease,
    })),
    [
      {
        property: 'modulate',
        duration: 0.1,
        delay: 0,
        trans: 1,
        ease: 1,
      },
      {
        property: 'position:x',
        duration: 0.2,
        delay: 0.05,
        trans: 0,
        ease: 0,
      },
      {
        property: 'scale:x',
        duration: 0.2,
        delay: 0.05,
        trans: 0,
        ease: 0,
      },
      {
        property: 'scale:y',
        duration: 0.2,
        delay: 0.05,
        trans: 0,
        ease: 0,
      },
    ],
  )
})

test('transition hooks chain existing VNode handlers and kill active tweens', () => {
  const events = []
  const node = createTweenNode()
  const chainedProps = {
    onVnodeMounted() {
      events.push('mounted')
    },
    onVnodeUpdated() {
      events.push('updated')
    },
    onVnodeBeforeUnmount() {
      events.push('before-unmount')
    },
  }

  applyCommonControlStyleProps(
    chainedProps,
    {
      opacity: 0.1,
      transition: 'opacity 100ms',
    },
    'TransitionBox',
  )
  chainedProps.onVnodeMounted({ el: node })
  chainedProps.onVnodeUpdated({ el: node })
  chainedProps.onVnodeBeforeUnmount({ el: node })

  assert.deepEqual(events, ['mounted', 'updated', 'before-unmount'])

  const initialProps = {}
  const updatedProps = {}
  applyCommonControlStyleProps(
    initialProps,
    {
      opacity: 0.1,
      transition: 'opacity 100ms',
    },
    'TransitionBox',
  )
  initialProps.onVnodeMounted({ el: node })
  applyCommonControlStyleProps(
    updatedProps,
    {
      opacity: 0.9,
      transition: 'opacity 100ms',
    },
    'TransitionBox',
  )
  updatedProps.onVnodeUpdated({ el: node })

  const cleanupProps = {
    onVnodeUpdated() {
      events.push('cleanup-updated')
    },
  }
  applyCommonControlStyleProps(
    cleanupProps,
    {
      opacity: 0.9,
      transition: 'none',
    },
    'TransitionBox',
  )
  cleanupProps.onVnodeUpdated({ el: node })

  assert.equal(events.at(-1), 'cleanup-updated')
  assert.equal(node.tweens.length, 1)
  assert.equal(node.tweens[0].killed, true)
})

test('registers and resolves style keyframe animations', () => {
  clearStyleKeyframesForTests()

  const unregister = registerStyleKeyframes('pulse', [
    {
      offset: 0,
      style: { opacity: 0.5, transform: 'scale(1)' },
    },
    {
      offset: 1,
      style: { opacity: 1, transform: 'scale(1.1)' },
    },
  ])

  const animation = resolveStyleAnimation({
    animationName: 'pulse',
    animationDuration: '400ms',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 2,
  })

  assert.equal(animation?.name, 'pulse')
  assert.equal(animation?.duration, 0.4)
  assert.equal(animation?.delay, 0)
  assert.equal(animation?.timingFunction, 'ease-out')
  assert.equal(animation?.iterationCount, 2)
  assert.equal(animation?.direction, 'normal')
  assert.equal(animation?.frames.length, 2)
  assert.equal(animation?.frames[0].offset, 0)
  assert.equal(animation?.frames[1].targets.get('modulate').a, 1)

  unregister()
  assert.equal(
    resolveStyleAnimation({
      animationName: 'pulse',
      animationDuration: '400ms',
    }),
    null,
  )
})

test('animation hooks tween registered keyframes on mount', () => {
  clearStyleKeyframesForTests()
  registerStyleKeyframes('pulse', [
    {
      offset: 0,
      style: { opacity: 0.5, transform: 'scale(1)' },
    },
    {
      offset: 1,
      style: { opacity: 1, transform: 'scale(1.1)' },
    },
  ])

  const node = createTweenNode()
  const props = {}
  applyMotionStyleProps(props, {
    animationName: 'pulse',
    animationDuration: '400ms',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 2,
  })

  props.onVnodeMounted({ el: node })

  assert.equal(node.tweens.length, 1)
  assert.equal(node.tweens[0].parallel, true)
  assert.equal(node.tweens[0].loops, 2)
  assert.deepEqual(
    node.setCalls.map((call) => [call.property, call.value.a ?? call.value]),
    [
      ['modulate', 0.5],
      ['position:x', 0],
      ['position:y', 0],
      ['scale:x', 1],
      ['scale:y', 1],
      ['rotation', 0],
    ],
  )
  assert.deepEqual(
    node.tweens[0].calls
      .filter((call) =>
        ['modulate', 'scale:x', 'scale:y'].includes(call.property),
      )
      .map((call) => ({
        property: call.property,
        duration: call.duration,
        delay: call.delay,
        trans: call.trans,
        ease: call.ease,
      })),
    [
      {
        property: 'modulate',
        duration: 0.4,
        delay: 0,
        trans: 1,
        ease: 1,
      },
      {
        property: 'scale:x',
        duration: 0.4,
        delay: 0,
        trans: 1,
        ease: 1,
      },
      {
        property: 'scale:y',
        duration: 0.4,
        delay: 0,
        trans: 1,
        ease: 1,
      },
    ],
  )
})

test('animation hooks avoid duplicate restarts and clean up active tweens', () => {
  clearStyleKeyframesForTests()
  registerStyleKeyframes('pulse', [
    { offset: 0, style: { opacity: 0.2 } },
    { offset: 1, style: { opacity: 0.8 } },
  ])

  const node = createTweenNode()
  const style = {
    animationName: 'pulse',
    animationDuration: '300ms',
    animationIterationCount: 'infinite',
  }
  const props = {}
  applyMotionStyleProps(props, style)
  props.onVnodeMounted({ el: node })
  props.onVnodeUpdated({ el: node })

  assert.equal(node.tweens.length, 1)
  assert.equal(node.tweens[0].loops, 0)

  const changedProps = {}
  applyMotionStyleProps(changedProps, {
    ...style,
    animationDuration: '600ms',
  })
  changedProps.onVnodeUpdated({ el: node })

  assert.equal(node.tweens.length, 2)
  assert.equal(node.tweens[0].killed, true)

  const cleanupProps = {}
  applyMotionStyleProps(cleanupProps, {
    animationName: 'none',
  })
  cleanupProps.onVnodeUpdated({ el: node })

  assert.equal(node.tweens[1].killed, true)
})
