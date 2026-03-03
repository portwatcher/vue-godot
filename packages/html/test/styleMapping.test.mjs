import assert from 'node:assert/strict'
import test from 'node:test'

import {
  resolveContainerTag,
  resolvePadding,
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

test('ignores unsupported non-pixel width values', () => {
  const size = resolveContainerTag({
    width: '50%',
    height: 'auto',
  })

  assert.equal('custom_minimum_size:x' in size.props, false)
  assert.equal('custom_minimum_size:y' in size.props, false)
})

test('resolves padding with directional overrides', () => {
  assert.deepEqual(resolvePadding({ padding: 20 }), {
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
