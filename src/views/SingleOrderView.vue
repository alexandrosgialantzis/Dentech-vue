<template>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <div class="max-w1550" v-if="!loading && order">
    <delete-component
      :content="'Διαγραφή παραγγελίας'"
      @handle-delete="handleDelete"
      :loading="deleting"
    />
    <div class="row justify-content-between">
      <order-general :order="order" />
      <order-dentist :dentist="order.dentist" :id="user.userId" />
      <order-products :products="order.products" :role="user.role" />
      <order-update
        :order="order"
        :products="products"
        @order-updated="handleOrderUpdated"
        v-if="user.role === Roles.ADMIN"
      />
    </div>
  </div>
  <not-found-entity v-if="!loading && !order" :message="'Δεν βρέθηκε η παραγγελία'" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { orderHttp } from '../services/orderHttp'
import { Order, OrderResponse, Product } from '../types/interfaces'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '../stores/toastStore'
import { Roles, ToastConclusion, ToastHeader } from '../types/enums'
import { useProductStore } from '../stores/productStore'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import OrderGeneral from '../components/order/OrderGeneral.vue'
import OrderDentist from '../components/order/OrderDentist.vue'
import OrderProducts from '../components/order/OrderProducts.vue'
import OrderUpdate from '../components/order/OrderUpdate.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import DeleteComponent from '../components/DeleteComponent.vue'
import { useOrder } from '../composables/useOrder'
import { useUserStore } from '../stores/userStore'

const orderId = ref('')
const order = ref<null | Order>(null)
const loading = ref(false)
const products = ref<Product[] | null>(null)
const deleting = ref(false)

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const product = useProductStore()

const { user } = useUserStore()
const { deleteOrder } = useOrder()

onMounted(async () => {
  orderId.value = route.params.id as string
  await getSingleOrder(orderId.value)
  if (!product.isFetched && user.role === Roles.ADMIN) {
    await product.fetchProducts()

    if (product.error) {
      toast.showToast(
        'Κάτι πηγέ λαθός σχετικά με τα προιόντα!',
        ToastHeader.ERROR,
        ToastConclusion.ERROR
      )
    }
  }

  products.value = product?.products
})

const getSingleOrder = async (id: string) => {
  loading.value = true
  try {
    const res = await orderHttp.get<OrderResponse<Order>>(`/${id}/get-single-order`)
    order.value = res.data.order
  } catch (e) {
    toast.showToast('Δεν βρέθηκε η παραγγελία!', ToastHeader.ERROR, ToastConclusion.ERROR)
    router.push('/not-found')
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  deleting.value = true
  try {
    await deleteOrder(orderId.value)
    router.push('/orders')
  } catch (error) {
    console.error('Κάτι πήγε λάθος σχετικά με τη διαγραφή')
  } finally {
    deleting.value = false
  }
}

const handleOrderUpdated = (updatedOrder: Order) => {
  order.value = updatedOrder
}
</script>
