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
          <p :class="[role === Roles.ADMIN ? 'mb-1' : 'mb-0', 'text-center', 'text-muted']">
            Ονομα:
            <span class="text-dark text-capitalize w-100">{{ (prod?.id as Product).name }}</span>
            <span class="text-dark text-capitalize w-100 ms-1">x{{ prod.amount }}</span>
          </p>
          <router-link
            :to="`/product/${(prod?.id as Product)._id}`"
            class="text-center w-100 d-block"
            v-if="role === Roles.ADMIN"
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
import { Product, ProductsOnOrder } from '../../types/interfaces'
import NotFoundEntity from '../NotFoundEntity.vue'
import { Roles } from '../../types/enums'

defineProps<{
  products: ProductsOnOrder[]
  role: Roles
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
