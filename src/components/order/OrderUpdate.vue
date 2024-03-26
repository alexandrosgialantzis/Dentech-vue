<template>
  <spinner-component v-if="doctors.loading" :use-margin-top="true" />
  <div class="col-12 p-2 mb-2">
    <span class="badge bg-warning fs-6 fw-normal p-2 w-100 mb-2"
      >Ενημέρωση παραγγελίας<i class="fa-solid fa-arrow-rotate-right ms-1"></i
    ></span>
    <div class="card shadow">
      <div class="card-body d-flex flex-wrap justify-content-between">
        <div class="row g-3" v-if="!doctors.loading && docs?.length">
          <div class="col-md-4">
            <label class="form-label">Ημ/νία παραλαβής:</label>
            <input type="text" class="form-control" v-model="takenDateToString" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Ημ/νία αποστολής:</label>
            <input type="text" class="form-control" v-model="sendDateToString" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Εξοφλημένο ποσό</label>
            <input type="text" class="form-control" v-model="localOrder.paid" />
          </div>
          <div class="col-12" v-if="products?.length">
            <label class="form-label">Προϊόντα:</label>
            <div class="w-100">
              <div class="radio-check-wrapper" v-for="(product, index) in products" :key="index">
                <div class="form-check form-check-inline form-check mb-0 mx-0">
                  <input
                    class="form-check-input text-capitalize"
                    type="checkbox"
                    :value="product._id"
                    :checked="isProductSelected(product._id)"
                    @change="handleCheckboxChange($event, product._id)"
                  />
                  <label class="form-check-label text-capitalize">
                    {{ product?.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12" v-if="!products?.length">
            <not-found-entity :message="'Δεν βρέθηκαν προιόντα'" />
          </div>
          <div class="col-12">
            <label class="form-label">Οδοντίατροι:</label>
            <div class="w-100">
              <div class="radio-check-wrapper" v-for="doc in docs" :key="doc?._id">
                <div class="form-check-inline form-check mb-0 mx-0">
                  <input
                    class="form-check-input"
                    type="radio"
                    :value="doc._id"
                    v-model="selectedDoc"
                  />
                  <label class="form-check-label text-capitalize" :for="`doc-${doc?._id}`">
                    {{ doc?.fullName }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <label class="form-label">Περιγραφή</label>
            <textarea class="form-control" rows="3" v-model="localOrder.description"></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-update" :disabled="updating" @click="updateOrder">
              <button-content v-if="updating" />
              <span v-else>Ενημέρωση<i class="fa-solid fa-pencil ms-1"></i></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { MessageResponse, Order, OrderResponse, Product, User } from '../../types/interfaces'
import { ToastConclusion, ToastHeader } from '../../types/enums'
import { useToastStore } from '../../stores/toastStore'
import NotFoundEntity from './../NotFoundEntity.vue'
import SpinnerComponent from './../SpinnerComponent.vue'
import { formattedDate, isValidDateFormat, parseDate } from '../../utils/date'
import { orderHttp } from '../../services/orderHttp'
import { AxiosError } from 'axios'
import ButtonContent from './../ButtonContent.vue'
import { parseAndCheckNumber } from '../../utils/parseNumber'
import { useProductStore } from '../../stores/productStore'
import { useDoctorStore } from '../../stores/doctorStore'

const { order, products } = defineProps<{
  products: Product[] | null
  order: Order
}>()

const localOrder = ref<null | Order>({ ...order })
const sendDateToString = ref('')
const takenDateToString = ref('')
const docs = ref<null | User[]>(null)
const selectedProducts = ref(order.products.map((p) => p._id))
const selectedDoc = ref(order?.dentist!?._id)
const productsToAdd = ref([])
const productToRemove = ref([])
const updating = ref(false)
const paidToString = ref('')

const toast = useToastStore()
const product = useProductStore()
const doctors = useDoctorStore()

const emit = defineEmits(['order-updated'])

onMounted(async () => {
  sendDateToString.value = order.sendDate ? formattedDate(order.sendDate) : '--'
  takenDateToString.value = formattedDate(order.takenDate)
  paidToString.value = order.paid!?.toString() ?? '0'
  if (!doctors.isFetched) {
    await doctors.fetchDoctors()
  }
  docs.value = doctors.getDocs
})

const isProductSelected = (id: string) => selectedProducts.value.includes(id)

const handleCheckboxChange = (event: Event, productId: string) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    if (!productsToAdd.value.includes(productId)) {
      productsToAdd.value.push(productId)
    }
    productToRemove.value = productToRemove.value.filter((id) => id !== productId)
  } else {
    if (!productToRemove.value.includes(productId)) {
      productToRemove.value.push(productId)
    }
    productsToAdd.value = productsToAdd.value.filter((id) => id !== productId)
  }
}

const updateOrder = async () => {
  try {
    updating.value = true
    if (takenDateToString.value) {
      if (!isValidDateFormat(takenDateToString.value)) {
        toast.showToast('Λάθος διαμόρφωση ημερομηνίας!', ToastHeader.ATT, ToastConclusion.ATT)
        updating.value = false
        return
      }
    }

    if (sendDateToString.value) {
      if (!isValidDateFormat(sendDateToString.value)) {
        toast.showToast('Λάθος διαμόρφωση ημερομηνίας!', ToastHeader.ATT, ToastConclusion.ATT)
        updating.value = false
        return
      }
    }

    if (parseAndCheckNumber(localOrder.value.paid!?.toString()) === null) {
      toast.showToast('Το εξοφλημένο ποσό δεν είναι αριθμός!', ToastHeader.ATT, ToastConclusion.ATT)
      updating.value = false
      return
    }

    const updateData = {
      takenDate: parseDate(takenDateToString.value),
      sendDate: parseDate(sendDateToString.value),
      paid: localOrder.value.paid,
      dentist: selectedDoc.value,
      description: localOrder.value.description,
      remove: productToRemove.value,
      add: productsToAdd.value
    }

    const res = await orderHttp.patch<OrderResponse<Order>>(
      `/${order._id}/update-order`,
      updateData
    )
    emit('order-updated', res.data.order)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    product.isFetched = false
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    updating.value = false
    productsToAdd.value = []
    productToRemove.value = []
  }
}
</script>

<style scoped>
.i-wrapper {
  background: #6d6d6d1f;
  padding: 0.35rem 1rem;
  border-radius: 10px;
}
</style>
