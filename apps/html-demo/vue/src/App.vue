<template>
  <!-- ===== Section: Div layout ===== -->
  <span>--- Div layout ---</span>
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
  <div :style="{ flexDirection: 'row', gap: 8 }">
    <button @click="toggleDirection">Toggle Direction</button>
    <button @click="toggleWrap">Toggle Wrap</button>
    <button @click="cycleJustify">Cycle Justify</button>
    <button @click="cycleAlign">Cycle Align</button>
  </div>
  <span>
    {{ `direction=${direction} wrap=${wrap} justify=${justify} align=${align}` }}
  </span>

  <!-- ===== Section: Span (text styling) ===== -->
  <span>--- Span ---</span>
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
  <span>--- Button ---</span>
  <div :style="{ flexDirection: 'row', gap: 8 }">
    <button @click="onButtonClick">Click me</button>
    <button :disabled="true">Disabled</button>
  </div>
  <span>{{ `Button clicks: ${buttonClicks}` }}</span>

  <!-- ===== Section: Input (text) ===== -->
  <span>--- Input (text) ---</span>
  <input v-model="textValue" placeholder="Type something..."></input>
  <span>{{ `Text input: ${textValue}` }}</span>

  <!-- ===== Section: Input (password) ===== -->
  <span>--- Input (password) ---</span>
  <input type="password" v-model="passwordValue" placeholder="Secret"></input>
  <span>{{ `Password length: ${passwordValue.length}` }}</span>

  <!-- ===== Section: Input (checkbox) ===== -->
  <span>--- Input (checkbox) ---</span>
  <input type="checkbox" v-model="checkboxValue"></input>
  <span>{{ `Checked: ${checkboxValue}` }}</span>

  <!-- ===== Section: Input (range) ===== -->
  <span>--- Input (range) ---</span>
  <input
    type="range"
    v-model="rangeValue"
    :min="0"
    :max="100"
    :step="5"
  ></input>
  <span>{{ `Range: ${rangeValue}` }}</span>

  <!-- ===== Section: Textarea ===== -->
  <span>--- Textarea ---</span>
  <textarea
    v-model="textareaValue"
    placeholder="Multi-line text..."
    :rows="3"
    :cols="40"
  ></textarea>
  <span>{{ `Textarea lines: ${textareaValue.split('\n').length}` }}</span>

  <!-- ===== Section: Select ===== -->
  <span>--- Select ---</span>
  <select v-model="selectedFruit">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </select>
  <span>{{ `Selected: ${selectedFruit}` }}</span>

  <!-- ===== Section: Img ===== -->
  <span>--- Img ---</span>
  <img
    src="res://icon.svg"
    alt="Godot icon"
    :style="{ width: 64, height: 64 }"
  ></img>

  <!-- ===== Section: Svg ===== -->
  <span>--- Svg ---</span>
  <svg
    src="res://icon.svg"
    alt="SVG icon"
    :scale="2"
    :style="{ width: 64, height: 64 }"
  ></svg>

  <!-- ===== Section: Canvas ===== -->
  <span>--- Canvas ---</span>
  <canvas ref="canvasRef" :width="200" :height="80"></canvas>

  <!-- ===== Section: Audio ===== -->
  <span>--- Audio (no src in demo) ---</span>
  <audio :volume="0.5" :loop="false" :muted="true"></audio>

  <!-- ===== Section: Video ===== -->
  <span>--- Video (no src in demo) ---</span>
  <video
    :style="{ width: 320, height: 180 }"
    :volume="0.8"
    :muted="true"
  ></video>

  <!-- ===== Section: Browser APIs ===== -->
  <span>--- Browser API smoke tests ---</span>
  <button @click="runBrowserTests">Run browser API tests</button>
  <span>{{ browserTestResult }}</span>
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

  browserTestResult.value = results.join(' | ')
  console.log('[html-demo] Browser API results:', browserTestResult.value)
}
</script>
