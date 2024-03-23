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
            class="btn btn-outline-danger w-100"
            :disabled="deleting || changing"
            @click="emitDelete"
          >
            <button-content :use-red="true" v-if="deleting" /><span v-else
              >Διαγραφή <i class="fa-solid fa-trash"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ButtonContent from '../ButtonContent.vue'

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
