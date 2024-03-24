<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <h4>Καλωσορίσατε στο dentech!</h4>
    <p>
      Μέσα απο το dentech και βασή του ρολού σας, ο οποιός είναι
      <span class="badge bg-primary">{{ user.role }}</span
      >, μπορείτε να κάνετε τα εξής
    </p>
    <home-admin v-if="user.role === Roles.ADMIN" />
    <home-user v-if="user.role === Roles.UNCATEGORIZED" />
    <home-dentist v-if="user.role === Roles.DENTIST" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore'
import { Roles } from '../types/enums'
import HomeAdmin from '../components/home/HomeAdmin.vue'
import HomeUser from '../components/home/HomeUser.vue'
import HomeDentist from '../components/home/HomeDentist.vue'

const { user } = useUserStore()
</script>

<style scoped>
.card {
  width: 100% !important;
}
</style>
