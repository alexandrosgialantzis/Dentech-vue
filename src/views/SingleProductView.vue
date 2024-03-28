<template>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <not-found-entity v-if="!loading && !product" :message="'Δεν βρέθηκε το προιόν'" />
  <button
    type="button"
    class="btn btn-danger"
    data-bs-toggle="modal"
    data-bs-target="#staticBackdrop"
    :disabled="deleting"
    v-if="!loading && product"
  >
    <span v-if="!loading">Διαγραφή<i class="fa-solid fa-trash ms-1"></i></span>
    <button-content v-else />
  </button>
  <delete-modal
    @delete="handleDelete"
    :content="'Σίγουρα θέλετε να διαγράψετε το προιόν;'"
    :deleting="deleting"
  />
  <div class="row" v-if="!loading && product">
    <div class="col-lg-4 p-2 mb-2">
      <div class="mb-2">
        <product-general :product="product" />
      </div>
      <product-update @product-updated="handleProductUpdated" :product="product" />
    </div>
    <div class="col-lg-8">
      <product-orders :orders="product.orders" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Product, ProductResponse } from '../types/interfaces'
import { useRoute, useRouter } from 'vue-router'
import { productHttp } from '../services/productHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import ProductGeneral from '../components/product/ProductGeneral.vue'
import ProductOrders from '../components/product/ProductOrders.vue'
import ProductUpdate from '../components/product/ProductUpdate.vue'
import { useProductStore } from '../stores/productStore'
import DeleteModal from '../components/modals/DeleteModal.vue'
import ButtonContent from '../components/ButtonContent.vue'

const route = useRoute()
const router = useRouter()

const product = ref<null | Product>(null)
const loading = ref(false)
const productId = ref('')
const deleting = ref(false)

const toast = useToastStore()
const productStore = useProductStore()

onMounted(async () => {
  productId.value = route.params.id as string
  await getProduct()
})

onBeforeUnmount(() => {
  const elementToRemove = document.querySelector('.modal-backdrop')
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove)
  }
})

const getProduct = async () => {
  try {
    loading.value = true
    const res = await productHttp.get<ProductResponse<Product>>(
      `/${productId.value}/get-single-product`
    )
    product.value = res.data.product
  } catch (error) {
    toast.showToast('Δεν βρέθηκε το προιόν!', ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  deleting.value = true
  try {
    const res = await productHttp.delete<ProductResponse<Product>>(
      `/${productId.value}/delete-product`
    )
    toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)
    router.push('/products')
    productStore.isFetched = false
  } catch (error) {
    console.error('Κάτι πήγε λάθος σχετικά με τη διαγραφή')
  } finally {
    deleting.value = false
  }
}

const handleProductUpdated = (updatedProduct: Product) => {
  product.value = updatedProduct
}
</script>
