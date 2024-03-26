<template>
  <div class="row justify-content-between">
    <div class="p-1 col-lg-4" v-for="(product, i) in products" :key="i">
      <div class="card shadow">
        <div class="card-header">Προιόν {{ i + 1 }}.</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item text-muted">
            Όνομα: <span class="text-dark text-capitalize">{{ product?.name }}</span>
          </li>
          <li class="list-group-item text-muted">
            Tιμή: <span class="text-dark">{{ product?.price.toFixed(2) }}€</span>
          </li>
          <li class="list-group-item text-muted">
            Σύνολο παραγγελίων:
            <span class="text-dark">{{ product?.orders?.length }}</span>
          </li>
        </ul>
        <div class="card-footer">
          <router-link :to="`/product/${product?._id}`" class="w-100 text-center d-block"
            >Δείτε το προιόν</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Product } from '../../types/interfaces'
import { defineProps } from 'vue'

defineProps<{
  products: Product[]
}>()
</script>
