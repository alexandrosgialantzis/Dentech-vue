<template>
  <button type="button" class="btn btn-update" @click="handlePay" :disabled="paying">
    <span v-if="!paying"
      >{{ content ?? ''
      }}<i :class="['fa-solid fa-circle-dollar-to-slot', `${content ? 'ms-1' : ''}`]"></i
    ></span>
    <button-content v-else />
  </button>
</template>

<script setup lang="ts">
import ButtonContent from './ButtonContent.vue'

defineProps<{
  paying: boolean
  content?: string
}>()

const emit = defineEmits(['pay'])

const handlePay = () => {
  emit('pay')
}
</script>
