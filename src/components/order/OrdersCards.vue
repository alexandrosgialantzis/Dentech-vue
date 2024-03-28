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
          <div class="d-flex flex-wrap">
            <total-count
              :length="orders?.groupedOrders[month].length"
              :content="'Παραγγελίες'"
              :entity="'σύνολο'"
              class="border rounded p-1 shadow me-2 mt-custom"
            />
            <total-count
              :length="getPaidByMonth(month).value"
              :content="'Συνολικό εξοφλημένο πόσο'"
              :entity="'€'"
              class="border rounded p-1 shadow"
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
                    Εξοφλημένο ποσό:
                    <span class="text-dark">{{ order.paid ? order.paid.toFixed(2) : 0 }}€</span>
                  </li>
                  <li class="list-group-item text-muted">
                    Μη εξοφλημένο ποσό:
                    <span class="text-dark">{{ order.unPaid.toFixed(2) }}€</span>
                  </li>
                  <li class="list-group-item">
                    <div class="text-muted mb-0">
                      Προιόντα:
                      <div class="d-inline-flex flex-wrap">
                        <div
                          class="text-primary mb-2"
                          v-for="product in order?.products"
                          :key="(product.id as Product)!?._id"
                        >
                          <span v-if="role === Roles.ADMIN" class="me-2 my-1">
                            <router-link
                              :to="`/product/${(product.id as Product)!?._id}`"
                              class="text-primary prod-link me-1"
                              >{{ (product.id as Product)!?.name }}
                            </router-link>
                            <i class="fa-solid fa-xmark fs-6"></i>
                            {{ product.amount }}
                          </span>
                          <p class="d-inline me-1 text-light mb-1" v-else>
                            <span class="rounded bg-primary me-1 fs-5 fw-normal p-1"
                              >{{ (product.id as Product)!?.name }}
                              <i class="fa-solid fa-xmark text-light fs-6 mx-1 h-100"></i>
                              {{ product.amount }}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        class="dadge bg-danger p-1 text-light rounded"
                        v-if="!order.products.length"
                        >Δεν βρέθηκαν προιόντα</span
                      >
                    </div>
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
                      v-if="order.dentist"
                      :to="`/profile/${order.dentist._id}`"
                      class="prod-link bagde bg-primary text-light rounded p-1"
                    >
                      {{ order.dentist?.fullName }} <i class="fa-solid fa-stethoscope ms-1"></i>
                    </router-link>
                    <not-found-entity message="Δεν βρέθηκε οδοντίατρος!" v-else />
                  </li>
                  <li class="list-group-item text-muted">
                    Ασθενής: <span class="text-dark">{{ order.client || '--' }}</span>
                  </li>
                </ul>
                <div class="card-footer d-flex justify-content-between align-items-center">
                  <router-link :to="`/order/${order._id}`">Δείτε τη παραγγελία</router-link>
                  <repayment-comp
                    :key="order._id"
                    :paying="payingStates[order._id] || false"
                    :total="order.totalCost"
                    :paid="order.paid"
                    @pay="emitPay(order._id, order.totalCost)"
                    v-if="user.role === Roles.ADMIN"
                  />
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
import { computed, defineProps, ref } from 'vue'
import { formattedDate } from '../../utils/date'
import { OrderStatus, Roles } from '../../types/enums'
import RepaymentComp from '../../components/RepaymentComp.vue'
import TotalCount from '../../components/TotalCount.vue'
import { useOrder } from '../../composables/useOrder'
import { useUserStore } from '../../stores/userStore'
import NotFoundEntity from '../NotFoundEntity.vue'

const { pay } = useOrder()

const { user } = useUserStore()

const emit = defineEmits(['pay'])

const payingStates = ref({})

const emitPay = async (id: string, total: number) => {
  payingStates.value[id] = true
  const order = await pay(id, total)
  emit('pay', order)
  payingStates.value[id] = false
}
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

@media (max-width: 650px) {
  .mt-custom {
    margin-bottom: 0.25rem !important;
  }
}
</style>
