<template>
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger" id="staticBackdropLabel">Διαγραφή</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">{{ content }}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Άκυρο</button>
          <button class="btn btn-danger" @click="deleteEntity" :disabled="deleting">
            <span v-if="!deleting">Διαγραφή<i class="fa-solid fa-trash ms-1"></i></span>
            <button-content v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonContent from '../ButtonContent.vue'

defineProps<{
  content: string
  deleting: boolean
}>()

const emit = defineEmits(['delete'])

const deleteEntity = () => {
  emit('delete')
}
</script>
