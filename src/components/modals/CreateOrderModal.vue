<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <spinner-component v-if="doctors.loading || product.loading" />
    <div class="modal-dialog" v-else>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Δημιουργία παραγγελίας</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form
            class="row g-3"
            v-if="!doctors.loading && docs?.length"
            @submit.prevent="createOrder"
          >
            <div class="col-md-4">
              <label class="form-label"
                >Ημ/νία παραλαβής: <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" v-model="takenDate" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Ημ/νία αποστολής:</label>
              <input type="text" class="form-control" v-model="sendDate" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Εξοφλημένο ποσό: </label>
              <input type="number" class="form-control" v-model="paid" @input="handleUnPaid()" />
            </div>
            <div class="col-6">
              <label class="form-label">Συνολικό κόστος: </label>
              <span class="text-primary ms-1">{{ totalCost.toFixed(2) }}€</span>
            </div>
            <div class="col-6">
              <label class="form-label">Μη εξοφλημένο ποσό: </label>
              <span class="text-primary ms-1">{{ unPaid.toFixed(2) }}€</span>
            </div>
            <div class="col-12" v-if="products?.length">
              <label class="form-label">Προϊόντα: <span class="text-danger fs-6">*</span></label>
              <div class="w-100">
                <div class="radio-check-wrapper" v-for="(product, index) in products" :key="index">
                  <div class="form-check form-check-inline form-check mb-0 mx-0">
                    <input
                      class="form-check-input text-capitalize"
                      type="checkbox"
                      :value="product._id"
                      v-model="productsToAdd"
                      @change="handleCheckboxChange($event, product._id)"
                    />
                    <label class="form-check-label text-capitalize">
                      {{ product?.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="!products?.length">
              <not-found-entity :message="'Δεν βρέθηκαν προιόντα'" />
            </div>
            <div class="col-12">
              <label class="form-label">Οδοντίατροι: <span class="text-danger fs-6">*</span></label>
              <div class="w-100">
                <div class="radio-check-wrapper" v-for="doc in docs" :key="doc?._id">
                  <div class="form-check-inline form-check mb-0 mx-0">
                    <input
                      class="form-check-input"
                      type="radio"
                      :value="doc._id"
                      v-model="selectedDoctor"
                    />
                    <label class="form-check-label text-capitalize" :for="`doc-${doc?._id}`">
                      {{ doc?.fullName }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <label class="form-label">Περιγραφή: </label>
              <textarea class="form-control" rows="3" v-model="description"></textarea>
            </div>
            <p class="form-text mb-0"><span class="text-danger fs-6">*</span> Αναγκαία πεδία.</p>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Κλείσιμο
          </button>
          <button type="button" class="btn btn-success" @click="createOrder" :disabled="creating">
            <span v-if="!creating"
              >Δημιουργία παραγγελίας<i class="fa-solid fa-plus ms-1"></i
            ></span>
            <button-content v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { Product, User } from '../../types/interfaces'
import { ToastConclusion, ToastHeader } from '../../types/enums'
import { useToastStore } from '../../stores/toastStore'
import NotFoundEntity from './../NotFoundEntity.vue'
import SpinnerComponent from './../SpinnerComponent.vue'
import { isValidDateFormat, parseDate } from '../../utils/date'
import ButtonContent from './../ButtonContent.vue'
import { parseAndCheckNumber } from '../../utils/parseNumber'
import { useProductStore } from '../../stores/productStore'
import { useDoctorStore } from '../../stores/doctorStore'

let { creating } = defineProps<{
  creating: boolean
}>()

const takenDate = ref('')
const sendDate = ref('')
const description = ref('')
const paid = ref(0)
const docs = ref<User[]>()
const products = ref<Product[]>()
const selectedDoctor = ref('')
const productsToAdd = ref<string[] | ''>([])
const unPaid = ref(0)
const totalCost = ref(0)

const toast = useToastStore()
const product = useProductStore()
const doctors = useDoctorStore()

const emit = defineEmits(['create'])

onMounted(async () => {
  if (!doctors.isFetched) {
    await doctors.fetchDoctors()
  }
  if (!product.isFetched) {
    await product.fetchProducts()
  }
  products.value = product.getProducts
  docs.value = doctors.getDocs
})

const handleCheckboxChange = (event: Event, productId: string) => {
  const target = event.target as HTMLInputElement
  const prod = product.products.find((prod) => prod._id === productId)
  if (target.checked) {
    totalCost.value += prod.price
  } else {
    totalCost.value -= prod.price
  }

  handleUnPaid()
}

const handleUnPaid = () => {
  unPaid.value = totalCost.value - paid.value
}

const createOrder = async () => {
  try {
    if (takenDate.value) {
      if (!isValidDateFormat(takenDate.value)) {
        toast.showToast('Λάθος διαμόρφωση ημερομηνίας!', ToastHeader.ATT, ToastConclusion.ATT)
        creating = false
        return
      }
    }

    if (sendDate.value) {
      if (!isValidDateFormat(sendDate.value)) {
        toast.showToast('Λάθος διαμόρφωση ημερομηνίας!', ToastHeader.ATT, ToastConclusion.ATT)
        creating = false
        return
      }
    }

    if (parseAndCheckNumber(paid.value!?.toString()) === null) {
      toast.showToast('Το εξοφλημένο ποσό δεν είναι αριθμός!', ToastHeader.ATT, ToastConclusion.ATT)
      creating = false
      return
    }

    const order = {
      takenDate: parseDate(takenDate.value),
      sendDate: parseDate(sendDate.value),
      paid: paid.value,
      dentist: selectedDoctor.value,
      description: description.value,
      products: productsToAdd.value
    }

    emit('create', order)
    product.isFetched = false
  } catch (e) {
    toast.showToast(
      'Κάτι πήγε στραβά σχετικά με την δημιουργία παραγγελίας',
      ToastHeader.ERROR,
      ToastConclusion.ERROR
    )
  }
}
</script>
