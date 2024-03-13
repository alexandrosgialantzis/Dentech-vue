<template>
  <div class="d-flex justify-content-between align-items-center top-wrapper">
    <div class="w-50 search-bar-wrapper">
      <search-component @search="search" :placeholder="'Αναζητήστε χρήστες'" />
    </div>
    <div class="mc-1 d-flex justify-content-start w-50 wmax-1200">
      <button
        type="button"
        class="btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Δημιουργεία χρήστη <i class="fa-solid fa-user-plus"></i>
      </button>
      <create-user-modal @create="createUser" :loading="creating" />
    </div>
    <div class="input-group justify-content-end wmax-1200 mc-1">
      <span class="d-flex align-items-center me-1">Χρήστες βάση ρόλου : </span>
      <div class="btn-group flex-wrap">
        <button class="btn btn-outline-secondary" @click="filterByRole('dentist')">
          {{ Roles.DENTIST }} <i class="fa-solid fa-stethoscope"></i>
        </button>
        <button class="btn btn-outline-secondary" @click="filterByRole('user')">
          {{ Roles.UNCATEGORIZED }} <i class="fa-solid fa-user ms-1"></i>
        </button>
        <button class="btn btn-outline-secondary" @click="filterByRole('admin')">
          Διαχειριστές <i class="fa-solid fa-crown ms-1"></i>
        </button>
        <button class="btn btn-outline-secondary" @click="filterByRole('')">
          Όλοι <i class="fa-solid fa-users ms-1"></i>
        </button>
      </div>
    </div>
  </div>
  <spinner-component v-if="loading" :useMarginTop="true" />
  <div class="d-flex flex-column justify-content-center mt-2" v-if="!loading && users?.length">
    <total-count :length="users.length" :entity="'χρήστες'" />
    <div
      :class="[
        'd-flex flex-row flex-wrap',
        `justify-content-${users.length > 2 ? 'between' : 'center'}`
      ]"
    >
      <users-card :users="users" />
    </div>
  </div>
  <not-found-entity :message="'Δεν βρέθηκαν χρήστες'" v-if="!loading && !users?.length" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { userHttp } from '../services/userHttp'
import {
  MessageResponse,
  User,
  UserPayload,
  UserResponse,
  UsersResponse
} from '../types/interfaces'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import { useToastStore } from '../stores/toastStore'
import { Roles, ToastConclusion, ToastHeader } from '../types/enums'
import TotalCount from '../components/TotalCount.vue'
import UsersCard from '../components/user/UsersCard.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import SearchComponent from '../components/SearchComponent.vue'
import CreateUserModal from '../components/modals/CreateUserModal.vue'
import { AxiosError } from 'axios'

onMounted(async () => {
  await getUsers()
})

onBeforeUnmount(() => {
  const elementToRemove = document.querySelector('.modal-backdrop')
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove)
  }
})

const users = ref<null | User[]>(null)
const loading = ref(false)
const creating = ref(false)

const toast = useToastStore()

const getUsers = async (search = '') => {
  loading.value = true
  const link = `/get-users${search ? `?searchString=${search}` : ''}`
  try {
    const res = await userHttp.get<UsersResponse<User>>(link)
    users.value = res.data.users.reverse()
  } catch (e) {
    toast.showToast('Kατι πήγε στραβά, προσπαθήστε παλί', ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}

const search = async (search: string) => {
  await getUsers(search)
}

const filterByRole = async (role: string) => {
  await getUsers(role)
}

const createUser = async (user: UserPayload) => {
  try {
    creating.value = true
    const res = await userHttp.post<UserResponse<User>>('/create-user', user)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, '')
    users.value.unshift(res.data.user)
    const elementToClick = document.querySelector('.btn-close') as HTMLElement | null

    if (elementToClick) {
      elementToClick.click()
    }
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.user-list {
  overflow-y: auto;
  max-height: 800px;
}

.mc-1 {
  margin-left: 10px;
}

@media (max-width: 1500px) {
  .top-wrapper {
    flex-wrap: wrap;
  }

  .input-group {
    justify-content: start !important;
  }

  .wmax-1200 {
    width: 100% !important;
  }

  .mc-1 {
    margin-top: 10px !important;
    margin-left: 0px;
  }
}

.search-bar-wrapper {
  min-width: 270px;
}
</style>
