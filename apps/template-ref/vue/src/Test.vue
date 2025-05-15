<template>
  <HBoxContainer ref="hbox">
    <Button :text="'Click me'" @pressed="handleClick"></Button>
    <Label :text="count"></Label>
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
  hbox.value?.add_theme_constant_override('separation', 100)
})
</script>
