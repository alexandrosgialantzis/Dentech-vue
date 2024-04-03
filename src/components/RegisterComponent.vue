<template>
  <form class="auth-form">
    <h4 class="mb-3">Εγγραφή <i class="fa-solid fa-user-plus text-success"></i></h4>
    <div class="mb-3">
      <label for="name" class="form-label"
        >Ονοματεπώνυμο <span class="text-danger fs-6">*</span></label
      >
      <input type="text" class="form-control" id="name" v-model="name" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">E-mail <span class="text-danger fs-6">*</span></label>
      <input type="text" class="form-control" id="email" v-model="email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label"
        >Κωδικός <span class="text-danger fs-6">*</span></label
      >
      <input type="password" class="form-control" id="password" v-model="password" />
    </div>
    <div class="mb-3">
      <label for="cellPhone" class="form-label">Κινητό τηλέφωνο</label>
      <input type="number" class="form-control" id="cellPhone" v-model="cellPhone" />
      <div class="form-text">Δέχεται μόνο αριθμούς.</div>
    </div>
    <div class="mb-3">
      <label for="telephone" class="form-label">Σταθερό τηλέφωνο</label>
      <input type="number" class="form-control" id="telephone" v-model="telephone" />
      <div class="form-text">Δέχεται μόνο αριθμούς.</div>
    </div>
    <button type="button" class="btn btn-success w-100" @click="register" :disabled="loading">
      <button-content v-if="loading" />
      <span v-else>Εγγραφή</span>
    </button>
    <p class="form-text"><span class="text-danger fs-6">*</span> Αναγκαία πεδία.</p>
    <div class="d-flex align-items-center flex-row justify-content-start mt-3 auth-footer-wrapper">
      <p class="mb-0">Έχετε λογαριασμό;</p>
      <a class="text-primary mx-1" @click="toggleForm">Πατήστε εδώ</a>
    </div>
  </form>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { authHttp } from '../services/authHttp'
import { MessageResponse, CurrentUser, UserPayload, UserResponse } from '../types/interfaces'
import { AxiosError } from 'axios'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { useToastStore } from '../stores/toastStore'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import ButtonContent from './ButtonContent.vue'

const emit = defineEmits(['toggleFormsEmit'])

const toast = useToastStore()
const userStore = useUserStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const name = ref('')
const cellPhone = ref<string | number>('')
const telephone = ref<string | number>('')
const loading = ref(false)

const toggleForm = () => {
  emit('toggleFormsEmit')
}

const register = async () => {
  loading.value = true
  const payload: UserPayload = {
    email: email.value,
    password: password.value,
    fullName: name.value
  }

  if (telephone.value && typeof telephone.value === 'number') {
    payload.telephone = telephone.value
  }
  if (cellPhone.value && typeof cellPhone.value === 'number') {
    payload.cellPhone = cellPhone.value
  }

  try {
    const res = await authHttp.post<UserResponse<CurrentUser>>('/register', payload)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, '')
    userStore.setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
    router.push('/')
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}
</script>
