<template>
  <VBoxContainer>
    <Label
      :text="'Issue #3: @text_changed should map to Godot text_changed'"
    ></Label>
    <LineEdit
      :placeholder_text="'Type here (snake_case signal via @text_changed)'"
      @text_changed="onSnakeCaseTextChanged"
    />
    <Label
      :text="`snake_case handler fired: ${snakeCaseCount} (last: ${snakeCaseLast})`"
    ></Label>

    <Label
      :text="'Issue #4: single/array/off handler patching + callable bookkeeping'"
    ></Label>
    <LineEdit
      :placeholder_text="'Type here (dynamic onTextChanged handler)'"
      :onTextChanged="
        mode === 'off'
          ? null
          : mode === 'array'
            ? [onDynamicPrimary, onDynamicSecondary]
            : onDynamicPrimary
      "
    />
    <HBoxContainer>
      <Button :text="'Single'" @pressed="() => (mode = 'single')" />
      <Button :text="'Array'" @pressed="() => (mode = 'array')" />
      <Button :text="'Off'" @pressed="() => (mode = 'off')" />
      <Button :text="'Rerender'" @pressed="forceRerender" />
      <Button :text="'Reset'" @pressed="resetCounters" />
    </HBoxContainer>
    <Label :text="`mode=${mode} rerenders=${rerenders}`"></Label>
    <Label
      :text="`primary=${dynamicPrimaryCount} secondary=${dynamicSecondaryCount}`"
    ></Label>
    <Label :text="`last dynamic text: ${dynamicLast}`"></Label>
  </VBoxContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const snakeCaseCount = ref(0)
const snakeCaseLast = ref('')

const mode = ref<'single' | 'array' | 'off'>('single')
const rerenders = ref(0)
const dynamicPrimaryCount = ref(0)
const dynamicSecondaryCount = ref(0)
const dynamicLast = ref('')

function onSnakeCaseTextChanged(text: string) {
  snakeCaseCount.value += 1
  snakeCaseLast.value = text
}

function onDynamicPrimary(text: string) {
  dynamicPrimaryCount.value += 1
  dynamicLast.value = text
}

function onDynamicSecondary(text: string) {
  dynamicSecondaryCount.value += 1
  dynamicLast.value = text
}

function forceRerender() {
  rerenders.value += 1
}

function resetCounters() {
  snakeCaseCount.value = 0
  dynamicPrimaryCount.value = 0
  dynamicSecondaryCount.value = 0
  snakeCaseLast.value = ''
  dynamicLast.value = ''
}
</script>
