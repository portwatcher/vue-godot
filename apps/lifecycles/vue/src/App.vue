<template>
  <Label :text="'Hello from Vue + Godot!'"></Label>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})
</script>
