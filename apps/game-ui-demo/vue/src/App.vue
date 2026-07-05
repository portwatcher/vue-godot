<template>
  <Screen name="game-ui-demo" title="Vue-rendered HUD" :style="screenStyle">
    <Div :style="hudRowStyle">
      <Div :style="statusPanelStyle">
        <Div :style="headerRowStyle">
          <Img src="./icon.svg" alt="image assets" :style="iconStyle"></Img>
          <Div>
            <Span :style="eyebrowStyle">Godot scene</Span>
            <Span :style="titleStyle">Vue-rendered HUD</Span>
          </Div>
        </Div>
        <Progress
          :value="heroHealth"
          :max="100"
          :show-percentage="true"
          :style="{ width: 280, height: 18 }"
        ></Progress>
        <Div :style="meterRowStyle">
          <Span>{{ `shield ${shield}%` }}</Span>
          <Span>{{ `stamina ${stamina}%` }}</Span>
          <Span>{{ `combo ${combo}` }}</Span>
        </Div>
        <Div :style="inputModeRowStyle">
          <Pressable
            v-for="mode in inputModes"
            :key="mode"
            :style="inputModeStyle(mode)"
            @press="selectInputMode(mode)"
          >
            <Span>{{ mode }}</Span>
          </Pressable>
        </Div>
      </Div>

      <Div :style="mediaPanelStyle">
        <Span :style="sectionTitleStyle">media</Span>
        <Audio
          :src="audioDataUri"
          :autoplay="false"
          :loop="false"
          :muted="muted"
          :volume="volumeRatio"
          @ended="mediaStatus = 'audio ended'"
        ></Audio>
        <Video
          src="./assets/demo-video.ogv"
          :autoplay="false"
          :loop="true"
          :muted="muted"
          :volume="volumeRatio"
          :style="{ width: 240, height: 136 }"
          @ended="mediaStatus = 'video ended'"
        ></Video>
        <Span>{{ mediaStatus }}</Span>
      </Div>
    </Div>

    <Div :style="contentRowStyle">
      <Div :style="panelStyle">
        <Span :style="sectionTitleStyle">inventory</Span>
        <Select v-model="selectedItem">
          <Option v-for="item in inventory" :key="item.id" :value="item.id">
            {{ `${item.name} x${item.count}` }}
          </Option>
        </Select>
        <Div :style="buttonRowStyle">
          <Button @click="useSelectedItem">Use</Button>
          <Button @click="restoreFocus('inventory')">Focus</Button>
        </Div>
        <Span>{{ inventoryMessage }}</Span>
      </Div>

      <Div :style="panelStyle">
        <Span :style="sectionTitleStyle">settings</Span>
        <Input
          v-model="volume"
          type="range"
          :min="0"
          :max="100"
          :step="5"
        ></Input>
        <Switch v-model="muted" label="mute audio"></Switch>
        <Switch v-model="assistMode" label="assist mode"></Switch>
        <Select v-model="difficulty">
          <Option value="story">story</Option>
          <Option value="normal">normal</Option>
          <Option value="expert">expert</Option>
        </Select>
        <Span>{{ settingsSummary }}</Span>
      </Div>

      <Div :style="panelStyle">
        <Span :style="sectionTitleStyle">touch controls</Span>
        <Div :style="buttonRowStyle">
          <Pressable :style="actionButtonStyle" @press="dash">
            <Span>dash</Span>
          </Pressable>
          <Pressable :style="actionButtonStyle" @press="attack">
            <Span>attack</Span>
          </Pressable>
        </Div>
        <Button @click="openPause">pause</Button>
        <Span>{{ actionMessage }}</Span>
      </Div>
    </Div>

    <Div :style="footerStyle">
      <Span>{{ `input=${inputMode} keyboard=${keyboardShortcutCount}` }}</Span>
      <Span>{{ `animation pulse=${pulseFrame}` }}</Span>
      <Span>{{ `focus restoration=${focusMessage}` }}</Span>
    </Div>

    <Overlay v-if="isPaused" :style="overlayStyle">
      <Div :style="pausePanelStyle">
        <Span :style="titleStyle">pause</Span>
        <Span>Last panel: {{ lastFocusedPanel }}</Span>
        <Button @click="closePause">Resume</Button>
      </Div>
    </Overlay>
  </Screen>
</template>

<script setup lang="ts">
import type { HtmlStyle } from '@vue-godot/html'
import { cancelAnimationFrame, requestAnimationFrame } from '@vue-godot/browser'
import { computed, onMounted, onUnmounted, ref } from 'vue'

type InputMode = 'controller' | 'keyboard' | 'touch'

interface InventoryItem {
  id: string
  name: string
  count: number
}

