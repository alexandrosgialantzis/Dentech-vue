<template>
  <div class="col-md-5 mt-4">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Ενημέρωση πληροφοριών προφίλ <i class="fa-solid fa-arrow-rotate-right"></i
    ></span>
    <div class="card border shadow">
      <div class="card-body">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label class="form-label">E-mail</label>
            <input type="text" class="form-control" v-model="email" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ονοματεπώνυμο</label>
            <input type="text" class="form-control" v-model="fullName" />
          </div>
          <div class="mb-3">
            <label class="form-label">Κινητό τηλέφωνο</label>
            <input type="number" class="form-control" v-model="phone" />
            <div class="form-text">Δέχεται μόνο αριθμούς.</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Σταθερό τηλέφωνο</label>
            <input type="number" class="form-control" v-model="telephone" />
            <div class="form-text">Δέχεται μόνο αριθμούς.</div>
          </div>
          <button class="btn btn-update w-100" type="submit" :disabled="loading">
            <button-content v-if="loading" />
            <span v-else>Ενημέρωση<i class="fa-solid fa-pencil ms-1"></i></span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CurrentUser } from '../../types/interfaces'
import ButtonContent from '../ButtonContent.vue'

const { user } = defineProps<{
  user: CurrentUser
  loading: boolean
}>()

const emit = defineEmits(['update-profile'])

const email = ref(user.email)
const fullName = ref(user.fullName)
const phone = ref(user.cellPhone ?? '')
const telephone = ref(user.telephone ?? '')

const handleUpdate = () => {
  const payload = {
    email: email.value,
    fullName: fullName.value,
    telephone: telephone.value,
    cellPhone: phone.value
  } as CurrentUser

  emit('update-profile', payload)
}
</script>
