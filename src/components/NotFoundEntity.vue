<template>
  <div class="d-flex m-auto justify-content-center my-3 flex-row">
    <span class="fs-6 fw-normal d-flex align-items-center">{{ message }}</span>
    <div class="icon-wr d-flex ms-1">
      <i class="fa-solid fa-exclamation text-danger fs-1 m-auto icon"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineProps<{
  message: string
}>()
</script>

<style scoped>
.error-msg-wrapper {
  max-width: 400px;
}

.icon-wr {
  border: solid #dc3545 3px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.icon {
  width: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

::before {
  font-size: 25px;
}
</style>
