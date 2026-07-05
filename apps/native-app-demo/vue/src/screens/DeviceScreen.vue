<template>
  <Div :style="screenStyle">
    <Div :style="headerStyle">
      <Div>
        <Span :style="eyebrowStyle">camera or geolocation</Span>
        <Span :style="titleStyle">Device and permission checks</Span>
      </Div>
      <Button @click="goHome">Back</Button>
    </Div>

    <Div :style="panelStyle">
      <Span :style="sectionTitleStyle">Adapter reachability</Span>
      <Span>{{ capabilitySummary }}</Span>
      <Button @click="refreshCapabilities">Refresh adapters</Button>
    </Div>

    <Div :style="panelStyle">
      <Span :style="sectionTitleStyle">Runtime permission query</Span>
      <Div :style="buttonRowStyle">
        <Button @click="queryPermission('camera')">Camera</Button>
        <Button @click="queryPermission('geolocation')">Geolocation</Button>
      </Div>
      <Span>{{ permissionMessage }}</Span>
    </Div>

    <Div :style="panelStyle">
      <Span :style="sectionTitleStyle">Native capability calls</Span>
      <Div :style="buttonRowStyle">
        <Button @click="requestCamera">Try camera</Button>
        <Button @click="requestGeolocation">Try geolocation</Button>
      </Div>
      <Span>{{ nativeCallMessage }}</Span>
    </Div>
  </Div>
</template>

<script setup lang="ts">
import {
  mediaDevices,
  navigator as godotNavigator,
  type GodotPermissionName,
} from '@vue-godot/browser'
import {
  getCapabilityStatus,
  type DeviceCapabilityName,
  type DeviceCapabilityStatus,
} from '@vue-godot/device'
import type { HtmlStyle } from '@vue-godot/html'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const capabilityNames: DeviceCapabilityName[] = [
  'permissions',
  'media-devices',
  'geolocation',
]
const capabilityStatuses = ref(readCapabilityStatuses())
const permissionMessage = ref('No permission queried yet.')
const nativeCallMessage = ref('No native call attempted yet.')
const capabilitySummary = computed(() =>
  capabilityStatuses.value
    .map((status) => `${status.name}: ${status.state}`)
    .join(' | '),
)

function readCapabilityStatuses(): DeviceCapabilityStatus[] {
  return capabilityNames.map((name) => getCapabilityStatus(name))
}

function refreshCapabilities(): void {
  capabilityStatuses.value = readCapabilityStatuses()
}

async function queryPermission(name: GodotPermissionName): Promise<void> {
  try {
    const status = await godotNavigator.permissions.query({ name })
    permissionMessage.value = `${name} permission: ${status.state}`
  } catch (error) {
    permissionMessage.value = formatError(error)
  }
}

async function requestCamera(): Promise<void> {
  try {
    const stream = await mediaDevices.getUserMedia({ video: true })
    const tracks = stream.getTracks()
    for (const track of tracks) {
      track.stop()
    }
    nativeCallMessage.value = `camera stream opened with ${tracks.length} track(s)`
  } catch (error) {
    nativeCallMessage.value = formatError(error)
  }
}

function requestGeolocation(): void {
  if (!godotNavigator.geolocation) {
    nativeCallMessage.value = 'geolocation adapter is not registered'
    return
  }

  godotNavigator.geolocation.getCurrentPosition(
    (position) => {
      nativeCallMessage.value = `geolocation ${position.coords.latitude.toFixed(
        4,
      )}, ${position.coords.longitude.toFixed(4)}`
    },
    (error) => {
      nativeCallMessage.value = `${error.name}: ${error.message}`
    },
    { timeout: 2500, enableHighAccuracy: false },
  )
}

function formatError(error: unknown): string {
  return error instanceof Error
    ? `${error.name}: ${error.message}`
    : String(error)
}

function goHome(): void {
  void router.push('/')
}

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
  color: '#fbbf24',
  fontSize: 14,
}
const titleStyle: HtmlStyle = {
  color: '#f9fafb',
  fontSize: 24,
  fontWeight: 'bold',
}
const panelStyle: HtmlStyle = {
  gap: 8,
  padding: 10,
  backgroundColor: '#172033',
  borderColor: '#4b5563',
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
</script>
