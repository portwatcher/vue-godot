<template>
  <!-- ===== Section: Div layout ===== -->
  <Span>--- Div layout ---</Span>
  <Div
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
    <Div :style="{ flex: 1, padding: 8 }">
      <Span :style="{}">flex:1 child</Span>
    </Div>
    <template v-for="n in 2" :key="n">
      <Div :style="{ alignSelf: n === 1 ? 'center' : 'flex-end', padding: 6 }">
        <Span>fragment child {{ n }}</Span>
      </Div>
    </template>
    <Div :style="{ flex: 2, padding: 8 }">
      <Span>flex:2 child</Span>
    </Div>
  </Div>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="toggleDirection">Toggle Direction</Button>
    <Button @click="toggleWrap">Toggle Wrap</Button>
    <Button @click="cycleJustify">Cycle Justify</Button>
    <Button @click="cycleAlign">Cycle Align</Button>
  </Div>
  <Span>
    {{
      `direction=${direction} wrap=${wrap} justify=${justify} align=${align}`
    }}
  </Span>

  <!-- ===== Section: ScrollView ===== -->
  <Span>--- ScrollView ---</Span>
  <ScrollView
    :style="{ width: 360, height: 120 }"
    :content-style="{ flexDirection: 'column', gap: 6, padding: 8 }"
    :vertical="true"
    scrollbar-mode="auto"
    :follow-focus="true"
  >
    <Div
      v-for="n in 12"
      :key="n"
      :style="{
        padding: 6,
        backgroundColor: n % 2 === 0 ? '#1f2937' : '#111827',
      }"
    >
      <Span>{{ `Scrollable row ${n}` }}</Span>
    </Div>
  </ScrollView>

  <!-- ===== Section: Progress ===== -->
  <Span>--- Progress ---</Span>
  <Div :style="{ flexDirection: 'row', gap: 10, alignItems: 'center' }">
    <Progress
      :value="progressValue"
      :max="100"
      :show-percentage="true"
      :style="{ width: 260, height: 18 }"
    ></Progress>
    <ActivityIndicator
      :active="activityActive"
      :style="{ width: 120, height: 18 }"
    ></ActivityIndicator>
  </Div>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="advanceProgress">Advance</Button>
    <Button @click="toggleActivity">Toggle Activity</Button>
  </Div>
  <Span>
    {{
      `Progress: ${progressValue}% activity=${activityActive ? 'on' : 'off'}`
    }}
  </Span>

  <!-- ===== Section: Modal / Dialog / Overlay ===== -->
  <Span>--- Modal / Dialog / Overlay ---</Span>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="overlayOpen = true">Open Overlay</Button>
    <Button @click="modalOpen = true">Open Modal</Button>
    <Button @click="dialogOpen = true">Open Dialog</Button>
  </Div>
  <Span>
    {{
      `Dialog confirmed ${dialogConfirmCount} time(s), canceled ${dialogCancelCount} time(s)`
    }}
  </Span>
  <Overlay
    v-model="overlayOpen"
    :close-on-click="true"
    :style="{ backgroundColor: '#0008', opacity: 0.9 }"
    :content-style="{
      flexDirection: 'column',
      gap: 8,
      padding: 16,
      alignItems: 'center',
    }"
  >
    <Span>Overlay backdrop blocks input and closes on click.</Span>
    <Button @click="overlayOpen = false">Close Overlay</Button>
  </Overlay>
  <Modal
    v-model="modalOpen"
    title="Demo modal"
    :width="360"
    :height="220"
    :unresizable="true"
  >
    <Div :style="{ flexDirection: 'column', gap: 8, padding: 12 }">
      <Span>Modal content is rendered inside a Godot Window.</Span>
      <Button @click="modalOpen = false">Close Modal</Button>
    </Div>
  </Modal>
  <Dialog
    v-model="dialogOpen"
    title="Confirm action"
    message="Dialog backed by AcceptDialog."
    confirm-text="OK"
    @confirm="dialogConfirmCount++"
    @cancel="dialogCancelCount++"
  ></Dialog>

  <!-- ===== Section: Span (text styling) ===== -->
  <Span>--- Span ---</Span>
  <Span
    :style="{
      fontSize: 24,
      fontWeight: 'bold',
      color: 'orange',
      textAlign: 'center',
    }"
  >
    Bold orange 24px centered
  </Span>
  <Span
    :style="{
      textTransform: 'uppercase',
      overflowWrap: 'break-word',
      width: 200,
    }"
  >
    uppercase with word wrap
  </Span>

  <!-- ===== Section: Button ===== -->
  <Span>--- Button ---</Span>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="onButtonClick">Click me</Button>
    <Button :disabled="true">Disabled</Button>
  </Div>
  <Span>{{ `Button clicks: ${buttonClicks}` }}</Span>

  <!-- ===== Section: PascalCase HTML components ===== -->
  <Label text="--- PascalCase HTML components ---"></Label>
  <Div :style="{ flexDirection: 'row', gap: 8, padding: 8 }">
    <Span :style="{ color: '#a7f3d0' }">PascalCase registration works</Span>
    <Button @click="onPascalButtonClick">Pascal button</Button>
  </Div>
  <Label :text="`Pascal button clicks: ${pascalButtonClicks}`"></Label>

  <!-- ===== Section: Anchor ===== -->
  <Label text="--- Anchor ---"></Label>
  <A
    href="https://godotengine.org"
    :style="{ fontSize: 18, color: '#44aaff' }"
    @click="onLinkClick"
  >
    Open Godot site
  </A>
  <Label :text="`Anchor clicks: ${linkClicks}`"></Label>

  <!-- ===== Section: Input (text) ===== -->
  <Span>--- Input (text) ---</Span>
  <Input v-model="textValue" placeholder="Type something..."></Input>
  <Span>{{ `Text input: ${textValue}` }}</Span>

  <!-- ===== Section: Input (password) ===== -->
  <Span>--- Input (password) ---</Span>
  <Input type="password" v-model="passwordValue" placeholder="Secret"></Input>
  <Span>{{ `Password length: ${passwordValue.length}` }}</Span>

  <!-- ===== Section: Input (checkbox) ===== -->
  <Span>--- Input (checkbox) ---</Span>
  <Input
    type="checkbox"
    v-model="checkboxValue"
    label="Accept updates"
  ></Input>
  <Span>{{ `Checked: ${checkboxValue}` }}</Span>

  <!-- ===== Section: Input (radio) ===== -->
  <Span>--- Input (radio) ---</Span>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Input
      type="radio"
      v-model="radioValue"
      name="demo-choice"
      value="alpha"
      label="Alpha"
    ></Input>
    <Input
      type="radio"
      v-model="radioValue"
      name="demo-choice"
      value="beta"
      label="Beta"
    ></Input>
  </Div>
  <Span>{{ `Radio: ${radioValue}` }}</Span>

  <!-- ===== Section: Switch ===== -->
  <Span>--- Switch ---</Span>
  <Switch v-model="switchValue" label="Enable sync"></Switch>
  <Span>{{ `Switch: ${switchValue}` }}</Span>

  <!-- ===== Section: Input (range) ===== -->
  <Span>--- Input (range) ---</Span>
  <Input
    type="range"
    v-model="rangeValue"
    :min="0"
    :max="100"
    :step="5"
  ></Input>
  <Span>{{ `Range: ${rangeValue}` }}</Span>

  <!-- ===== Section: Textarea ===== -->
  <Span>--- Textarea ---</Span>
  <Textarea
    v-model="textareaValue"
    placeholder="Multi-line text..."
    :rows="3"
    :cols="40"
  ></Textarea>
  <Span>{{ `Textarea lines: ${textareaValue.split('\n').length}` }}</Span>

  <!-- ===== Section: Select ===== -->
  <Span>--- Select ---</Span>
  <Select v-model="selectedFruit">
    <Option value="apple">Apple</Option>
    <Option value="banana">Banana</Option>
    <Option value="cherry">Cherry</Option>
  </Select>
  <Span>{{ `Selected: ${selectedFruit}` }}</Span>

  <!-- ===== Section: Img ===== -->
  <Span>--- Img ---</Span>
  <Img
    :src="demoSvgDataUri"
    alt="Godot icon"
    :style="{ width: 64, height: 64 }"
  ></Img>

  <!-- ===== Section: Svg ===== -->
  <Span>--- Svg ---</Span>
  <Svg
    :src="demoSvgDataUri"
    alt="SVG icon"
    :scale="2"
    :style="{ width: 64, height: 64 }"
  ></Svg>

  <!-- ===== Section: Canvas ===== -->
  <Span>--- Canvas ---</Span>
  <Canvas ref="canvasRef" :width="200" :height="80"></Canvas>

  <!-- ===== Section: Audio ===== -->
  <Span>--- Audio (no src in demo) ---</Span>
  <Audio :volume="0.5" :loop="false" :muted="true"></Audio>

  <!-- ===== Section: Video ===== -->
  <Span>--- Video (no src in demo) ---</Span>
  <Video
    :style="{ width: 320, height: 180 }"
    :volume="0.8"
    :muted="true"
  ></Video>

  <!-- ===== Section: Browser APIs ===== -->
  <Span>--- Browser API smoke tests ---</Span>
  <Button @click="runBrowserTests">Run browser API tests</Button>
  <Span>{{ browserTestResult }}</Span>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatBrowserSmokeResults, runBrowserSmokeTests } from './browserSmoke'

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

