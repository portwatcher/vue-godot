import assert from 'node:assert/strict'
import test from 'node:test'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const {
  clearFontFamilyRegistryForTests,
  clearFontLoaderCacheForTests,
  createFontStyleOverride,
  parseFontFamilyList,
  registerFontFamily,
  resolveFontFamilyStyle,
  unregisterFontFamily,
} = await import('../dist/utils/fontLoader.js')
const { applyCommonControlStyleProps } = await import(
  '../dist/utils/controlStyle.js'
)

test.beforeEach(() => {
  clearFontFamilyRegistryForTests()
  clearFontLoaderCacheForTests()
})

test('parses CSS font family lists with quoted family names', () => {
  assert.deepEqual(
    parseFontFamilyList('"Inter Tight", Noto Sans JP, sans-serif'),
    ['Inter Tight', 'Noto Sans JP', 'sans-serif'],
  )
  assert.deepEqual(parseFontFamilyList("'Comma\\, Name', serif"), [
    'Comma, Name',
    'serif',
  ])
})

test('registers font family sources and resolves fallbacks', () => {
  registerFontFamily('Demo Sans', './fonts/DemoSans.ttf', [
    './fonts/DemoSansSymbols.otf',
  ])
  registerFontFamily('Emoji Fallback', 'res://fonts/Emoji.woff2')

  const resolved = resolveFontFamilyStyle(
    '"Demo Sans", "Emoji Fallback", sans-serif',
  )

  assert.equal(resolved.primary.__kind, 'font-file')
  assert.equal(resolved.primary.path, 'res://fonts/DemoSans.ttf')
  assert.equal(resolved.fallbacks.length, 2)
  assert.equal(resolved.fallbacks[0].path, 'res://fonts/DemoSansSymbols.otf')
  assert.equal(resolved.fallbacks[1].path, 'res://fonts/Emoji.woff2')
})

test('loads direct font path family entries', () => {
  const resolved = resolveFontFamilyStyle(
    './fonts/Primary.ttf, /fonts/Fallback.otf',
  )

  assert.equal(resolved.primary.path, 'res://fonts/Primary.ttf')
  assert.equal(resolved.fallbacks[0].path, 'res://fonts/Fallback.otf')
})

test('creates FontVariation overrides for fallback stacks and bold text', () => {
  registerFontFamily('Demo Sans', './fonts/DemoSans.ttf', [
    './fonts/DemoSansSymbols.otf',
  ])

  const font = createFontStyleOverride('Demo Sans', 'bold')

  assert.equal(font.__kind, 'font-variation')
  assert.equal(font.base_font.path, 'res://fonts/DemoSans.ttf')
  assert.equal(font.fallbacks[0].path, 'res://fonts/DemoSansSymbols.otf')
  assert.equal(font.variation_embolden, 0.7)
})

test('maps fontFamily style to Godot font override props', () => {
  registerFontFamily('Demo Sans', './fonts/DemoSans.ttf')

  const props = {}
  applyCommonControlStyleProps(
    props,
    {
      fontFamily: 'Demo Sans, sans-serif',
    },
    'TextBox',
  )

  assert.equal(props['theme_override_fonts/font'].__kind, 'font-file')
  assert.equal(
    props['theme_override_fonts/font'].path,
    'res://fonts/DemoSans.ttf',
  )
})

test('unregisters font family entries', () => {
  registerFontFamily('Demo Sans', './fonts/DemoSans.ttf')

  assert.equal(unregisterFontFamily('Demo Sans'), true)
  assert.equal(resolveFontFamilyStyle('Demo Sans'), null)
})
