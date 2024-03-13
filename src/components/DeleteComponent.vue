<template>
  <div class="d-flex mt-1 justify-content-start">
    <button class="btn btn-danger" @click="deleteEntity" :disabled="loading">
      <span v-if="!loading">{{ content }}<i class="fa-solid fa-trash ms-1"></i></span>
      <button-content v-else />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import ButtonContent from './ButtonContent.vue'

const emit = defineEmits(['handleDelete'])
defineProps<{
  content: string
  loading: boolean
}>()

const deleteEntity = () => {
  emit('handleDelete')
}
</script>
