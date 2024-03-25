<template>
  <spinner-component v-if="loading" :useMarginTop="true" />
  <div class="row" v-if="!loading && user">
    <div class="col-12">
      <user-info :user="user" />
      <change-role :roles="roles" @update-role="handleRoleChange" :loading="loadingChangeRole" />
    </div>
    <div class="col-12">
      <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
        >Παραγγελίες χρήστη <i class="fa-solid fa-truck-fast ms-1"></i
      ></span>
      <single-user-orders
        v-if="user?.role === Roles.DENTIST"
        :orders="orders"
        :loading="loading"
        :id="user?._id"
      />
    </div>
  </div>
  <not-found-entity :message="'Δεν βρέθηκε ο χρήστης'" v-if="!loading && !user" />
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { userHttp } from '../services/userHttp'
import { MessageResponse, Order, OrdersResponse, User, UserResponse } from '../types/interfaces'
import { Roles, ToastConclusion, ToastHeader } from '../types/enums'
import { useToastStore } from '../stores/toastStore'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import { orderHttp } from '../services/orderHttp'
import ChangeRole from '../components/user/ChangeRole.vue'
import UserInfo from '../components/user/UserInfo.vue'
import { AxiosError } from 'axios'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import SingleUserOrders from '../components/user/SingleUserOrders.vue'

const route = useRoute()
const toast = useToastStore()

const userId = ref('')
const user = ref<null | User>(null)
const loading = ref(false)
const loadingChangeRole = ref(false)
const orders = ref<null | Order[]>(null)

onMounted(async () => {
  userId.value = route.params.id as string
  await fetchData(userId.value)
})

const isDoc = computed(() => user.value?.role === Roles.DENTIST)
const roles = computed(() => Object.values(Roles))

const fetchData = async (id: string) => {
  loading.value = true
  try {
    await getSingleUser(id)
    if (isDoc.value) {
      await getOrdersByDen(id)
    }
  } catch (e) {
    toast.showToast('Κάτι πηγέ λαθός!', ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}

const getSingleUser = async (id: string) => {
  try {
    const res = await userHttp.get<UserResponse<User>>(`/${id}/get-single-user`)
    user.value = res.data.user
  } catch (e) {
    toast.showToast('Κάτι πηγέ λαθός!', ToastHeader.ERROR, ToastConclusion.ERROR)
  }
}

const getOrdersByDen = async (id: string) => {
  try {
    const res = await orderHttp.get<OrdersResponse<Order>>(`/get-orders-per-dentist?dentist=${id}`)
    orders.value = res.data.orders
  } catch (e) {
    toast.showToast(
      'Κάτι πηγέ λαθός σχετικά με τις παραγγελείες!',
      ToastHeader.ERROR,
      ToastConclusion.ERROR
    )
  }
}

const handleRoleChange = async (newRole: Roles) => {
  loadingChangeRole.value = true
  try {
    const body = { role: newRole }
    const res = await userHttp.patch<MessageResponse>(`/${userId.value}/change-role`, body)
    user.value.role = newRole
    toast.showToast(res.data.message, ToastHeader.SUCCESS)
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loadingChangeRole.value = false
  }
}
</script>

<style scoped>
.tab-content {
  width: 75%;
}

@media (max-width: 850px) {
  .button-wrapper {
    width: 100% !important;
  }

  .tab-content {
    width: 100%;
  }
}
</style>
../components/SingleUserInfo.vue../components/SingleUserOrders.vue
../components/user/SingleUserInfo.vue../components/user/SingleUserOrders.vue
../components/user/ChangeRole.vue ../components/user/UserInfo.vue
