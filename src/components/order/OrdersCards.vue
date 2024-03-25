<template>
  <div v-for="month in orders?.sortedMonths" :key="month" class="w-100">
    <div class="alert alert-primary text-center">
      <h5 class="mb-0">{{ month }}</h5>
    </div>
    <div class="row">
      <div class="col-lg-4 pb-3" v-for="order in orders?.groupedOrders[month]" :key="order._id">
        <div class="card shadow">
          <div class="card-header">
            <h5 class="mb-0">
              Παραγγελία νούμερο <span class="text-primary">{{ order.numberOfOrder }}</span>
            </h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Ημερομηνία παραλαβής:
                <span class="text-dark ms-1">
                  {{ formattedDate(order.takenDate) }}
                  <i class="fa-solid fa-calendar-days text-primary"></i>
                </span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Ημερομηνία αποστολής:
                <span class="text-dark ms-1"
                  >{{ formattedDate(order.sendDate) }}
                  <i class="fa-solid fa-calendar-days text-primary" v-if="order?.sendDate"></i
                ></span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Συνολικό κόστος:
                <span class="text-dark ms-1">{{ order?.totalCost.toFixed(2) }}€</span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Εξοφλημένο ποσό:
                <span class="text-dark ms-1">{{ order?.paid?.toFixed(2) }}€</span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Μη εξοφλημένο ποσό:
                <span class="text-dark ms-1">{{ order?.unPaid?.toFixed(2) }}€</span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Προιόντα:
                <span class="text-primary" v-for="product in order?.products" :key="product._id">
                  <router-link
                    v-if="role === Roles.ADMIN"
                    :to="`/product/${product?._id}`"
                    class="badge rounded-pill bg-primary badge-link me-1 mt-1 fs-6 text-capitalize fw-normal prod-link"
                    >{{ product.name }}</router-link
                  >
                  <span
                    class="badge rounded-pill bg-primary badge-link me-1 mt-1 fs-6 text-capitalize fw-normal"
                    v-else
                    >{{ product.name }}</span
                  >
                </span>
              </p>
            </li>
            <li class="list-group-item">
              <p class="text-muted mb-0">
                Kατάσταση:
                <span class="text-dark ms-1"
                  >{{ order?.status
                  }}<i
                    class="fa-solid fa-x ms-1 text-danger"
                    v-if="order.status === OrderStatus.NOT_SEND"
                  ></i>
                  <i class="fa-solid fa-check ms-1 text-success" v-else></i>
                </span>
              </p>
            </li>
            <li class="list-group-item" v-if="role === Roles.ADMIN">
              <p class="text-muted mb-0">
                Oδοντίατρος:
                <router-link
                  :to="`/profile/${order?.dentist._id}`"
                  class="badge rounded-pill bg-primary badge-link me-1 fs-6 text-capitalize fw-normal prod-link"
                  >{{ order?.dentist.fullName }} <i class="fa-solid fa-stethoscope ms-1"></i
                ></router-link>
              </p>
            </li>
          </ul>
          <div class="card-footer">
            <router-link :to="`/order/${order?._id}`" class="w-100 text-center d-block"
              >Δείτε τη παραγγελία</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupedOrdersResult } from '../../types/interfaces'
import { defineProps } from 'vue'
import { formattedDate } from '../../utils/date'
import { OrderStatus, Roles } from '../../types/enums'

defineProps<{
  orders: GroupedOrdersResult
  role: Roles
}>()
</script>

<style scoped>
.prod-link {
  text-decoration: none;
  transition: all 0.19s linear;
}

.prod-link:hover {
  color: #0d6efd !important;
  background: transparent !important;
  text-decoration: underline;
  transition: all 0.19s linear;
}
</style>
