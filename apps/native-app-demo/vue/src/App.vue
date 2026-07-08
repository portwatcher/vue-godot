<template>
  <SafeAreaView
    class="native-app-shell"
    :edges="['top', 'right', 'bottom', 'left']"
    :fallback-insets="{ top: 10, right: 10, bottom: 10, left: 10 }"
    :content-style="{ gap: 10 }"
  >
    <router-view></router-view>
  </SafeAreaView>
</template>

<script setup lang="ts"></script>
