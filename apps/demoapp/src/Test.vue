<template>
  <Control>
    <Label :text="text"></Label>
  </Control>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref('Hello, World!')
</script>