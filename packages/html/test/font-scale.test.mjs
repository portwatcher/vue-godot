import test from 'node:test'
import assert from 'node:assert/strict'
import { register } from 'node:module'

register(new URL('./godot-browser-loader.mjs', import.meta.url).href)

const { setHtmlFontScale, Span } = await import('../dist/index.js')

function renderSpan(fontSize) {
  const render = Span.setup(
    { style: { fontSize } },
    {
      slots: { default: () => ['Scaled'] },
    },
  )
  return render()
}

test('global HTML font scale multiplies explicit text sizes', () => {
  setHtmlFontScale(1.3)
  assert.equal(renderSpan(20).props['theme_override_font_sizes/font_size'], 26)
  setHtmlFontScale(1)
})

test('global HTML font scale clamps invalid and extreme values', () => {
  setHtmlFontScale(Number.NaN)
  assert.equal(renderSpan(20).props['theme_override_font_sizes/font_size'], 20)

  setHtmlFontScale(5)
  assert.equal(renderSpan(20).props['theme_override_font_sizes/font_size'], 40)
  setHtmlFontScale(1)
})
