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
      margin: 4,
      width: '80%',
      minHeight: 120,
      backgroundColor: '#172033',
      backgroundImage: `url('${demoSvgDataUri}')`,
      borderColor: '#60a5fa',
      borderWidth: 2,
      borderRadius: 8,
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
    <Div
      :style="{
        flex: 2,
        padding: 8,
        transform: 'translateY(2px) scale(1.02)',
      }"
    >
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

  <!-- ===== Section: SafeAreaView ===== -->
  <Span>--- SafeAreaView ---</Span>
  <SafeAreaView
    :edges="['top', 'right', 'bottom', 'left']"
    :fallback-insets="{ top: 8, right: 12, bottom: 8, left: 12 }"
    :style="{ width: 420, backgroundColor: '#111827', padding: 4 }"
    :content-style="{ flexDirection: 'row', gap: 8, alignItems: 'center' }"
  >
    <Span :style="{ color: '#a7f3d0', fontWeight: 'bold' }">
      Safe area content
    </Span>
    <Span :style="{ color: '#d1d5db' }">
      fallback inset smoke test
    </Span>
  </SafeAreaView>

  <!-- ===== Section: KeyboardAvoidingView ===== -->
  <Span>--- KeyboardAvoidingView ---</Span>
  <KeyboardAvoidingView
    behavior="padding"
    :fallback-keyboard-height="36"
    :keyboard-vertical-offset="8"
    :style="{ width: 420, backgroundColor: '#1f2937', padding: 4 }"
    :content-style="{ flexDirection: 'row', gap: 8, alignItems: 'center' }"
  >
    <Input
      v-model="keyboardSample"
      placeholder="Keyboard test"
      :style="{ width: 180 }"
    ></Input>
    <Span :style="{ color: '#fde68a' }">
      fallback avoidance smoke test
    </Span>
  </KeyboardAvoidingView>

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

  <!-- ===== Section: VirtualList ===== -->
  <Span>--- VirtualList ---</Span>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="scrollVirtualList(-84)">Virtual Up</Button>
    <Button @click="scrollVirtualList(84)">Virtual Down</Button>
  </Div>
  <VirtualList
    :items="virtualRows"
    key-field="id"
    :item-height="28"
    :height="140"
    :scroll-offset="virtualScrollOffset"
    :overscan="1"
    :style="{ width: 360, height: 140 }"
    :item-style="{ padding: 4 }"
    @update:scroll-offset="virtualScrollOffset = $event"
  >
    <template #default="{ index }">
      <Span>{{ virtualRows[index]?.title }}</Span>
    </template>
  </VirtualList>
  <Span>
    {{
      `VirtualList offset=${virtualScrollOffset} rendered around row ${Math.floor(
        virtualScrollOffset / 28,
      ) + 1}`
    }}
  </Span>

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
      fontFamily: 'system-ui, sans-serif',
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
    <Button
      aria-label="Increment button demo counter"
      accessibility-hint="Adds one to the visible click count"
      @click="onButtonClick"
    >
      Click me
    </Button>
    <Button :disabled="true">Disabled</Button>
  </Div>
  <Span>{{ `Button clicks: ${buttonClicks}` }}</Span>

  <!-- ===== Section: Pressable ===== -->
  <Span>--- Pressable ---</Span>
  <Pressable
    accessibility-label="Pressable demo surface"
    accessibility-hint="Activates on pointer, keyboard, or controller accept"
    :disabled="pressableDisabled"
    :long-press-delay="400"
    :min-touch-target="48"
    :style="{
      width: 320,
      backgroundColor: pressableState.pressed
        ? '#065f46'
        : pressableState.hovered
          ? '#1d4ed8'
          : '#374151',
      opacity: pressableDisabled ? 0.5 : 1,
    }"
    @press="pressablePresses++"
    @long-press="pressableLongPresses++"
    @state-change="onPressableStateChange"
  >
    <Div :style="{ flexDirection: 'column', gap: 4, padding: 10 }">
      <Span :style="{ color: '#ffffff', fontWeight: 'bold' }">
        Pressable surface
      </Span>
      <Span :style="{ color: '#dbeafe' }">
        {{
          `hover=${pressableState.hovered} pressed=${pressableState.pressed} focused=${pressableState.focused}`
        }}
      </Span>
    </Div>
  </Pressable>
  <Div :style="{ flexDirection: 'row', gap: 8 }">
    <Button @click="pressableDisabled = !pressableDisabled">
      {{ pressableDisabled ? 'Enable' : 'Disable' }}
    </Button>
  </Div>
  <Span>
    {{
      `Presses: ${pressablePresses} long presses: ${pressableLongPresses}`
    }}
  </Span>

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

  <!-- ===== Section: Form / Label ===== -->
  <Span>--- Form / Label ---</Span>
  <Form
    :reset-on-cancel="true"
    :style="{ width: 420, backgroundColor: '#102a43' }"
    :content-style="{ gap: 8, padding: 10 }"
    @submit="onFormSubmit"
    @reset="onFormReset"
  >
    <Label
      text="Display name"
      :required="true"
      :style="{ fontWeight: 'bold', color: '#fef3c7' }"
      :content-style="{ gap: 4 }"
    >
      <Input
        v-model="formName"
        placeholder="Ada"
        accessibility-label="Display name"
        accessibility-hint="Required field"
      ></Input>
    </Label>
    <Div :style="{ flexDirection: 'row', gap: 8 }">
      <Button @click="onFormSubmit">Submit Form</Button>
      <Button @click="onFormReset">Reset Form</Button>
    </Div>
  </Form>
  <Span>
    {{
      `Form name=${formName || 'empty'} submits=${formSubmitCount} resets=${formResetCount}`
    }}
  </Span>

  <!-- ===== Section: Screen / ScreenStack ===== -->
  <Span>--- Screen / ScreenStack ---</Span>
  <Screen
    :full-rect="false"
    :style="{ width: 420, backgroundColor: '#1e1b4b' }"
    :content-style="{ gap: 6, padding: 10 }"
  >
    <Span :style="{ color: '#ddd6fe', fontWeight: 'bold' }">
      Standalone screen surface
    </Span>
    <Span :style="{ color: '#c4b5fd' }">
      Inline mode keeps this demo section in flow.
    </Span>
  </Screen>
  <ScreenStack
    v-model="activeScreen"
    :routes="screenRoutes"
    :full-rect="false"
    :style="{ width: 420, backgroundColor: '#172033' }"
    :content-style="{ gap: 8, padding: 10 }"
    @navigate="onScreenNavigate"
    @back="onScreenBack"
  >
    <template #home="{ route, navigate }">
      <Span :style="{ color: '#bae6fd', fontWeight: 'bold' }">
        {{ route.title }}
      </Span>
      <Button @click="navigate('settings')">Open Settings Screen</Button>
    </template>
    <template #settings="{ route, back }">
      <Span :style="{ color: '#fecaca', fontWeight: 'bold' }">
        {{ route.title }}
      </Span>
      <Button @click="back()">Back To Home</Button>
    </template>
  </ScreenStack>
  <Span>
    {{
      `ScreenStack active=${activeScreen} transitions=${screenTransitionCount}`
    }}
  </Span>

  <!-- ===== Section: Input (text) ===== -->
  <Span>--- Input (text) ---</Span>
  <Input
    v-model="textValue"
    placeholder="Type something..."
    auto-focus
    focus-next="."
    focus-previous="."
    focus-neighbor-right="."
  ></Input>
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

  <!-- ===== Section: CameraView ===== -->
  <Span>--- CameraView ---</Span>
  <CameraView
    alt="Camera preview"
    :style="{ width: 320, height: 180, objectFit: 'cover' }"
  ></CameraView>

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
const keyboardSample = ref('')
const virtualRows = Array.from({ length: 200 }, (_, index) => ({
  id: `row-${index}`,
  title: `Virtual row ${index + 1}`,
}))
const virtualScrollOffset = ref(0)

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
function scrollVirtualList(delta: number) {
  const maxOffset = Math.max(0, virtualRows.length * 28 - 140)
  virtualScrollOffset.value = Math.min(
    maxOffset,
    Math.max(0, virtualScrollOffset.value + delta),
  )
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

// --- Pressable ---
interface PressableDemoState {
  hovered: boolean
  pressed: boolean
  focused: boolean
  disabled: boolean
}

const pressableDisabled = ref(false)
const pressablePresses = ref(0)
const pressableLongPresses = ref(0)
const pressableState = ref<PressableDemoState>({
  hovered: false,
  pressed: false,
  focused: false,
  disabled: false,
})

function onPressableStateChange(state: PressableDemoState) {
  pressableState.value = state
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

// --- Form / Label ---
const formName = ref('')
const formSubmitCount = ref(0)
const formResetCount = ref(0)

function onFormSubmit() {
  formSubmitCount.value++
}

function onFormReset() {
  formResetCount.value++
  formName.value = ''
}

// --- Screen / ScreenStack ---
const screenRoutes = [
  { name: 'home', title: 'Home Screen' },
  { name: 'settings', title: 'Settings Screen' },
]
const activeScreen = ref('home')
const screenTransitionCount = ref(0)

function onScreenNavigate() {
  screenTransitionCount.value++
}

function onScreenBack() {
  screenTransitionCount.value++
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
