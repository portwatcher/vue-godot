<template>
  <Div
    :style="{
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent: justify,
      alignItems: align,
      gap: 12,
      padding: 16,
      width: 560,
      minHeight: 220,
    }"
  >
    <Div :style="{ flex: 1, padding: 8 }">
      <Label :text="'flex:1 child'" />
    </Div>

    <template v-for="n in 2" :key="n">
      <Div :style="{ alignSelf: n === 1 ? 'center' : 'flex-end', padding: 6 }">
        <Label :text="`fragment child ${n}`" />
      </Div>
    </template>

    <Div :style="{ flex: 2, padding: 8 }">
      <Label :text="'flex:2 child'" />
    </Div>
  </Div>

  <HBoxContainer>
    <Button :text="'Toggle Direction'" @pressed="toggleDirection" />
    <Button :text="'Toggle Wrap'" @pressed="toggleWrap" />
    <Button :text="'Cycle Justify'" @pressed="cycleJustify" />
    <Button :text="'Cycle Align'" @pressed="cycleAlign" />
  </HBoxContainer>

  <Label
    :text="`direction=${direction} wrap=${wrap} justify=${justify} align=${align}`"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const direction = ref<'row' | 'column'>('row')
const wrap = ref<'nowrap' | 'wrap'>('nowrap')
const justify = ref<'flex-start' | 'center' | 'flex-end'>('flex-start')
const align = ref<'flex-start' | 'center' | 'flex-end' | 'stretch'>('stretch')

function toggleDirection() {
  direction.value = direction.value === 'row' ? 'column' : 'row'
}

function toggleWrap() {
  wrap.value = wrap.value === 'nowrap' ? 'wrap' : 'nowrap'
}

function cycleJustify() {
  justify.value =
    justify.value === 'flex-start'
      ? 'center'
      : justify.value === 'center'
        ? 'flex-end'
        : 'flex-start'
}

function cycleAlign() {
  align.value =
    align.value === 'stretch'
      ? 'flex-start'
      : align.value === 'flex-start'
        ? 'center'
        : align.value === 'center'
          ? 'flex-end'
          : 'stretch'
}
</script>
