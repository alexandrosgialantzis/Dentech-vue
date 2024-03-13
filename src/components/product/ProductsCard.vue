<template>
  <div class="row justify-content-between">
    <div class="p-2 col-lg-4" v-for="(product, i) in products" :key="i">
      <div class="card shadow">
        <div class="card-header">Προιόν {{ i + 1 }}.</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Όνομα: <span class="text-primary">{{ product?.name }}</span>
          </li>
          <li class="list-group-item">
            Tιμή: <span class="text-primary">{{ product?.price.toFixed(2) }}€</span>
          </li>
          <li class="list-group-item">
            Σύνολο παραγγελίων:
            <span class="text-primary">{{ product?.orders?.length }}</span>
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