const inputModes: InputMode[] = ['controller', 'keyboard', 'touch']
const inputMode = ref<InputMode>('controller')
const heroHealth = ref(84)
const shield = ref(42)
const stamina = ref(67)
const combo = ref(0)
const volume = ref(70)
const muted = ref(false)
const assistMode = ref(false)
const difficulty = ref('normal')
const selectedItem = ref('potion')
const inventoryMessage = ref('Inventory ready.')
const actionMessage = ref('Awaiting input.')
const mediaStatus = ref('audio and video ready')
const isPaused = ref(false)
const lastFocusedPanel = ref('hud')
const focusMessage = ref('hud')
const keyboardShortcutCount = ref(0)
const pulseFrame = ref(0)
const animationFrameId = ref<number | null>(null)
const inventory = ref<InventoryItem[]>([
  { id: 'potion', name: 'Potion', count: 3 },
  { id: 'flare', name: 'Flare', count: 2 },
  { id: 'keycard', name: 'Keycard', count: 1 },
])
const volumeRatio = computed(() => volume.value / 100)
const settingsSummary = computed(
  () =>
    `volume ${volume.value}, muted=${muted.value}, assist=${assistMode.value}, difficulty=${difficulty.value}`,
)

const audioDataUri =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='

function selectInputMode(mode: InputMode): void {
  inputMode.value = mode
  lastFocusedPanel.value = mode
  actionMessage.value = `${mode} input selected`
}

function useSelectedItem(): void {
  const item = inventory.value.find((entry) => entry.id === selectedItem.value)
  if (!item) {
    inventoryMessage.value = 'No item selected.'
    return
  }

  if (item.count <= 0) {
    inventoryMessage.value = `${item.name} is depleted.`
    return
  }

  item.count = item.count - 1
  inventoryMessage.value = `Used ${item.name}.`
  lastFocusedPanel.value = 'inventory'
}

function dash(): void {
  combo.value = combo.value + 1
  stamina.value = Math.max(0, stamina.value - 8)
  actionMessage.value = 'touch dash'
  selectInputMode('touch')
}

function attack(): void {
  combo.value = combo.value + 1
  shield.value = Math.max(0, shield.value - 3)
  actionMessage.value = 'touch attack'
  selectInputMode('touch')
}

function openPause(): void {
  isPaused.value = true
  lastFocusedPanel.value = 'pause'
}

function closePause(): void {
  isPaused.value = false
  restoreFocus(lastFocusedPanel.value)
}

function restoreFocus(panel: string): void {
  focusMessage.value = `restored to ${panel}`
  lastFocusedPanel.value = panel
}

function handleKeyboardShortcut(): void {
  keyboardShortcutCount.value = keyboardShortcutCount.value + 1
  selectInputMode('keyboard')
}

function tickAnimation(): void {
  pulseFrame.value = (pulseFrame.value + 1) % 120
  animationFrameId.value = requestAnimationFrame(tickAnimation)
}

function inputModeStyle(mode: InputMode): HtmlStyle {
  return {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: inputMode.value === mode ? '#fbbf24' : '#4b5563',
    backgroundColor: inputMode.value === mode ? '#78350f' : '#111827',
  }
}

onMounted(() => {
  addEventListener('keydown', handleKeyboardShortcut)
  animationFrameId.value = requestAnimationFrame(tickAnimation)
})

onUnmounted(() => {
  removeEventListener('keydown', handleKeyboardShortcut)
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }
})

const screenStyle: HtmlStyle = {
  width: 840,
  minHeight: 560,
  padding: 12,
  gap: 12,
  backgroundColor: '#0f172a',
}
const hudRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 12,
}
const statusPanelStyle = computed<HtmlStyle>(() => ({
  flex: 1,
  gap: 10,
  padding: 12,
  backgroundColor: '#172033',
  borderColor: '#334155',
  borderWidth: 1,
  borderRadius: 6,
  transform: `translateY(${Math.sin(pulseFrame.value / 8) * 2}px)`,
}))
const mediaPanelStyle: HtmlStyle = {
  width: 280,
  gap: 8,
  padding: 12,
  backgroundColor: '#111827',
  borderColor: '#334155',
  borderWidth: 1,
  borderRadius: 6,
}
const headerRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
}
const iconStyle: HtmlStyle = {
  width: 48,
  height: 48,
}
const eyebrowStyle: HtmlStyle = {
  color: '#93c5fd',
  fontSize: 13,
}
const titleStyle: HtmlStyle = {
  color: '#f9fafb',
  fontSize: 24,
  fontWeight: 'bold',
}
const meterRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 12,
}
const inputModeRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 8,
}
const contentRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 12,
}
const panelStyle: HtmlStyle = {
  flex: 1,
  gap: 8,
  padding: 12,
  backgroundColor: '#172033',
  borderColor: '#334155',
  borderWidth: 1,
  borderRadius: 6,
}
const sectionTitleStyle: HtmlStyle = {
  color: '#e5e7eb',
  fontSize: 18,
  fontWeight: 'bold',
}
const buttonRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 8,
}
const actionButtonStyle: HtmlStyle = {
  minWidth: 88,
  padding: 10,
  borderRadius: 6,
  backgroundColor: '#1d4ed8',
}
const footerStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 16,
  padding: 8,
  backgroundColor: '#111827',
  borderColor: '#334155',
  borderWidth: 1,
  borderRadius: 6,
}
const overlayStyle: HtmlStyle = {
  backgroundColor: '#000000',
  opacity: 0.84,
}
const pausePanelStyle: HtmlStyle = {
  width: 280,
  gap: 10,
  padding: 16,
  backgroundColor: '#172033',
  borderColor: '#fbbf24',
  borderWidth: 1,
  borderRadius: 6,
}
</script>
