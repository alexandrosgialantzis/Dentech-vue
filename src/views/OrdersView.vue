<template>
  <div class="d-flex justify-content-between align-items-center top-wrapper">
    <div class="w-50 search-bar-wrapper h-100 align-self-start">
      <search-component :placeholder="'Αναζήτηση παραγγελίας'" @search="searchOrders" />
    </div>
    <div
      class="mc-1 d-flex justify-content-start w-50 wmax-1200 h-100 align-self-start"
      v-if="user.role === Roles.ADMIN && !isProfile"
    >
      <button
        type="button"
        class="btn btn-outline-success d-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Δημιουργεία παραγγελίας <i class="fa-solid fa-plus ms-1"></i>
      </button>
      <create-order-modal @create="createOrder" :creating="creating" />
    </div>
    <status-filter @change-status="changeStaus" :status="status" />
  </div>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <div class="d-flex">
    <total-count :length="count" :entity="'παραγγελίες'" class="mt-1" v-if="!loading" />
    <div class="d-inline-flex justify-content-end filter mt-1 ms-1" v-if="!loading">
      <p class="mb-0">
        Ταξινόμηση βάση:
        <span class="badge bg-primary fs-6 fw-normal p-2">{{
          !status ? OrderStatus.SEND : status
        }}</span>
      </p>
    </div>
  </div>
  <div
    class="d-flex justify-content-between align-items-center flex-column mt-1"
    v-if="!loading && count"
  >
    <orders-cards :orders="orders" :role="user.role" @pay="handleRepayment" />
  </div>
  <not-found-entity message="Δεν βρέθηκαν παραγγελίες" v-if="!count && !loading" />
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SearchComponent from '../components/SearchComponent.vue'
import { orderHttp } from '../services/orderHttp'
import { ToastHeader, ToastConclusion, OrderStatus, Roles } from '../types/enums'
import { MessageResponse, Order, OrderResponse, OrdersResponse } from '../types/interfaces'
import { useToastStore } from '../stores/toastStore'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import OrdersCards from '../components/order/OrdersCards.vue'
import TotalCount from '../components/TotalCount.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import CreateOrderModal from '../components/modals/CreateOrderModal.vue'
import { AxiosError } from 'axios'
import { useUserStore } from '../stores/userStore'
import { useOrder } from '../composables/useOrder'
import StatusFilter from '../components/order/StatusFilter.vue'

const { isProfile, id } = defineProps<{
  id?: string
  isProfile?: boolean
}>()

const loading = ref(false)
const search = ref<string | OrderStatus>('')
const creating = ref(false)
const status = ref<null | OrderStatus>(null)
const unSortedOrders = ref<Order[]>()

const toast = useToastStore()
const { user } = useUserStore()

const { count, handleOrders, orders } = useOrder()

onMounted(async () => {
  unSortedOrders.value = await getOrders()
  handleOrders(unSortedOrders.value)
})

onBeforeUnmount(() => {
  const elementToRemove = document.querySelector('.modal-backdrop')
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove)
  }
})

const getOrders = async () => {
  loading.value = true
  try {
    let link: string
    if (user.role === Roles.ADMIN) {
      if (isProfile) {
        link = search.value
          ? `/get-orders-per-dentist?search=${search.value}&dentist=${id}`
          : `/get-orders-per-dentist?dentist=${id}`
      } else {
        link = search.value ? `/get-orders?&search=${search.value}` : '/get-orders'
      }
    } else if (user.role === Roles.DENTIST) {
      link = search.value ? `/get-my-orders?&search=${search.value}` : '/get-my-orders'
    }
    const res = await orderHttp.get<OrdersResponse<Order>>(link)
    return res.data.orders
  } catch (e) {
    toast.showToast('Κάτι πήγε στραβά', ToastHeader.ERROR, ToastConclusion.ERROR)
    return null
  } finally {
    loading.value = false
  }
}

const changeStaus = async (st?: OrderStatus) => {
  status.value = st ?? null
  const res = st ? unSortedOrders.value.filter((ord) => ord.status === st) : unSortedOrders.value
  handleOrders(res)
}

const searchOrders = async (srch: string) => {
  search.value = srch ?? null
  const res = await getOrders()
  if (status.value) {
    handleOrders(res.filter((ord) => ord.status === status.value))
  } else {
    handleOrders(res)
  }
}

const createOrder = async (order: Order) => {
  try {
    creating.value = true
    const res = await orderHttp.post<OrderResponse<Order>>('/create-order', order)
    unSortedOrders.value.push(res.data.order)
    handleOrders(unSortedOrders.value)
    const elementToClick = document.querySelector('.btn-close') as HTMLElement | null

    if (elementToClick) {
      elementToClick.click()
    }
  } catch (error) {
    const e = error as AxiosError<MessageResponse>
    toast.showToast(e.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    creating.value = false
  }
}

const handleRepayment = (order: Order) => {
  const i = unSortedOrders.value.findIndex((o) => o._id === order._id)

  if (i !== -1) {
    unSortedOrders.value[i] = order
  }
  handleOrders(unSortedOrders.value)
}
</script>
