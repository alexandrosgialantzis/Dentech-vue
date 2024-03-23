<template>
  <div class="row mt-2">
    <user-info :user="userStore.user" />
    <profile-update :user="userStore.user" :loading="updating" @update-profile="update" />
    <private-settings
      :changing="changingPassword"
      :deleting="deleting"
      @delete-profile="deleteAccount"
      @change-password="updatePassword"
    />
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '../stores/userStore'
import UserInfo from '../components/user/UserInfo.vue'
import ProfileUpdate from '../components/user/ProfileUpdate.vue'
import { ref } from 'vue'
import {
  CurrentUser,
  MessageResponse,
  PasswordPayload,
  User,
  UserResponse
} from '../types/interfaces'
import { userHttp } from '../services/userHttp'
import { useProductStore } from '../stores/productStore'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import { AxiosError } from 'axios'
import PrivateSettings from '../components/user/PrivateSettings.vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const products = useProductStore()
const toast = useToastStore()

const router = useRouter()

const deleting = ref(false)
const changingPassword = ref(false)
const updating = ref(false)

const update = async (payload: CurrentUser) => {
  try {
    updating.value = true
    const res = await userHttp.patch<UserResponse<CurrentUser>>(
      `/${userStore.user.userId}/update-user`,
      payload
    )
    userStore.setUser(res.data.user)
    products.isFetched = false
    toast.showToast(res.data.message, ToastHeader.SUCCESS)
  } catch (error) {
    const e = error as AxiosError<MessageResponse>
    toast.showToast(e.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    updating.value = false
  }
}

const deleteAccount = async () => {
  try {
    deleting.value = true
    const res = await userHttp.delete<UserResponse<User>>(`/${userStore.user.userId}/delete-user`)
    toast.showToast(res.data.message, ToastHeader.SUCCESS)
    router.push('/auth')
  } catch (error) {
    const e = error as AxiosError<MessageResponse>
    toast.showToast(e.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    deleting.value = false
  }
}

const updatePassword = async (passwordPayload: PasswordPayload) => {
  try {
    changingPassword.value = true
    const res = await userHttp.patch<UserResponse<User>>(
      `/${userStore.user.userId}/change-password`,
      passwordPayload
    )
    toast.showToast(res.data.message, ToastHeader.SUCCESS)
  } catch (error) {
    const e = error as AxiosError<MessageResponse>
    toast.showToast(e.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    changingPassword.value = false
  }
}
</script>
