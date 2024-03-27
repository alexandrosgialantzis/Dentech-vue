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
          <div
            class="row g-3"
            v-if="!doctors.loading && docs?.length && products?.length && !product.loading"
          >
            <div class="col-md-3">
              <label class="form-label"
                >Ημ/νία παραλαβής: <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" v-model="takenDate" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Ημ/νία αποστολής:</label>
              <input type="text" class="form-control" v-model="sendDate" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Εξοφλημένο ποσό: </label>
              <input type="number" class="form-control" v-model="paid" @input="handleUnPaid()" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Ασθενής: </label>
              <input type="text" class="form-control" v-model="client" />
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
                <div class="row justify-content-between">
                  <div v-for="(product, index) in products" :key="index" class="py-1 col-md-4">
                    <div
                      class="p-2 w-100 d-flex align-items-center justify-content-between border rounded shadow"
                    >
                      <div class="me-1">
                        <label class="form-check-label text-capitalize me-1">
                          {{ product?.name }}
                        </label>
                      </div>
                      <div class="d-flex">
                        <span class="bagde bg-primary text-light rounded px-3">
                          {{
                            (productsToAdd.find((prod) => prod.id === product._id) || { amount: 0 })
                              .amount
                          }}</span
                        >
                        <button
                          class="btn btn-outline-success ms-1 d-flex justify-content-center align-items-center btn-product rounded"
                          @click="add(product._id)"
                        >
                          <i class="fa-solid fa-plus"></i>
                        </button>
                        <button
                          class="btn btn-outline-danger ms-1 d-flex justify-content-center align-items-center btn-product rounded"
                          :disabled="
                            (productsToAdd.find((prod) => prod.id === product._id) || { amount: 0 })
                              .amount <= 0
                          "
                          @click="remove(product._id)"
                        >
                          <i class="fa-solid fa-minus"></i>
                        </button>
                      </div>
                    </div>
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
          </div>
          <p class="mb-0" v-else>
            Προσθέστε προίοντα και οδοντιάτρους ώστε να δημιουργήσετε την πρώτη παραγγελία
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Κλείσιμο
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="createOrder"
            :disabled="creating"
            v-if="!doctors.loading && docs?.length && products?.length && !product.loading"
          >
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
import { onMounted, ref } from 'vue'
import { Product, User, ProductsOnOrder } from '../../types/interfaces'
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
const productsToAdd = ref<ProductsOnOrder[]>([])
const productsToAddIds = ref([])
const unPaid = ref(0)
const totalCost = ref(0)
const client = ref('')

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

const add = (id: string) => {
  const prod = product.products.find((prod) => prod._id === id)
  const i = productsToAdd.value.findIndex((prod) => prod.id === id)

  if (i !== -1) {
    const updatedProduct = {
      ...productsToAdd.value[i],
      amount: productsToAdd.value[i].amount + 1
    }
    productsToAdd.value = [
      ...productsToAdd.value.slice(0, i),
      updatedProduct,
      ...productsToAdd.value.slice(i + 1)
    ]
  } else {
    productsToAdd.value.push({ id, amount: 1 } as ProductsOnOrder)
    productsToAddIds.value.push(id)
    totalCost.value += prod.price
    handleUnPaid()
    return
  }

  totalCost.value += prod.price
  handleUnPaid()
}

const remove = (id: string) => {
  const i = productsToAdd.value.findIndex((prod) => prod.id === id)
  productsToAdd.value[i].amount -= 1

  const prod = product.products.find((prod) => prod._id === id)

  totalCost.value -= prod.price
  handleUnPaid()

  if (productsToAdd.value[i].amount <= 0) {
    productsToAdd.value.splice(i, 1)
    productsToAddIds.value = productsToAddIds.value.filter((prodId) => prodId !== id)
  }
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
      products: productsToAdd.value,
      client: client.value
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
