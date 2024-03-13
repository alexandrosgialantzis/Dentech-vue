<template>
  <div v-if="toast.show" class="position-fixed bottom-0 end-0 p-3 toast-wrapper">
    <div class="toast show">
      <div :class="['toast-header', toast.headerColor]">
        <strong class="me-auto text-light">{{ toast.header }}</strong>
        <small class="text-light">{{ toast.conclusion }}</small>
        <button type="button" class="btn-close" @click="toast.resetToast()"></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toastStore'

const toast = useToastStore()
</script>

<style>
.toast-wrapper {
  z-index: 12;
  display: block !important;
}

.toast:not(.showing):not(.show) {
  opacity: 1;
}

.toast-body {
  opacity: 1 !important;
}
</style>
