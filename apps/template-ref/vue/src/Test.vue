<template>
  <HBoxContainer ref="hbox">
    <Button :text="'Click me'" @pressed="handleClick"></Button>
    <Label :text="String(count)"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
import type { HBoxContainer } from 'godot'
import { onMounted, ref } from 'vue'

const hbox = ref<HBoxContainer | null>(null)
const count = ref(1)

const handleClick = () => {
  count.value = count.value + 1
}

onMounted(() => {
  console.log('mounted hbox =', hbox.value)
  console.log(
    'has add_theme_constant_override =',
    typeof hbox.value?.add_theme_constant_override,
  )

  // JSB currently hangs on add_theme_constant_override(...) in this setup.
  // Use the generic property path as a stable demo for template refs.
  hbox.value?.set?.('theme_override_constants/separation', 100)

  console.log(
    'has override?',
    hbox.value?.has_theme_constant_override?.('separation'),
  )
  console.log(
    'theme separation =',
    hbox.value?.get_theme_constant?.('separation'),
  )
})
</script>
