<template>
  <div class="accordion w-100" id="accordionExample">
    <div class="accordion-item" v-for="(month, index) in orders?.sortedMonths" :key="month">
      <h2 class="accordion-header" :id="`heading${index}`">
        <button
          class="accordion-button collapsed"
          type="button"
          :aria-expanded="false"
          data-bs-toggle="collapse"
          :data-bs-target="`#collapse${index}`"
          :aria-controls="`collapse${index}`"
        >
          <h5 class="mb-0 text-primary w-100 text-center">{{ month }}</h5>
        </button>
      </h2>
      <div
        :id="`collapse${index}`"
        class="accordion-collapse collapse"
        :aria-labelledby="`heading${index}`"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <div class="d-flex">
            <total-count
              :length="orders?.groupedOrders[month].length"
              :content="'Παραγγελίες'"
              :entity="'σύνολο'"
              class="border rounded p-1 shadow"
            />
            <total-count
              :length="getPaidByMonth(month).value"
              :content="'Συνολικό εξοφλημένο πόσο'"
              :entity="'€'"
              class="ms-2 border rounded p-1 shadow"
            />
          </div>
          <div class="row mt-3">
            <div
              class="col-lg-4 pb-3"
              v-for="order in orders?.groupedOrders[month]"
              :key="order._id"
            >
              <div class="card shadow">
                <div class="card-header">
                  <h5 class="mb-0">
                    Παραγγελία νούμερο <span class="text-primary">{{ order.numberOfOrder }}</span>
                  </h5>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item text-muted">
                    Ημ/νία παραλαβής:
                    <span class="text-dark"
                      >{{ formattedDate(order?.takenDate) }}
                      <i class="fa-solid fa-calendar-days text-primary"></i
                    ></span>
                  </li>
                  <li class="list-group-item text-muted">
                    Ημ/νία αποστολής:
                    <span class="text-dark">
                      {{ formattedDate(order?.sendDate) }}
                      <i class="fa-solid fa-calendar-days text-primary" v-if="order?.sendDate"></i
                    ></span>
                  </li>
                  <li class="list-group-item text-muted">
                    Συνολικό κόστος:
                    <span class="text-dark">{{ order.totalCost.toFixed(2) }}€</span>
                  </li>
                  <li class="list-group-item text-muted">
                    Εξοφλημένο ποσό: <span class="text-dark">{{ order.paid.toFixed(2) }}€</span>
                  </li>
                  <li class="list-group-item text-muted">
                    Μη εξοφλημένο ποσό:
                    <span class="text-dark">{{ order.unPaid.toFixed(2) }}€</span>
                  </li>
                  <li class="list-group-item">
                    <p class="text-muted mb-0">
                      Προιόντα:
                      <span
                        class="text-primary"
                        v-for="product in order?.products"
                        :key="(product.id as Product)._id"
                      >
                        <router-link
                          v-if="role === Roles.ADMIN"
                          :to="`/product/${(product.id as Product)._id}`"
                          class="badge bg-primary badge-link me-1 mt-1 fs-6 fw-normal prod-link"
                          ><span class="text-capitalize">{{ (product.id as Product).name }}</span>
                          x{{ product.amount }}</router-link
                        >
                        <span
                          class="badge rounded-pill bg-primary badge-link me-1 mt-1 fs-6 text-capitalize fw-normal"
                          v-else
                          >{{ product.name }}</span
                        >
                      </span>
                    </p>
                  </li>
                  <li class="list-group-item text-muted">
                    Κατάσταση:
                    <span class="text-dark"
                      >{{ order?.status
                      }}<i
                        class="fa-solid fa-x ms-1 text-danger"
                        v-if="order.status === OrderStatus.NOT_SEND"
                      ></i>
                      <i class="fa-solid fa-check ms-1 text-success" v-else></i
                    ></span>
                  </li>
                  <li class="list-group-item text-muted" v-if="role === Roles.ADMIN">
                    Οδοντίατρος:
                    <router-link
                      :to="`/profile/${order.dentist._id}`"
                      class="prod-link bagde bg-primary text-light rounded p-1"
                    >
                      {{ order.dentist.fullName }} <i class="fa-solid fa-stethoscope ms-1"></i>
                    </router-link>
                  </li>
                  <li class="list-group-item text-muted">
                    Ασθενής: <span class="text-dark">{{ order.client ?? '--' }}</span>
                  </li>
                </ul>
                <div class="card-footer">
                  <router-link :to="`/order/${order._id}`">Δείτε τη παραγγελία</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupedOrdersResult, Product } from '../../types/interfaces'
import { computed, defineProps } from 'vue'
import { formattedDate } from '../../utils/date'
import { OrderStatus, Roles } from '../../types/enums'
import TotalCount from '../../components/TotalCount.vue'

const props = defineProps<{
  orders: GroupedOrdersResult
  role: Roles
}>()

const getPaidByMonth = (month: string) => {
  return computed(() => {
    let sum: number = 0
    const monthOrders = props.orders.groupedOrders[month]
    if (!monthOrders) {
      return sum
    }
    for (const ord of monthOrders) {
      sum += ord.paid
    }
    return sum
  })
}
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
