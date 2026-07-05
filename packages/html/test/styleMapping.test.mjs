import assert from 'node:assert/strict'
import test from 'node:test'

import {
  clearUnsupportedStyleWarningsForTests,
  getUnsupportedStyleKeys,
  resolveBorderRadii,
  resolveBorderWidths,
  resolveContainerTag,
  resolveMargin,
  resolvePadding,
  supportedHtmlStyleKeys,
  warnUnsupportedStyleProps,
} from '../dist/utils/styleMapping.js'

test('maps gap to separation for non-wrapping row and column containers', () => {
  const row = resolveContainerTag({ gap: 12, flexDirection: 'row' })
  const column = resolveContainerTag({ gap: 8, flexDirection: 'column' })

  assert.equal(row.tag, 'HBoxContainer')
  assert.deepEqual(row.themeOverrides, { separation: 12 })

  assert.equal(column.tag, 'VBoxContainer')
  assert.deepEqual(column.themeOverrides, { separation: 8 })
})

test('maps gap to h/v separation for wrapping containers', () => {
  const rowWrap = resolveContainerTag({
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  })
  const columnWrap = resolveContainerTag({
    gap: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
  })

  assert.equal(rowWrap.tag, 'HFlowContainer')
  assert.deepEqual(rowWrap.themeOverrides, {
    h_separation: 10,
    v_separation: 10,
  })

  assert.equal(columnWrap.tag, 'VFlowContainer')
  assert.deepEqual(columnWrap.themeOverrides, {
    h_separation: 10,
    v_separation: 10,
  })
})

test('maps gap to h/v separation for grid containers', () => {
  const grid = resolveContainerTag({ display: 'grid', gap: 6 })

  assert.equal(grid.tag, 'GridContainer')
  assert.deepEqual(grid.themeOverrides, {
    h_separation: 6,
    v_separation: 6,
  })
})

test('maps columns to GridContainer columns prop', () => {
  const grid = resolveContainerTag({ display: 'grid', columns: 3, gap: 4 })

  assert.equal(grid.tag, 'GridContainer')
  assert.equal(grid.props.columns, 3)
  assert.deepEqual(grid.themeOverrides, {
    h_separation: 4,
    v_separation: 4,
  })
})

test('omits columns prop when not specified on grid', () => {
  const grid = resolveContainerTag({ display: 'grid' })

  assert.equal(grid.tag, 'GridContainer')
  assert.equal('columns' in grid.props, false)
})

test('maps justifyContent to container alignment where supported', () => {
  const centered = resolveContainerTag({
    flexDirection: 'row',
    justifyContent: 'center',
  })
  const endAligned = resolveContainerTag({
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  })
  const grid = resolveContainerTag({
    display: 'grid',
    justifyContent: 'center',
  })

  assert.equal(centered.props.alignment, 1)
  assert.equal(endAligned.props.alignment, 2)
  assert.equal('alignment' in grid.props, false)
})

test('maps width/height/min constraints to custom_minimum_size axes', () => {
  const size = resolveContainerTag({
    width: 120,
    minWidth: 100,
    maxWidth: 110,
    height: '42px',
    minHeight: 20,
  })

  assert.equal(size.props['custom_minimum_size:x'], 110)
  assert.equal(size.props['custom_minimum_size:y'], 42)
})

test('maps percent width and height to Control anchor ratios', () => {
  const size = resolveContainerTag({
    width: '50%',
    height: '25%',
  })

  assert.equal(size.props.anchor_left, 0)
  assert.equal(size.props.anchor_right, 0.5)
  assert.equal(size.props.anchor_top, 0)
  assert.equal(size.props.anchor_bottom, 0.25)
  assert.equal(size.props.offset_left, 0)
  assert.equal(size.props.offset_right, 0)
  assert.equal(size.props.offset_top, 0)
  assert.equal(size.props.offset_bottom, 0)
  assert.equal('custom_minimum_size:x' in size.props, false)
  assert.equal('custom_minimum_size:y' in size.props, false)
})

