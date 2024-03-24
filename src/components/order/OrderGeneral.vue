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
        <p class="m-1">
          <span class="me-1">Δημιουργήθηκε απο:</span>
          <span class="text-primary text-capitalize" v-if="order.createdBy"
            >{{ order?.createdBy.fullName }} <i class="fa-solid fa-user"></i
          ></span>
          <span class="text-primary" v-else>Δεν βρέθηκε χρήστης</span>
        </p>
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
        <p class="mb-0 mx-1 mt-1">
          <span class="me-1"> Τελευταία ενημέρωση:</span>
          <span class="text-primary"
            >{{ formattedDate(order?.updatedAt) }} <i class="fa-solid fa-calendar-days"></i
          ></span>
        </p>
        <p class="m-1">
          <span class="me-1">Kατάσταση:</span>
          <span class="text-primary"
            >{{ order?.status
            }}<i
              class="fa-solid fa-x ms-1 text-danger"
              v-if="order.status === OrderStatus.NOT_SEND"
            ></i>
            <i class="fa-solid fa-check ms-1 text-success" v-else></i>
          </span>
        </p>
        <p class="mx-1 mb-0 w-100">
          <label>Περιγραφή: </label>
          <span class="ms-1 fw-light fs-6">
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
