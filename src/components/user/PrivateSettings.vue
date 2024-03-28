<template>
  <div class="col-md-7 mt-4">
    <span class="badge bg-danger fs-6 fw-normal p-2 w-100 mb-2"
      >Ρυθμίσεις απορρήτου<i class="fa-solid fa-gear ms-1"></i
    ></span>
    <div class="card border shadow bg-private-settings">
      <div class="card-body">
        <div class="border p-2 rounded bg-white">
          <h4>Αλλαγη κωδικού πρόσβασης</h4>
          <form @submit.prevent="emitChangePassword">
            <div class="mb-3">
              <label class="form-label">Τωρινός κωδίκος</label>
              <input type="password" class="form-control" v-model="oldPassword" />
            </div>
            <div class="mb-3">
              <label class="form-label">Καινούργιος κωδικός</label>
              <input type="password" class="form-control" v-model="newPassword" />
            </div>
            <button class="btn btn-update" type="submit" :disabled="deleting || changing">
              <button-content v-if="changing" />
              <span v-else>Aλλαγή κωδίκου<i class="fa-solid fa-pencil ms-1"></i></span>
            </button>
          </form>
        </div>
        <div class="border mt-5 p-2 rounded bg-white">
          <h4 class="text-danger">Διαγραφή λογαριασμού</h4>
          <button
            type="button"
            class="btn btn-danger w-100"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            :disabled="deleting"
          >
            <span v-if="!deleting">Διαγραφή<i class="fa-solid fa-trash ms-1"></i></span>
            <button-content v-else />
          </button>
          <delete-modal
            @delete="emitDelete"
            :content="'Σίγουρα θέλετε να διαγράψετε το λογαριασμό σας;'"
            :deleting="deleting"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import ButtonContent from '../ButtonContent.vue'
import DeleteModal from '../modals/DeleteModal.vue'

onBeforeUnmount(() => {
  const elementToRemove = document.querySelector('.modal-backdrop')
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove)
  }
})

defineProps<{
  changing: boolean
  deleting: boolean
}>()

const oldPassword = ref('')
const newPassword = ref('')

const emit = defineEmits(['change-password', 'delete-profile'])

const emitDelete = () => {
  emit('delete-profile')
}

const emitChangePassword = () => {
  const payload = {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  }

  emit('change-password', payload)
}
</script>