test('ignores unsupported non-pixel and non-percent size values', () => {
  const size = resolveContainerTag({
    width: 'auto',
    height: 'min-content',
  })

  assert.equal('custom_minimum_size:x' in size.props, false)
  assert.equal('custom_minimum_size:y' in size.props, false)
  assert.equal('anchor_right' in size.props, false)
  assert.equal('anchor_bottom' in size.props, false)
})

test('maps display:none alongside supported size props', () => {
  const hidden = resolveContainerTag({
    display: 'none',
    width: '240px',
    height: 120,
  })

  assert.equal(hidden.tag, 'Control')
  assert.equal(hidden.props.visible, false)
  assert.equal(hidden.props['custom_minimum_size:x'], 240)
  assert.equal(hidden.props['custom_minimum_size:y'], 120)
})

test('resolves padding with directional overrides', () => {
  assert.deepEqual(resolvePadding({ padding: '20px' }), {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  })

  assert.deepEqual(
    resolvePadding({
      padding: 20,
      paddingTop: 4,
      paddingRight: 8,
    }),
    {
      top: 4,
      right: 8,
      bottom: 20,
      left: 20,
    },
  )

  assert.deepEqual(resolvePadding({ paddingLeft: 7 }), {
    top: 0,
    right: 0,
    bottom: 0,
    left: 7,
  })

  assert.equal(resolvePadding({}), null)
})

test('resolves margin, border widths, and corner radii', () => {
  assert.deepEqual(
    resolveMargin({
      margin: 12,
      marginLeft: '18px',
    }),
    {
      top: 12,
      right: 12,
      bottom: 12,
      left: 18,
    },
  )

  assert.deepEqual(
    resolveBorderWidths({
      borderWidth: 2,
      borderTopWidth: 4,
      borderStyle: 'solid',
    }),
    {
      top: 4,
      right: 2,
      bottom: 2,
      left: 2,
    },
  )

  assert.equal(resolveBorderWidths({ borderWidth: 2, borderStyle: 'none' }), null)

  assert.deepEqual(
    resolveBorderRadii({
      borderRadius: 6,
      borderTopRightRadius: '10px',
      borderBottomLeftRadius: 0,
    }),
    {
      topLeft: 6,
      topRight: 10,
      bottomRight: 6,
      bottomLeft: 0,
    },
  )
})

test('detects unsupported style keys against the documented subset', () => {
  assert.deepEqual(
    getUnsupportedStyleKeys({
      width: 120,
      backgroundColor: '#112233',
      borderRadius: 8,
      margin: 12,
      backgroundImage: 'url(panel.png)',
      transform: 'scale(1.1)',
      transition: 'opacity 150ms ease-out',
      transitionDuration: '150ms',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 0 4px black',
    }),
    ['boxShadow'],
  )
  assert.equal(supportedHtmlStyleKeys.includes('width'), true)
  assert.equal(supportedHtmlStyleKeys.includes('backgroundImage'), true)
  assert.equal(supportedHtmlStyleKeys.includes('borderRadius'), true)
  assert.equal(supportedHtmlStyleKeys.includes('margin'), true)
  assert.equal(supportedHtmlStyleKeys.includes('transform'), true)
  assert.equal(supportedHtmlStyleKeys.includes('transition'), true)
  assert.equal(supportedHtmlStyleKeys.includes('transitionDuration'), true)
  assert.equal(supportedHtmlStyleKeys.includes('fontFamily'), true)
})

test('warns once per unsupported style key and component', () => {
  clearUnsupportedStyleWarningsForTests()
  const warnings = []
  const warn = (message) => warnings.push(message)
  const style = {
    width: 120,
    boxShadow: '0 1px 2px black',
  }

  warnUnsupportedStyleProps(style, 'TestBox', warn)
  warnUnsupportedStyleProps(style, 'TestBox', warn)
  warnUnsupportedStyleProps(style, 'OtherBox', warn)

  assert.equal(warnings.length, 2)
  assert.match(warnings[0], /Unsupported style prop on <TestBox>/)
  assert.match(warnings[0], /"boxShadow"/)
  assert.match(warnings[0], /Supported style props:/)
  assert.match(warnings[1], /Unsupported style prop on <OtherBox>/)
})
