<template>
  <Control>
    <Label :text="text"></Label>
  </Control>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref('Hello, World!')

setTimeout(() => {
  text.value = 'Hello, World! 2'
}, 5000)
</script>