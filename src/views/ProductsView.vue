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
    <create-product-modal @create="handleOnCreate" />
  </div>
  <spinner-component v-if="product.loading" :use-margin-top="true" />
  <div class="mt-1" v-if="!product.loading && products?.length">
    <total-count :length="products?.length" :entity="'προιόντα'" />
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
import { Product } from '../types/interfaces'
import SearchComponent from '../components/SearchComponent.vue'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import TotalCount from '../components/TotalCount.vue'
import ProductsCard from '../components/product/ProductsCard.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import CreateProductModal from '../components/modals/CreateProductModal.vue'

const product = useProductStore()

const products = ref<null | Product[]>(null)

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

const handleOnCreate = async (payload: Product) => {
  products.value.unshift(payload)
}
</script>
