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
          class="p-1 m-1 border border-2 rounded cw shadow bg-white d-flex flex-wrap justify-content-center align-items-between w-100"
        >
          <p class="d-inline text-light m-1" v-if="role === Roles.DENTIST">
            <span class="rounded bg-primary me-1 fs-5 text-capitalize fw-normal p-1"
              >{{ (prod?.id as Product)!?.name }}
              <i class="fa-solid fa-xmark text-light fs-6 mx-1"></i>
              {{ prod.amount }}
            </span>
          </p>
          <p v-if="role === Roles.ADMIN" class="m-0 d-flex align-items-center text-primary fs-5">
            <router-link
              :to="`/product/${(prod?.id as Product)!?._id}`"
              class="text-center w-100 d-block"
              ><span class="w-100">{{ (prod?.id as Product)!?.name }} </span>
            </router-link>
            <i class="fa-solid fa-xmark mx-1 text-secondary fs-6 mt-1"></i>
            {{ prod.amount }}
          </p>
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
