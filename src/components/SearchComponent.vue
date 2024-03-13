<template>
  <div class="input-group bar">
    <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
    <input
      type="text"
      class="form-control"
      :placeholder="`${placeholder}...`"
      v-model="searchTerm"
      @input="search"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  placeholder: string
}>()

const emit = defineEmits(['search'])

const searchTerm = ref('')

const search = () => {
  emit('search', searchTerm.value)
}
</script>
