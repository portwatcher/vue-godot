<template>
  <!-- ===== Section: Div layout ===== -->
  <Label text="--- Div layout ---" />
  <div
    :style="{
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent: justify,
      alignItems: align,
      gap: 12,
      padding: 16,
      width: 560,
      minHeight: 120,
      backgroundColor: '#172033',
    }"
  >
    <div :style="{ flex: 1, padding: 8 }">
      <span :style="{}">flex:1 child</span>
    </div>
    <template v-for="n in 2" :key="n">
      <div :style="{ alignSelf: n === 1 ? 'center' : 'flex-end', padding: 6 }">
        <span>fragment child {{ n }}</span>
      </div>
    </template>
    <div :style="{ flex: 2, padding: 8 }">
      <span>flex:2 child</span>
    </div>
  </div>
  <HBoxContainer>
    <button @click="toggleDirection">Toggle Direction</button>
    <button @click="toggleWrap">Toggle Wrap</button>
    <button @click="cycleJustify">Cycle Justify</button>
    <button @click="cycleAlign">Cycle Align</button>
  </HBoxContainer>
  <Label
    :text="`direction=${direction} wrap=${wrap} justify=${justify} align=${align}`"
  />

  <!-- ===== Section: Span (text styling) ===== -->
  <Label text="--- Span ---" />
  <span :style="{ fontSize: 24, color: '#ff6600', textAlign: 'center' }">
    Orange 24px centered
  </span>
  <span
    :style="{
      textTransform: 'uppercase',
      overflowWrap: 'break-word',
      width: 200,
    }"
  >
    uppercase with word wrap
  </span>

  <!-- ===== Section: Button ===== -->
  <Label text="--- Button ---" />
  <HBoxContainer>
    <button @click="onButtonClick">Click me</button>
    <button :disabled="true">Disabled</button>
  </HBoxContainer>
  <Label :text="`Button clicks: ${buttonClicks}`" />

  <!-- ===== Section: Anchor ===== -->
  <Label text="--- Anchor ---" />
  <a
    href="https://godotengine.org"
    :style="{ fontSize: 18, color: '#44aaff' }"
    @click="onLinkClick"
  >
    Open Godot site
  </a>
  <Label :text="`Anchor clicks: ${linkClicks}`" />

  <!-- ===== Section: Input (text) ===== -->
  <Label text="--- Input (text) ---" />
  <input v-model="textValue" placeholder="Type something..." />
  <Label :text="`Text input: ${textValue}`" />

  <!-- ===== Section: Input (password) ===== -->
  <Label text="--- Input (password) ---" />
  <input type="password" v-model="passwordValue" placeholder="Secret" />
  <Label :text="`Password length: ${passwordValue.length}`" />

  <!-- ===== Section: Input (checkbox) ===== -->
  <Label text="--- Input (checkbox) ---" />
  <input type="checkbox" v-model="checkboxValue" />
  <Label :text="`Checked: ${checkboxValue}`" />

  <!-- ===== Section: Input (range) ===== -->
  <Label text="--- Input (range) ---" />
  <input type="range" v-model="rangeValue" :min="0" :max="100" :step="5" />
  <Label :text="`Range: ${rangeValue}`" />

  <!-- ===== Section: Textarea ===== -->
  <Label text="--- Textarea ---" />
  <textarea
    v-model="textareaValue"
    placeholder="Multi-line text..."
    :rows="3"
    :cols="40"
  />
  <Label :text="`Textarea lines: ${textareaValue.split('\n').length}`" />

  <!-- ===== Section: Select ===== -->
  <Label text="--- Select ---" />
  <select v-model="selectedFruit">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </select>
  <Label :text="`Selected: ${selectedFruit}`" />

  <!-- ===== Section: Img ===== -->
  <Label text="--- Img ---" />
  <img
    src="res://icon.svg"
    alt="Godot icon"
    :style="{ width: 64, height: 64 }"
  />

  <!-- ===== Section: Svg ===== -->
  <Label text="--- Svg ---" />
  <svg
    src="res://icon.svg"
    alt="SVG icon"
    :scale="2"
    :style="{ width: 64, height: 64 }"
  />

  <!-- ===== Section: Canvas ===== -->
  <Label text="--- Canvas ---" />
  <canvas ref="canvasRef" :width="200" :height="80" />

  <!-- ===== Section: Audio ===== -->
  <Label text="--- Audio (no src in demo) ---" />
  <audio :volume="0.5" :loop="false" :muted="true" />

  <!-- ===== Section: Video ===== -->
  <Label text="--- Video (no src in demo) ---" />
  <video :style="{ width: 320, height: 180 }" :volume="0.8" :muted="true" />

  <!-- ===== Section: Browser APIs ===== -->
  <Label text="--- Browser API smoke tests ---" />
  <button @click="runBrowserTests">Run browser API tests</button>
  <Label :text="browserTestResult" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// --- Div layout state ---
