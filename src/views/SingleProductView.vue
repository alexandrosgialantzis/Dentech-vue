<template>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <not-found-entity v-if="!loading && !product" :message="'Δεν βρέθηκε το προιόν'" />
  <div class="row" v-if="!loading && product">
    <delete-component
      @handle-delete="handleDelete"
      :content="'Διαγραφη προιόντος'"
      :loading="deleting"
    />
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
import { onMounted, ref } from 'vue'
import { Product, ProductResponse } from '../types/interfaces'
import { useRoute, useRouter } from 'vue-router'
import { productHttp } from '../services/productHttp'
import { useToastStore } from '../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../types/enums'
import SpinnerComponent from '../components/SpinnerComponent.vue'
import NotFoundEntity from '../components/NotFoundEntity.vue'
import ProductGeneral from '../components/product/ProductGeneral.vue'
import ProductOrders from '../components/product/ProductOrders.vue'
import DeleteComponent from '../components/DeleteComponent.vue'
import { useProduct } from '../composables/useProduct'
import ProductUpdate from '../components/product/ProductUpdate.vue'

const route = useRoute()
const router = useRouter()
const { deleteProduct } = useProduct()

const product = ref<null | Product>(null)
const loading = ref(false)
const productId = ref('')
const toast = useToastStore()
const deleting = ref(false)

onMounted(async () => {
  productId.value = route.params.id as string
  await getProduct()
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
    await deleteProduct(productId.value)
    router.push('/products')
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
