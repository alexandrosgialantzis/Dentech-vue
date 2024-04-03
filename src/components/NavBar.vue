<template>
  <nav class="navbar navbar-expand-lg navbar-light shadow p-3">
    <div class="container-fluid max-w1550">
      <router-link class="navbar-brand" to="/">Dentech</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/' ? 'border-bottom border-light' : ''}`
              ]"
              to="/"
              >Aρχική<i class="fa-solid fa-house ms-1"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/users' ? 'border-bottom border-light' : ''}`
              ]"
              to="/users"
              v-if="role === Roles.ADMIN"
              >Χρήστες<i class="fa-solid fa-users ms-1"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/orders' ? 'border-bottom border-light' : ''}`
              ]"
              to="/orders"
              v-if="role === Roles.ADMIN"
              >Παραγγελίες<i class="fa-solid fa-truck-fast ms-1"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/products' ? 'border-bottom border-light' : ''}`
              ]"
              to="/products"
              v-if="role === Roles.ADMIN"
              >Προιόντα<i class="fa-solid fa-tooth ms-1"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/my-orders' ? 'border-bottom border-light' : ''}`
              ]"
              to="/my-orders"
              v-if="role === Roles.DENTIST"
              >Oι Παραγγελίες μου<i class="fa-solid fa-truck-fast ms-1"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <router-link
              :class="[
                'nav-link',
                'text-light',
                `${path === '/my-profile' ? 'border-bottom border-light' : ''}`
              ]"
              to="/my-profile"
              >Προφίλ<i class="fa-solid fa-user ms-1"></i
            ></router-link>
          </li>
        </ul>
        <button type="button" class="btn btn-danger" @click="logout" :disabled="loading">
          <button-content v-if="loading" />
          <span v-else>Αποσύνδεση <i class="fa-solid fa-arrow-right-from-bracket"></i></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { authHttp } from '../services/authHttp'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { MessageResponse } from '../types/interfaces'
import { useToastStore } from '../stores/toastStore'
import { useUserStore } from '../stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import ButtonContent from './ButtonContent.vue'
import { Roles } from '../types/enums'

const toast = useToastStore()
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const role = computed(() => userStore.user.role)
const path = computed(() => route.path)

const logout = async () => {
  loading.value = true

  try {
    const res = await authHttp.get<MessageResponse>('/logout')
    toast.showToast(res.data.message, ToastHeader.SUCCESS, '')
    userStore.logout()
    localStorage.removeItem('token')

    router.push('/auth')
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}
</script>
