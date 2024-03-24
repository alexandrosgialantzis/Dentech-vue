<template>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/my-profile'" class="btn btn-primary">
      Προφιλ <i class="fa-solid fa-user ms-1"></i
    ></router-link>
  </div>
  <p>Μπορείτε να δείτε και να διαχειριστήτε τα δεδομένα σχετίκα με το δικό σας προφίλ.</p>
  <spinner-component v-if="loading" :use-margin-top="true" />
  <div
    v-if="!loading && admins?.length"
    class="d-flex justify-content-center align-items-center flex-column w-100"
  >
    <p>
      Μπορείτε να ενημερώσετε για τη δημιουργία του λογαριασμού σας στους παρακάτω διαχειριστές ώστε
      να αλλαξούν το ρολό σας με σκοπό να ξεκινήστε να βλέπετε παραγγελίες.
    </p>
    <users-card :users="admins" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { User, UsersResponse } from '../../types/interfaces'
import { userHttp } from '../../services/userHttp'
import { Roles, ToastConclusion, ToastHeader } from '../../types/enums'
import { useToastStore } from '../../stores/toastStore'
import SpinnerComponent from './../SpinnerComponent.vue'
import UsersCard from './../user/UsersCard.vue'

const admins = ref<null | User[]>(null)
const loading = ref(false)

const toast = useToastStore()

onMounted(async () => {
  await getAdmins()
})

const getAdmins = async () => {
  try {
    loading.value = true
    const res = await userHttp.get<UsersResponse<User>>(`/get-admins?searchString=${Roles.ADMIN}`)
    admins.value = res.data.users
  } catch (error) {
    toast.showToast('Δεν βρέθηκαν διαχειριστές!', ToastHeader.ERROR, ToastConclusion.ERROR)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
p,
a {
  width: 100%;
  max-width: 700px;
}
</style>
