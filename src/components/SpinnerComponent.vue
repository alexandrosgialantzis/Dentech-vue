<template>
  <div
    :class="['d-flex justify-content-center align-items-center max-w1550 m-auto', containerClass]"
  >
    <div class="d-flex align-items-center">
      <div class="spinner-border text-success"></div>
      <span class="text-dark ms-2 fs-4">Φόρτωση...</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  useMarginTop: Boolean
})

const containerClass = computed(() => {
  return props.useMarginTop ? 'mt-5' : 'vh-100'
})
</script>
