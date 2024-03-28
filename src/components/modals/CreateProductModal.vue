<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Δημιουργία προιόντος</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="auth-form">
            <div class="mb-3">
              <label for="name" class="form-label"
                >Όνομα <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" id="name" v-model="name" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label"
                >Τιμή <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" id="email" v-model="price" />
            </div>
            <p class="form-text mb-0"><span class="text-danger fs-6">*</span> Αναγκαία πεδία.</p>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Κλείσιμο
          </button>
          <button type="button" class="btn btn-success" @click="createProduct" :disabled="creating">
            <span v-if="!creating">Δημιουργία προιόντος<i class="fa-solid fa-plus ms-1"></i></span>
            <button-content v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ButtonContent from '../ButtonContent.vue'
import { MessageResponse, Product, ProductPayload, ProductResponse } from '../../types/interfaces'
import { parseAndCheckNumber } from '../../utils/parseNumber'
import { useToastStore } from '../../stores/toastStore'
import { ToastConclusion, ToastHeader } from '../../types/enums'
import { productHttp } from '../../services/productHttp'
import { AxiosError } from 'axios'

const toast = useToastStore()

const emit = defineEmits(['create'])

const creating = ref(false)
const price = ref('')
const name = ref('')

const createProduct = async () => {
  const validPrice = parseAndCheckNumber(price.value)
  if (validPrice !== null) {
    try {
      creating.value = true
      const payload: ProductPayload = {
        name: name.value,
        price: validPrice
      }

      const res = await productHttp.post<ProductResponse<Product>>('/create-product', payload)
      emit('create', res.data.product)
      toast.showToast(res.data.message, ToastHeader.SUCCESS, ToastConclusion.SUCCESS)

      const elementToClick = document.querySelector('.btn-close') as HTMLElement | null
      if (elementToClick) {
        elementToClick.click()
      }

      name.value = ''
      price.value = ''
    } catch (error) {
      const e = error as AxiosError<MessageResponse>
      toast.showToast(e.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
    } finally {
      creating.value = false
    }
  } else {
    toast.showToast('Η τιμή πρέπει να είναι αριθμός!', ToastHeader.ATT, ToastHeader.ATT)
  }
}
</script>
