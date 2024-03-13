<template>
  <div
    class="w-100 d-flex align-items-center flex-column justify-content-center vh-100 auth-wrapper"
  >
    <div class="form-wrapper p-5 rounded shadow">
      <login-component v-if="showLogin" @toggleFormsEmit="toggleForms" />
      <register-component v-else @toggleFormsEmit="toggleForms" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginComponent from '../components/LoginComponent.vue'
import RegisterComponent from '../components/RegisterComponent.vue'

const showLogin = ref(true)

const toggleForms = () => {
  showLogin.value = !showLogin.value
}
</script>

<style scoped>
.form-wrapper {
  width: 75%;
  max-width: 500px;
  background: #81818338;
}

@media (max-width: 650px) {
  .form-wrapper {
    overflow: auto;
    width: 85%;
    padding: 20px 35px !important;
    margin: 15px;
  }
}
</style>