// --- Progress ---
const progressValue = ref(45)
const activityActive = ref(true)

function advanceProgress() {
  progressValue.value =
    progressValue.value >= 100 ? 0 : progressValue.value + 10
}

function toggleActivity() {
  activityActive.value = !activityActive.value
}

// --- Modal / Dialog / Overlay ---
const overlayOpen = ref(false)
const modalOpen = ref(false)
const dialogOpen = ref(false)
const dialogConfirmCount = ref(0)
const dialogCancelCount = ref(0)

// --- Button ---
const buttonClicks = ref(0)
function onButtonClick() {
  buttonClicks.value++
}

const pascalButtonClicks = ref(0)
function onPascalButtonClick() {
  pascalButtonClicks.value++
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
const radioValue = ref('alpha')
const switchValue = ref(true)
const rangeValue = ref(50)

// --- Textarea ---
const textareaValue = ref('')

// --- Select ---
const selectedFruit = ref('apple')

// --- Img / Svg ---
const demoSvgDataUri =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2212%22%20fill%3D%22%23478cbf%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2218%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E'

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

async function runBrowserTests() {
  browserTestResult.value = formatBrowserSmokeResults(
    await runBrowserSmokeTests(),
  )
  console.log('[html-demo] Browser API results:', browserTestResult.value)
}
</script>
