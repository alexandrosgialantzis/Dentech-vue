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
          <h5 class="modal-title" id="exampleModalLabel">Δημιουργία χρήστη</h5>
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
                >Ονοματεπώνυμο <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" id="name" v-model="fullName" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label"
                >E-mail <span class="text-danger fs-6">*</span></label
              >
              <input type="text" class="form-control" id="email" v-model="email" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label"
                >Κωδίκος <span class="text-danger fs-6">*</span></label
              >
              <input type="password" class="form-control" id="password" v-model="password" />
            </div>
            <div class="mb-3">
              <label for="cellPhone" class="form-label">Κινητό τηλέφωνο</label>
              <input type="number" class="form-control" id="cellPhone" v-model="cellPhone" />
              <div class="form-text">Δέχεται μόνο αριθμούς.</div>
            </div>
            <div class="mb-3">
              <label for="telephone" class="form-label">Σταθερό τηλέφωνο</label>
              <input type="number" class="form-control" id="telephone" v-model="telephone" />
              <div class="form-text">Δέχεται μόνο αριθμούς.</div>
            </div>
            <select class="form-select mb-1" @change="onChange">
              <option selected disabled>Επιλέξτε ρόλο</option>
              <option v-for="role in Object.values(Roles)" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
            <p class="form-text"><span class="text-danger fs-6">*</span> Αναγκαία πεδία.</p>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Κλείσιμο
          </button>
          <button type="button" class="btn btn-success" @click="createUser" :disabled="creating">
            <span v-if="!creating"
              >Δημιουργία χρήστη<i class="fa-solid fa-user-plus ms-1"></i
            ></span>
            <button-content v-else />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Roles, ToastConclusion, ToastHeader } from '../../types/enums'
import { MessageResponse, User, UserPayload, UserResponse } from '../../types/interfaces'
import ButtonContent from '../ButtonContent.vue'
import { useDoctorStore } from '../../stores/doctorStore'
import { userHttp } from '../../services/userHttp'
import { AxiosError } from 'axios'
import { useToastStore } from '../../stores/toastStore'

const emit = defineEmits(['create'])

const toast = useToastStore()
const doctors = useDoctorStore()

const fullName = ref('')
const telephone = ref<null | number>(null)
const cellPhone = ref<null | number>(null)
const email = ref('')
const role = ref(Roles.UNCATEGORIZED)
const password = ref('')
const creating = ref(false)

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  role.value = target.value as Roles
}

const createUser = async () => {
  try {
    creating.value = true
    const payload: UserPayload = {
      fullName: fullName.value,
      email: email.value,
      role: role.value,
      password: password.value
    }

    if (telephone.value) {
      payload.telephone = telephone.value
    }

    if (cellPhone.value) {
      payload.cellPhone = cellPhone.value
    }

    if (role.value === Roles.DENTIST) {
      doctors.isFetched = false
    }

    const res = await userHttp.post<UserResponse<User>>('/create-user', payload)
    emit('create', res.data.user)
    toast.showToast(res.data.message, ToastHeader.SUCCESS, '')

    fullName.value = ''
    email.value = ''
    password.value = ''
    cellPhone.value = null
    telephone.value = null
  } catch (e) {
    const error = e as AxiosError<MessageResponse>
    toast.showToast(error.response.data.message, ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    creating.value = false
  }
}
</script>
