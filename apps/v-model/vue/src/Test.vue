<template>
  <VBoxContainer>
    <Label text="v-model component wrapper demo"></Label>
    <model-line-edit v-model="text"></model-line-edit>
    <Button text="Set sample" @pressed="setSample"></Button>
    <Label :text="`Model value: ${text || '(empty)'}`"></Label>
  </VBoxContainer>
</template>

<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

const ModelLineEdit = defineComponent({
  name: 'ModelLineEdit',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
  },
  setup(props, { emit }) {
    function onTextChanged(value: string) {
      emit('update:modelValue', value)
    }

    return () =>
      h('LineEdit', {
        text: props.modelValue,
        placeholder_text: 'Type to update v-model',
        onTextChanged,
      })
  },
})

const text = ref('')

function setSample() {
  text.value = 'Updated from button'
}
</script>
