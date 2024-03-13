<template>
  <div class="col-lg-12 mt-2">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Παραγγελίες <i class="fa-solid fa-truck-fast ms-1"></i
    ></span>
    <div class="card shadow w-100 mb-2" v-for="(order, index) in orders" :key="index">
      <div class="card-body d-flex flex-wrap justify-content-between p-1">
        <p class="m-1">
          <span class="me-1">Ημ/νία παραλαβής:</span>
          <span class="text-primary"
            >{{ formattedDate(order?.takenDate) }} <i class="fa-solid fa-calendar-days"></i
          ></span>
        </p>
        <p class="m-1">
          <span class="me-1"> Ημ/νία αποστολής:</span>
          <span class="text-primary"
            >{{ formattedDate(order?.sendDate) }}
            <i class="fa-solid fa-calendar-days" v-if="order?.sendDate"></i
          ></span>
        </p>
        <p class="m-1">
          <span class="me-1"> Συνολικό κόστος:</span>
          <span class="text-primary">{{ order?.totalCost.toFixed(2) }}€</span>
        </p>
        <p class="m-1">
          <span class="me-1"> Εξοφλημένο:</span>
          <span class="text-primary">{{ order?.paid ? order?.paid.toFixed(2) : 0 }}€</span>
        </p>
        <p class="m-1">
          <span class="me-1"> Μη εξοφλημένο:</span>
          <span class="text-primary">{{ order?.unPaid.toFixed(2) }}€</span>
        </p>
      </div>
      <div class="card-footer p-2">
        <router-link :to="`/order/${order?._id}`">Δείτε τη παραγγελία</router-link>
      </div>
    </div>
    <not-found-entity
      v-if="!orders.length"
      :message="'Δεν βρέθηκαν παραγγελίες για το προιόν'"
      :use-margin-top="true"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Order } from '../../types/interfaces'
import { formattedDate } from '../../utils/date'
import NotFoundEntity from '../NotFoundEntity.vue'

defineProps<{
  orders: Order[]
}>()
</script>
