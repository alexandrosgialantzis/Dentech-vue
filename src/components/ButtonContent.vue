<template>
  <div class="d-flex justify-content-center align-items-center">
    <div :class="['spinner-btn spinner-border', `text-${spinnerColor ? 'danger' : 'ligth'}`]">
      <span class="visually-hidden"></span>
    </div>
    <span class="ms-1">Φόρτωση...</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const { useRed } = defineProps<{
  useRed?: boolean
}>()

const spinnerColor = ref(useRed ?? false)
</script>
