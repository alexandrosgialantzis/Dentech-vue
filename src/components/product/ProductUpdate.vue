<template>
  <div class="card shadow">
    <div class="card-header border"><h5 class="m-0 p-2">Ενημέρωση παραγγελίας</h5></div>
    <div class="card-body bg-white border">
      <form class="row g-3" @submit.prevent="updateProduct">
        <div class="col-md-6">
          <label class="form-label">Ονομα:</label>
          <input type="text" class="form-control" v-model="prod.name" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Τιμή:</label>
          <input type="text" class="form-control" v-model="prod.price" />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-update" :disabled="updating">
            <button-content v-if="updating" />
            <span v-else>Ενημέρωση<i class="fa-solid fa-pencil ms-1"></i></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmits } from 'vue'
import { MessageResponse, Product, ProductResponse } from '../../types/interfaces'
import { ToastConclusion, ToastHeader } from '../../types/enums'
import { useToastStore } from '../../stores/toastStore'
import { AxiosError } from 'axios'
import ButtonContent from './../ButtonContent.vue'
import { parseAndCheckNumber } from '../../utils/parseNumber'
import { productHttp } from '../../services/productHttp'
import { useProductStore } from '../../stores/productStore'

const { product } = defineProps<{
  product: Product | null
}>()

const updating = ref(false)
const prod = ref<null | Product>({ ...product })

const toast = useToastStore()

const productStore = useProductStore()

const emit = defineEmits(['product-updated'])

const updateProduct = async () => {
  try {
    updating.value = true

    if (parseAndCheckNumber(prod.value.price!?.toString()) === null) {
      toast.showToast('H τιμή δεν είναι αριθμός!', ToastHeader.ATT, ToastConclusion.ATT)
      updating.value = false
      return
    }

    const data = { name: prod.value.name, price: prod.value.price }
    const res = await productHttp.patch<ProductResponse<Product>>(
      `/${prod.value._id}/update-product`,
      data
    )

    emit('product-updated', res.data.product)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    productStore.isFetched = false
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    updating.value = false
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
