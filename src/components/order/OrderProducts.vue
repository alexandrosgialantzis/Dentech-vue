<template>
  <div class="col-lg-4 p-2 mb-2">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Προιόντα<i class="fa-solid fa-tooth ms-1"></i
    ></span>

    <div class="card">
      <div
        :class="[
          'card-body shadow d-flex flex-wrap p-1',
          `justify-content-${products?.length > 2 ? 'between' : 'center'}`
        ]"
        v-if="products?.length"
      >
        <div
          v-for="(prod, index) in products"
          :key="index"
          :class="[
            'p-1 m-1 border border-2 rounded cw shadow bg-white d-flex flex-wrap justify-content-center align-items-between',
            `${products?.length < 2 ? 'w-100' : ''}`
          ]"
        >
          <p class="mb-1 text-center">
            Ονομα: <span class="text-primary text-capitalize w-100">{{ prod?.name }}</span>
          </p>
          <router-link :to="`/product/${prod?._id}`" class="text-center w-100 d-block"
            >Δείτε το προιόν</router-link
          >
        </div>
      </div>
      <not-found-entity :message="'Δεν βρέθηκαν προιόντα'" v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Product } from '../../types/interfaces'
import NotFoundEntity from '../NotFoundEntity.vue'

defineProps<{
  products: Product[]
}>()
</script>

<style scoped>
.cw {
  background: #91919117;
  width: 48%;
}

@media (max-width: 1290px) {
  .cw {
    width: 100%;
  }
}

@media (max-width: 1010px) {
  .cw {
    width: 30%;
  }
}

@media (max-width: 700px) {
  .cw {
    width: 45%;
  }
}

@media (max-width: 500px) {
  .cw {
    width: 100%;
  }
}
</style>
