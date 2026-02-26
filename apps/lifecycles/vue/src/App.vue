<template>
  <VBoxContainer>
    <Label>Issue #6: text children on Label update reactively</Label>
    <Label>{{ labelText }}</Label>

    <Label>Issue #6: text children on Button use generic text fallback</Label>
    <Button @pressed="toggle">{{ buttonText }}</Button>
  </VBoxContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const toggled = ref(false)
const labelText = ref('Label text: OFF')
const buttonText = ref('Toggle (currently OFF)')

onMounted(() => {
  console.log('Component mounted')
})

function toggle() {
  toggled.value = !toggled.value
  labelText.value = `Label text: ${toggled.value ? 'ON' : 'OFF'}`
  buttonText.value = `Toggle (currently ${toggled.value ? 'ON' : 'OFF'})`
}
</script>
