<template>
  <orders-view :is-profile="true" :id="id" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Order } from '../../types/interfaces'
import OrdersView from '../../views/OrdersView.vue'

defineProps<{
  orders: Order[]
  loading: boolean
  id: string
}>()
</script>
