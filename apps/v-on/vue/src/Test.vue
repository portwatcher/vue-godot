<template>
  <HBoxContainer>
    <Button :text="'Click me'" @pressed="handleClick"></Button>
    <Label :text="count"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)

const handleClick = () => {
  count.value = count.value + 1
}
</script>