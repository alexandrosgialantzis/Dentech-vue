<template>
  <div class="input-group justify-content-end flex-column wmax-1200 mc-1 btn-filter-group">
    <div class="d-inline-flex justify-content-end flex-wrap filter">
      <span class="d-flex align-items-center me-1">Ταξινόμηση βάση κατάστασης: </span>
      <div class="btn-group flex-wrap">
        <button
          :class="['btn', `btn${!status ? '' : '-outline'}-secondary`]"
          @click="handleChange()"
          :disabled="!status"
        >
          Όλες
        </button>
        <button
          :class="['btn', `btn${status === OrderStatus.NOT_SEND ? '' : '-outline'}-secondary`]"
          @click="handleChange(OrderStatus.NOT_SEND)"
          :disabled="status === OrderStatus.NOT_SEND"
        >
          Μη απεσταλμένες <i class="fa-solid fa-x ms-1 text-danger"></i>
        </button>
        <button
          :class="['btn', `btn${status === OrderStatus.SEND ? '' : '-outline'}-secondary`]"
          @click="handleChange(OrderStatus.SEND)"
          :disabled="status === OrderStatus.SEND"
        >
          Aπεσταλμένες <i class="fa-solid fa-check ms-1 text-success"></i>
        </button>
      </div>
    </div>
    <div class="d-inline-flex justify-content-end filter">
      <p class="mb-0">
        Ταξινόμηση βάση:
        <span class="badge bg-primary fs-6 fw-normal mt-1 p-2">{{
          !status ? OrderStatus.SEND : status
        }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OrderStatus } from '../../types/enums'

defineProps<{
  status: OrderStatus | string
}>()

const emit = defineEmits(['change-status'])

const handleChange = (st?: OrderStatus) => {
  emit('change-status', st)
}
</script>

<style scoped>
@media (max-width: 1500px) {
  .filter {
    justify-content: flex-start !important;
  }
}
</style>
