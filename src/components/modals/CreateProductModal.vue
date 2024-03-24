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
          <button type="button" class="btn btn-success" @click="createProduct" :disabled="loading">
            <span v-if="!loading">Δημιουργία χρήστη<i class="fa-solid fa-plus ms-1"></i></span>
            <button-content v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'
import ButtonContent from '../ButtonContent.vue'
import { ProductPayload } from '../../types/interfaces'
import { parseAndCheckNumber } from '../../utils/parseNumber'
import { useToastStore } from '../../stores/toastStore'
import { ToastHeader } from '../../types/enums'

const toast = useToastStore()

defineProps<{ loading: boolean }>()

const emit = defineEmits(['create'])

const price = ref('')
const name = ref('')

const createProduct = () => {
  const pr = parseAndCheckNumber(price.value)
  if (pr !== null) {
    const payload: ProductPayload = {
      name: name.value,
      price: pr
    }

    emit('create', payload)
  } else {
    toast.showToast('Η τιμή πρέπει να είναι αριθμός!', ToastHeader.ATT, ToastHeader.ATT)
  }
}
</script>