const direction = ref<'row' | 'column'>('row')
const wrap = ref<'nowrap' | 'wrap'>('nowrap')
const justify = ref<'flex-start' | 'center' | 'flex-end'>('flex-start')
const align = ref<'flex-start' | 'center' | 'flex-end' | 'stretch'>('stretch')

function toggleDirection() {
  direction.value = direction.value === 'row' ? 'column' : 'row'
}
function toggleWrap() {
  wrap.value = wrap.value === 'nowrap' ? 'wrap' : 'nowrap'
}
function cycleJustify() {
  justify.value =
    justify.value === 'flex-start'
      ? 'center'
      : justify.value === 'center'
        ? 'flex-end'
        : 'flex-start'
}
function cycleAlign() {
  align.value =
    align.value === 'stretch'
      ? 'flex-start'
      : align.value === 'flex-start'
        ? 'center'
        : align.value === 'center'
          ? 'flex-end'
          : 'stretch'
}

// --- Button ---
const buttonClicks = ref(0)
function onButtonClick() {
  buttonClicks.value++
}

// --- Anchor ---
const linkClicks = ref(0)
function onLinkClick() {
  linkClicks.value++
}

// --- Input ---
const textValue = ref('')
const passwordValue = ref('')
const checkboxValue = ref(false)
const rangeValue = ref(50)

// --- Textarea ---
const textareaValue = ref('')

// --- Select ---
const selectedFruit = ref('apple')

// --- Canvas ---
const canvasRef = ref<{ queue_redraw: () => void } | null>(null)

onMounted(() => {
  // Canvas is a bare Control — access via template ref for draw operations
  if (canvasRef.value) {
    console.log('[html-demo] Canvas ref obtained:', canvasRef.value)
  }
})

// --- Browser API smoke tests ---
const browserTestResult = ref('Not run yet')

function runBrowserTests() {
  const results: string[] = []

  // URL
  try {
    const url = new URL('https://example.com/path?q=1#hash')
    results.push(`URL: host=${url.host} ok`)
  } catch (e) {
    results.push(`URL: FAIL ${e}`)
  }

  // Blob
  try {
    const blob = new Blob(['hello'], { type: 'text/plain' })
    results.push(`Blob: size=${blob.size} ok`)
  } catch (e) {
    results.push(`Blob: FAIL ${e}`)
  }

  // btoa / atob
  try {
    const encoded = btoa('hello')
    const decoded = atob(encoded)
    results.push(`base64: ${decoded === 'hello' ? 'ok' : 'MISMATCH'}`)
  } catch (e) {
    results.push(`base64: FAIL ${e}`)
  }

  // TextEncoder / TextDecoder
  try {
    const encoded = new TextEncoder().encode('test')
    const decoded = new TextDecoder().decode(encoded)
    results.push(`encoding: ${decoded === 'test' ? 'ok' : 'MISMATCH'}`)
  } catch (e) {
    results.push(`encoding: FAIL ${e}`)
  }

  // Headers
  try {
    const h = new Headers()
    h.set('x-test', 'value')
    results.push(`Headers: ${h.get('x-test') === 'value' ? 'ok' : 'FAIL'}`)
  } catch (e) {
    results.push(`Headers: FAIL ${e}`)
  }

  // AbortController
  try {
    const ac = new AbortController()
    results.push(`AbortController: aborted=${ac.signal.aborted} ok`)
  } catch (e) {
    results.push(`AbortController: FAIL ${e}`)
  }

  // URL.createObjectURL / revokeObjectURL
  try {
    const blob = new Blob(['data'])
    const objectUrl = URL.createObjectURL(blob)
    URL.revokeObjectURL(objectUrl)
    results.push(`ObjectURL: ok`)
  } catch (e) {
    results.push(`ObjectURL: FAIL ${e}`)
  }

  // Response
  try {
    const encoded = new TextEncoder().encode('ok').buffer
    const response = new Response(encoded, {
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
    })
    results.push(`Response: ${response.ok ? 'ok' : 'FAIL'}`)
  } catch (e) {
    results.push(`Response: FAIL ${e}`)
  }

  // History + Location
  try {
    const previousHref = location.href
    history.pushState({ demo: true }, '', '/html-demo')
    const moved = location.pathname === '/html-demo'
    history.replaceState(null, '', previousHref)
    results.push(`History: ${moved ? 'ok' : 'FAIL'}`)
  } catch (e) {
    results.push(`History: FAIL ${e}`)
  }

  browserTestResult.value = results.join(' | ')
  console.log('[html-demo] Browser API results:', browserTestResult.value)
}
</script>
