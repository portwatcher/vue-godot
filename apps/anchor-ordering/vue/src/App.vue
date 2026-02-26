<template>
  <VBoxContainer>
    <Label text="Anchor insertion demo (auto toggles every 1.2s)" />
    <Label :text="`tick=${tick} showMiddle=${showMiddle}`" />

    <Label text="v-if sequence (expected: A, [B], C)" />
    <Label text="A" />
    <Label v-if="showMiddle" text="B" />
    <Label text="C" />

    <Label text="keyed reorder sequence (toggles A/B before C)" />
    <Label
      v-for="item in keyedOrder"
      :key="item"
      :text="`item ${item}`"
    />
  </VBoxContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const tick = ref(0)
const showMiddle = ref(false)
const swapAB = ref(false)

const keyedOrder = computed(() => (swapAB.value ? ['B', 'A', 'C'] : ['A', 'B', 'C']))

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    tick.value += 1
    showMiddle.value = !showMiddle.value
    swapAB.value = !swapAB.value

    console.log(
      `[anchor-ordering] tick=${tick.value} v-if=${showMiddle.value ? 'A,B,C' : 'A,C'} keyed=${keyedOrder.value.join(',')}`,
    )
  }, 1200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
