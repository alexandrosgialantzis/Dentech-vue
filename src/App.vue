<template>
  <div v-if="userStore.isLoading">
    <spinner-component />
  </div>
  <div class="vh-100 d-flex justify-content-between flex-column" v-else>
    <div>
      <nav-bar v-if="!hideNavBar" />
      <toast-component />
      <div class="p-3 main-wrapper max-w1550 m-auto">
        <router-view />
      </div>
    </div>
    <footer-comp />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ToastComponent from './components/ToastComponent.vue'
import NavBar from './components/NavBar.vue'
import SpinnerComponent from './components/SpinnerComponent.vue'
import { computed } from 'vue'
import { useUserStore } from './stores/userStore'
import FooterComp from './components/FooterComp.vue'

const route = useRoute()
const userStore = useUserStore()

const hideNavBar = computed(() => route.meta.hideNavBar)
</script>
