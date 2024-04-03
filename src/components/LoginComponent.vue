<template>
  <form>
    <h4 class="mb-3">Σύνδεση <i class="fa-solid fa-right-to-bracket text-success"></i></h4>
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <input type="text" class="form-control" id="email" v-model="email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Κωδικός</label>
      <input type="password" class="form-control" id="password" v-model="password" />
    </div>
    <button type="button" class="btn btn-success w-100" @click="login" :disabled="loading">
      <button-content v-if="loading" />
      <span v-else>Σύνδεση</span>
    </button>
    <div class="d-flex align-items-center flex-row justify-content-start mt-3 auth-footer-wrapper">
      <p class="mb-0">Δεν έχετε λογαριασμό;</p>
      <a class="text-primary mx-1" @click="toggleForm">Πατήστε εδώ</a>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authHttp } from '../services/authHttp'
import { MessageResponse, CurrentUser, UserResponse } from '../types/interfaces'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { AxiosError } from 'axios'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import ButtonContent from './ButtonContent.vue'

const emit = defineEmits(['toggleFormsEmit'])

const toast = useToastStore()
const userStore = useUserStore()
const router = useRouter()

const password = ref('')
const email = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  const payload = {
    email: email.value,
    password: password.value
  }

  try {
    const res = await authHttp.post<UserResponse<CurrentUser>>('/login', payload)
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

const toggleForm = () => {
  emit('toggleFormsEmit')
}
</script>
