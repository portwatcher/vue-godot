<template>
  <Div :style="screenStyle">
    <Div :style="headerStyle">
      <Div>
        <Span :style="eyebrowStyle">native app demo</Span>
        <Span :style="titleStyle">Production app flow</Span>
      </Div>
      <Button @click="goToDevice">Device APIs</Button>
    </Div>

    <Div :style="statusGridStyle">
      <Div :style="statusCardStyle">
        <Span :style="labelStyle">reachability</Span>
        <Span>{{ reachabilitySummary }}</Span>
      </Div>
      <Div :style="statusCardStyle">
        <Span :style="labelStyle">persistent storage</Span>
        <Span>{{ storageSummary }}</Span>
      </Div>
    </Div>

    <Form
      :style="formFrameStyle"
      :content-style="formContentStyle"
      :disabled="isSaving"
      @submit="saveProfile"
      @reset="resetProfile"
    >
      <Span :style="sectionTitleStyle">Profile form input</Span>
      <KeyboardAvoidingView
        behavior="padding"
        :fallback-keyboard-height="42"
        :keyboard-vertical-offset="8"
        :content-style="{ gap: 8 }"
      >
        <Input
          v-model="profile.displayName"
          placeholder="Display name"
          :max-length="32"
        ></Input>
        <Input
          v-model="profile.email"
          placeholder="Email for receipt"
          :max-length="48"
        ></Input>
        <Textarea
          v-model="profile.notes"
          placeholder="Release notes"
          :style="{ minHeight: 80 }"
        ></Textarea>
      </KeyboardAvoidingView>
      <Div :style="buttonRowStyle">
        <Button :disabled="!canSave || isSaving" @click="saveProfile">
          Save
        </Button>
        <Button :disabled="isSaving" @click="resetProfile">Reset</Button>
      </Div>
      <Span :style="hintStyle">{{ validationMessage }}</Span>
    </Form>

    <Div :style="panelStyle">
      <Span :style="sectionTitleStyle">Network loading</Span>
      <Span>{{ networkMessage }}</Span>
      <Div :style="buttonRowStyle">
        <Button :disabled="isLoadingNetwork" @click="refreshReachability">
          Probe
        </Button>
        <Button @click="forceOffline">Offline</Button>
        <Button @click="forceOnline">Online</Button>
      </Div>
    </Div>
  </Div>
</template>

<script setup lang="ts">
import {
  checkNetworkReachability,
  localStorage,
  navigator as godotNavigator,
  sessionStorage,
  setNavigatorOnline,
} from '@vue-godot/browser'
import type { HtmlStyle } from '@vue-godot/html'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profile = reactive({
  displayName: '',
  email: '',
  notes: '',
})
const isSaving = ref(false)
const isLoadingNetwork = ref(false)
const reachability = ref(godotNavigator.onLine)
const networkMessage = ref('Ready to run a reachability probe.')
const savedDisplayName = ref('Not saved yet')
const storageSummary = computed(
  () => `localStorage profile: ${savedDisplayName.value}`,
)
const reachabilitySummary = computed(() =>
  reachability.value ? 'online' : 'offline',
)
const canSave = computed(
  () =>
    profile.displayName.trim().length >= 2 &&
    profile.email.includes('@') &&
    profile.notes.trim().length > 0,
)
const validationMessage = computed(() =>
  canSave.value
    ? 'Form is valid and ready for submit.'
    : 'Enter a name, email, and notes to enable save.',
)

function isStoredProfile(
  value: unknown,
): value is { displayName: string; email: string; notes: string } {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.displayName === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.notes === 'string'
  )
}

function readProfileFromStorage(): void {
  const source = localStorage.getItem('native-app-demo.profile')
  if (!source) {
    return
  }

  try {
    const parsed: unknown = JSON.parse(source)
    if (isStoredProfile(parsed)) {
      profile.displayName = parsed.displayName
      profile.email = parsed.email
      profile.notes = parsed.notes
      savedDisplayName.value = parsed.displayName
    }
  } catch {
    localStorage.removeItem('native-app-demo.profile')
  }
}

function saveProfile(): void {
  if (!canSave.value) {
    return
  }

  isSaving.value = true
  const payload = {
    displayName: profile.displayName.trim(),
    email: profile.email.trim(),
    notes: profile.notes.trim(),
  }
  localStorage.setItem('native-app-demo.profile', JSON.stringify(payload))
  sessionStorage.setItem('native-app-demo.lastSave', new Date().toISOString())
  savedDisplayName.value = payload.displayName
  isSaving.value = false
}

function resetProfile(): void {
  profile.displayName = ''
  profile.email = ''
  profile.notes = ''
  sessionStorage.setItem('native-app-demo.reset', 'true')
}

async function refreshReachability(): Promise<void> {
  isLoadingNetwork.value = true
  networkMessage.value = 'Loading reachability state...'
  const online = await checkNetworkReachability({
    url: 'https://example.com/',
    method: 'HEAD',
    timeoutMs: 2500,
  })
  reachability.value = online
  networkMessage.value = online
    ? 'Reachability probe succeeded.'
    : 'Reachability probe failed or timed out.'
  isLoadingNetwork.value = false
}

function forceOffline(): void {
  setNavigatorOnline(false)
  reachability.value = false
  networkMessage.value = 'Offline state forced through setNavigatorOnline().'
}

function forceOnline(): void {
  setNavigatorOnline(true)
  reachability.value = true
  networkMessage.value = 'Online state forced through setNavigatorOnline().'
}

function syncReachability(): void {
  reachability.value = godotNavigator.onLine
}

function goToDevice(): void {
  void router.push('/device')
}

onMounted(() => {
  readProfileFromStorage()
  addEventListener('online', syncReachability)
  addEventListener('offline', syncReachability)
})

onUnmounted(() => {
  removeEventListener('online', syncReachability)
  removeEventListener('offline', syncReachability)
})

const screenStyle: HtmlStyle = {
  gap: 12,
  padding: 8,
}
const headerStyle: HtmlStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
}
const eyebrowStyle: HtmlStyle = {
  color: '#93c5fd',
  fontSize: 14,
}
const titleStyle: HtmlStyle = {
  color: '#f9fafb',
  fontSize: 24,
  fontWeight: 'bold',
}
const statusGridStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 10,
}
const statusCardStyle: HtmlStyle = {
  flex: 1,
  gap: 4,
  padding: 10,
  backgroundColor: '#1f2937',
  borderColor: '#374151',
  borderWidth: 1,
  borderRadius: 6,
}
const formFrameStyle: HtmlStyle = {
  backgroundColor: '#172033',
  borderColor: '#4b5563',
  borderWidth: 1,
  borderRadius: 6,
  padding: 10,
}
const formContentStyle: HtmlStyle = {
  gap: 8,
}
const panelStyle: HtmlStyle = {
  gap: 8,
  padding: 10,
  backgroundColor: '#111827',
  borderColor: '#374151',
  borderWidth: 1,
  borderRadius: 6,
}
const buttonRowStyle: HtmlStyle = {
  flexDirection: 'row',
  gap: 8,
}
const sectionTitleStyle: HtmlStyle = {
  color: '#e5e7eb',
  fontSize: 18,
  fontWeight: 'bold',
}
const labelStyle: HtmlStyle = {
  color: '#a7f3d0',
  fontSize: 13,
}
const hintStyle: HtmlStyle = {
  color: '#d1d5db',
}
</script>
