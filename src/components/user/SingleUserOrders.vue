<template>
  <div class="d-flex flex-wrap justify-content-center w-100">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Παραγγελίες <i class="fa-solid fa-truck-fast ms-1"></i
    ></span>
    <not-found-entity v-if="!loading && !orders?.length" :message="'Δεν βρέθηκαν παραγγελίες'" />
    <div class="w-100" v-for="(order, index) in orders" :key="index">
      <div class="card shadow mb-2" v-if="!loading && orders?.length">
        <div class="card-header">
          <h5 class="mb-0">
            Παραγγελία νούμερο <span class="text-primary">{{ order.numberOfOrder }}</span>
          </h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item text-muted">
            Δημιουργήθηκε απο:
            <span class="text-dark text-capitalize" v-if="order.createdBy"
              >{{ order?.createdBy.fullName }} <i class="fa-solid fa-user text-primary"></i
            ></span>
            <span class="badge bg-danger fs-6 fw-normal" v-else>Δεν βρέθηκε χρήστης</span>
          </li>
          <div class="card-body d-flex flex-wrap justify-content-between px-3 pt-2 pb-1">
            <p class="mb-1 ms-1 text-muted">
              Ημ/νία παραλαβής:
              <span class="text-dark"
                >{{ formattedDate(order?.takenDate) }}
                <i class="fa-solid fa-calendar-days text-primary"></i
              ></span>
            </p>
            <p class="mb-1 ms-1 text-muted">
              Ημ/νία αποστολής:
              <span class="text-dark"
                >{{ formattedDate(order?.sendDate) }}
                <i class="fa-solid fa-calendar-days text-primary" v-if="order?.sendDate"></i
              ></span>
            </p>
            <p class="mb-1 ms-1 text-muted">
              Συνολικό κόστος:
              <span class="text-dark">{{ order.totalCost.toFixed(2) }}€</span>
            </p>
            <p class="mb-1 ms-1 text-muted">
              Εξοφλημένο:
              <span class="text-dark me-3">{{ order.paid.toFixed(2) }}€</span>
            </p>
            <p class="mb-0 ms-1 text-muted">
              Μη εξοφλημένο:
              <span class="text-dark">{{ order.unPaid.toFixed(2) }}€</span>
            </p>
          </div>
        </ul>
        <div class="card-footer">
          <router-link :to="`/order/${order._id}`">Δείτε την παραγγελία</router-link>
        </div>
      </div>
    </div>
  </div>

  <spinner-component v-if="loading" :use-margin-top="true" />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Order } from '../../types/interfaces'
import NotFoundEntity from './../NotFoundEntity.vue'
import SpinnerComponent from './../SpinnerComponent.vue'
import { formattedDate } from '../../utils/date'

defineProps<{
  orders: Order[]
  loading: boolean
}>()
</script>
