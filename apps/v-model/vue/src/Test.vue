<template>
  <HBoxContainer>
    <TextEdit :text="text"></TextEdit>
    <Label :text="text"></Label>
  </HBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
</script>
