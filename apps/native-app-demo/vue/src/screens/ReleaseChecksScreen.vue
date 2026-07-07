<template>
  <Div :style="screenStyle">
    <Div :style="headerStyle">
      <Div>
        <Span :style="eyebrowStyle">production profile</Span>
        <Span :style="titleStyle">Release API checks</Span>
      </Div>
      <Button @click="goHome">Back</Button>
    </Div>

    <KeyboardAvoidingView
      behavior="padding"
      :fallback-keyboard-height="40"
      :keyboard-vertical-offset="8"
      :content-style="{ flexDirection: 'column', gap: 10 }"
    >
      <Div :style="summaryStyle">
        <Span :style="sectionTitleStyle">Current run</Span>
        <Span>{{ summaryText }}</Span>
        <Div :style="buttonRowStyle">
          <Button :disabled="isRunning" @click="runChecks">
            Run profile checks
          </Button>
        </Div>
      </Div>

      <Div :style="resultListStyle">
        <Div
          v-for="result in visibleResults"
          :key="result.name"
          :style="resultRowStyle(result.state)"
        >
          <Span :style="resultNameStyle">{{ result.name }}</Span>
          <Span :style="resultDetailStyle">{{ result.detail }}</Span>
        </Div>
        <Div v-if="hiddenResultCount > 0" :style="overflowRowStyle">
          <Span :style="resultDetailStyle">
            {{ hiddenResultCount }} more checks completed.
          </Span>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  </Div>
</template>

<script setup lang="ts">
import type { HtmlStyle } from '@vue-godot/html'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  runProductionProfileChecks,
  type ProductionProfileCheckResult,
  type ProductionProfileCheckState,
} from '../app/productionProfileChecks'

const router = useRouter()
const isRunning = ref(false)
const results = ref<ProductionProfileCheckResult[]>([])
const passed = ref(0)
const failed = ref(0)
const info = ref(0)
const visibleResults = computed(() => results.value.slice(0, 6))
const hiddenResultCount = computed(() =>
  Math.max(0, results.value.length - visibleResults.value.length),
)
const summaryText = computed(() => {
  if (isRunning.value) {
    return 'Running on-device API checks...'
  }
  if (results.value.length === 0) {
    return 'No production-profile check has run yet.'
  }
  return `${passed.value} passed, ${info.value} informational, ${failed.value} failed.`
})

async function runChecks(): Promise<void> {
  isRunning.value = true
  try {
    const summary = await runProductionProfileChecks()
    results.value = summary.results
    passed.value = summary.passed
    failed.value = summary.failed
    info.value = summary.info
  } finally {
    isRunning.value = false
  }
}

function goHome(): void {
  void router.push('/')
}

onMounted(() => {
  void runChecks()
})

const screenStyle: HtmlStyle = {
  flexDirection: 'column',
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
  color: '#a7f3d0',
  fontSize: 14,
}
const titleStyle: HtmlStyle = {
  color: '#f9fafb',
  fontSize: 24,
  fontWeight: 'bold',
}
const summaryStyle: HtmlStyle = {
  flexDirection: 'column',
  gap: 8,
  padding: 10,
  backgroundColor: '#172033',
  borderColor: '#4b5563',
  borderWidth: 1,
  borderRadius: 6,
}
const resultListStyle: HtmlStyle = {
  flexDirection: 'column',
  width: 680,
  gap: 6,
}
const buttonRowStyle: HtmlStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
}
const sectionTitleStyle: HtmlStyle = {
  color: '#e5e7eb',
  fontSize: 18,
  fontWeight: 'bold',
}
const resultNameStyle: HtmlStyle = {
  color: '#f9fafb',
  fontWeight: 'bold',
}
const resultDetailStyle: HtmlStyle = {
  color: '#d1d5db',
  fontSize: 13,
}
const overflowRowStyle: HtmlStyle = {
  padding: 8,
  backgroundColor: '#172033',
  borderColor: '#4b5563',
  borderWidth: 1,
  borderRadius: 6,
}

function resultRowStyle(state: ProductionProfileCheckState): HtmlStyle {
  const borderColor = {
    pass: '#10b981',
    info: '#f59e0b',
    fail: '#ef4444',
  }[state]

  return {
    flexDirection: 'column',
    gap: 4,
    padding: 8,
    backgroundColor: '#111827',
    borderColor,
    borderWidth: 1,
    borderRadius: 6,
  }
}
</script>
