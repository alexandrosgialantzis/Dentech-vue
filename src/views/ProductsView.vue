<template>
  <div class="d-flex justify-content-between align-items-center top-wrapper">
    <div class="w-50 search-bar-wrapper">
      <search-component placeholder="Αναζητήστε προιόντα" @search="searchProducts" />
    </div>
    <button
      type="button"
      class="btn btn-outline-success ms-2 cp-btn"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Δημιουργεία προιόντος <i class="fa-solid fa-plus"></i>
    </button>
    <create-product-modal :loading="creating" @create="createProduct" />
  </div>
  <spinner-component v-if="product.loading" :use-margin-top="true" />
  <div class="mt-2" v-if="!product.loading && products?.length">
    <total-count :length="products?.length" :entity="'Προιόντα'" />
    <products-card :products="products" />
  </div>
  <not-found-entity
    :message="'Δεν βρέθηκαν προιόντα'"
    v-if="!product.loading && !products?.length"
  />
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import { MessageResponse, Product, ProductPayload, ProductResponse } from '../types/interfaces'
import SearchComponent from '../components/SearchComponent.vue'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import TotalCount from '../components/TotalCount.vue'
import ProductsCard from '../components/product/ProductsCard.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import CreateProductModal from '../components/modals/CreateProductModal.vue'
import { productHttp } from '../services/productHttp'
import { useToastStore } from '../stores/toastStore'
import { AxiosError } from 'axios'
import { ToastConclusion, ToastHeader } from '../types/enums'

const product = useProductStore()

const products = ref<null | Product[]>(null)
const creating = ref(false)

const toast = useToastStore()

onMounted(async () => {
  if (!product.isFetched) {
    await product.fetchProducts()
    products.value = product.getProducts.reverse()
  } else {
    products.value = product.getProducts
  }
})

onBeforeUnmount(() => {
  const elementToRemove = document.querySelector('.modal-backdrop')
  if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove)
  }
})

const searchProducts = async (search: string) => {
  await product.fetchProducts(search)
  products.value = product.products
}

const createProduct = async (payload: ProductPayload) => {
  try {
    creating.value = true

    const res = await productHttp.post<ProductResponse<Product>>('/create-product', payload)
    products.value.unshift(res.data.product)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)

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
</script>
