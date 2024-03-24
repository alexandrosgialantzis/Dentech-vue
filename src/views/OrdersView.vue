<template>
  <div class="d-flex justify-content-between align-items-center top-wrapper">
    <div class="w-50 search-bar-wrapper">
      <search-component :placeholder="'Αναζήτηση παραγγελίας'" @search="searchOrders" />
    </div>
    <div class="mc-1 d-flex justify-content-start w-50 wmax-1200" v-if="user.role === Roles.ADMIN">
      <button
        type="button"
        class="btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Δημιουργεία παραγγελίας <i class="fa-solid fa-plus"></i>
      </button>
      <create-order-modal @create="createOrder" :creating="creating" />
    </div>
    <div class="input-group justify-content-end flex-column wmax-1200 mc-1 btn-filter-group">
      <div class="d-grid">
        <span class="d-flex align-items-center me-1">Ταξινόμηση βάση κατάστασης: </span>
        <div class="btn-group flex-wrap">
          <button
            :class="['btn', `btn${!status ? '' : '-outline'}-secondary`]"
            @click="changeStaus()"
            :disabled="!status"
          >
            Όλες
          </button>
          <button
            :class="['btn', `btn${status === OrderStatus.NOT_SEND ? '' : '-outline'}-secondary`]"
            @click="changeStaus(OrderStatus.NOT_SEND)"
            :disabled="status === OrderStatus.NOT_SEND"
          >
            Μη απεσταλμένες <i class="fa-solid fa-x ms-1 text-danger"></i>
          </button>
          <button
            :class="['btn', `btn${status === OrderStatus.SEND ? '' : '-outline'}-secondary`]"
            @click="changeStaus(OrderStatus.SEND)"
            :disabled="status === OrderStatus.SEND"
          >
            Aπεσταλμένες <i class="fa-solid fa-check ms-1 text-success"></i>
          </button>
        </div>
      </div>
      <div>
        <p class="mb-0">
          Ταξινόμηση βάση:
          <span class="badge bg-primary fs-6 fw-normal mt-1 p-2">{{
            !status ? OrderStatus.NOT_SEND : status
          }}</span>
        </p>
      </div>
    </div>
  </div>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <total-count :length="count" :entity="'παραγγελίες'" class="mt-2" v-if="!loading" />
  <div
    class="d-flex justify-content-between align-items-center flex-column mt-3"
    v-if="!loading && count"
  >
    <orders-cards :orders="orders" :role="user.role" />
  </div>
  <not-found-entity message="Δεν βρέθηκαν παραγγελίες" v-if="!count && !loading" />
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SearchComponent from '../components/SearchComponent.vue'
import { orderHttp } from '../services/orderHttp'
import { ToastHeader, ToastConclusion, OrderStatus, Roles } from '../types/enums'
import {
  GroupedOrdersResult,
  MessageResponse,
  Order,
  OrderResponse,
  OrdersResponse
} from '../types/interfaces'
import { useToastStore } from '../stores/toastStore'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import OrdersCards from '../components/order/OrdersCards.vue'
import TotalCount from '../components/TotalCount.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import CreateOrderModal from '../components/modals/CreateOrderModal.vue'
import { AxiosError } from 'axios'
import { useUserStore } from '../stores/userStore'

const loading = ref(false)
const orders = ref<null | GroupedOrdersResult>(null)
const count = ref<number>(0)
const search = ref<string | OrderStatus>('')
const creating = ref(false)
const status = ref<null | OrderStatus>(null)
const fetchedOrders = ref<Order[]>()

const toast = useToastStore()
const { user } = useUserStore()

onMounted(async () => {
  fetchedOrders.value = await getOrders()
  handleOrders(fetchedOrders.value)
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
      link = search.value ? `/get-orders?&search=${search.value}` : '/get-orders'
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

const groupOrdersByMonth = (orders: Order[]): GroupedOrdersResult => {
  const grouped = orders.reduce(
    (acc, order) => {
      const statusBased =
        status.value === OrderStatus.SEND && status.value ? order.sendDate : order.takenDate
      const date = new Date(statusBased)
      const monthYear = `${date.toLocaleString('el-GR', { month: 'long' })} ${date.getFullYear()}`

      if (!acc.groupedOrders[monthYear]) {
        acc.groupedOrders[monthYear] = []
        acc.sortedMonths.push(monthYear)
      }

      acc.groupedOrders[monthYear].push(order)

      return acc
    },
    { groupedOrders: {} as Record<string, Order[]>, sortedMonths: [] as string[] }
  )

  grouped.sortedMonths
    .sort((a, b) => {
      const getYearMonth = (str: string) => {
        const [monthName, year] = str.split(' ')
        const month = new Date(`${monthName} 1 ${year}`).getMonth()
        return new Date(Number(year), month).getTime()
      }

      return getYearMonth(b) - getYearMonth(a)
    })
    .reverse()

  return grouped
}

const changeStaus = async (st?: OrderStatus) => {
  search.value = st ?? null
  status.value = st ?? null
  const res = await getOrders()
  handleOrders(res)
}

const searchOrders = async (srch: string) => {
  search.value = srch ?? null
  const res = await getOrders()
  handleOrders(res)
}

const createOrder = async (order: Order) => {
  try {
    creating.value = true
    const res = await orderHttp.post<OrderResponse<Order>>('/create-order', order)
    fetchedOrders.value.push(res.data.order)
    handleOrders(fetchedOrders.value)
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

const handleOrders = (res: Order[]) => {
  if (res.length) {
    orders.value = groupOrdersByMonth(res)
    count.value = res.length
  } else {
    orders.value = {} as GroupedOrdersResult
    count.value = res.length
  }
}
</script>
