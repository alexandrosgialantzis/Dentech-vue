<template>
  <div class="col-lg-4 p-2 mb-2">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Γενικές πληροφορίες<i class="fa-solid fa-info ms-1"></i
    ></span>
    <div class="card shadow">
      <div class="card-body d-flex flex-wrap justify-content-between">
        <h5 class="card-title mb-1 w-100">
          Παραγγελία νούμερο
          <span class="text-primary">{{
            order?.numberOfOrder ?? 'remember to fix this shit'
          }}</span>
        </h5>
        <p class="m-1 text-muted">
          Δημιουργήθηκε απο:
          <span class="text-dark text-capitalize" v-if="order.createdBy"
            >{{ order?.createdBy.fullName }} <i class="fa-solid fa-user text-primary"></i
          ></span>
          <span class="text-dark" v-else>Δεν βρέθηκε χρήστης</span>
        </p>
        <p class="m-1 text-muted">
          Ημ/νία παραλαβής:
          <span class="text-dark"
            >{{ formattedDate(order?.takenDate) }}
            <i class="fa-solid fa-calendar-days text-primary"></i
          ></span>
        </p>
        <p class="m-1 text-muted">
          Ημ/νία αποστολής:
          <span class="text-dark"
            >{{ formattedDate(order?.sendDate) }}
            <i class="fa-solid fa-calendar-days text-primary" v-if="order?.sendDate"></i
          ></span>
        </p>
        <p class="m-1 text-muted">
          Συνολικό κόστος:
          <span class="text-dark">{{ order?.totalCost.toFixed(2) }}€</span>
        </p>
        <p class="m-1 text-muted">
          Εξοφλημένο:
          <span class="text-dark">{{ order?.paid ? order?.paid.toFixed(2) : 0 }}€</span>
        </p>
        <p class="m-1 text-muted">
          Μη εξοφλημένο:
          <span class="text-dark">{{ order?.unPaid.toFixed(2) }}€</span>
        </p>
        <p class="mb-0 mx-1 mt-1 text-muted">
          Τελευταία ενημέρωση:
          <span class="text-dark"
            >{{ formattedDate(order?.updatedAt) }}
            <i class="fa-solid fa-calendar-days text-primary"></i
          ></span>
        </p>
        <p class="m-1 text-muted">
          Kατάσταση:
          <span class="text-dark"
            >{{ order?.status
            }}<i
              class="fa-solid fa-x ms-1 text-danger"
              v-if="order.status === OrderStatus.NOT_SEND"
            ></i>
            <i class="fa-solid fa-check ms-1 text-success" v-else></i>
          </span>
        </p>
        <p class="mx-1 mb-0 w-100 text-muted">
          Περιγραφή:
          <span class="ms-1 text-dark fs-6">
            {{ order?.description || 'Δεν υπάρχει περιγραφή' }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Order } from '../../types/interfaces'
import { formattedDate } from '../../utils/date'
import { OrderStatus } from '../../types/enums'

defineProps<{ order: Order }>()
</script>
