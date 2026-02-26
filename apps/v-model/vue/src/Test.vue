<template>
  <VBoxContainer>
    <TextEdit :text="text"></TextEdit>
    <Label :text="text"></Label>
  </VBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
</script>
