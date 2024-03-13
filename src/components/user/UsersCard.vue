<template>
  <div
    v-for="(user, index) in users"
    :key="index"
    :class="['card mt-2 shadow', `${users.length < 3 ? 'me-5' : ''}`]"
  >
    <div class="p-2 card-header">
      <span class="me-1 ps-2">Ον/Eπ:</span>
      <span class="text-primary text-capitalize">{{ user?.fullName }}</span>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item pe-2">
        <span class="me-1">E-mail:</span>
        <span class="text-primary"
          >{{ user?.email }}<i class="fa-solid fa-envelope ms-1"></i>
        </span>
      </li>
      <li class="list-group-item pe-2">
        <span class="me-1">Ρόλος:</span>
        <span class="text-primary"
          >{{ user?.role }}
          <i v-if="user?.role === Roles.DENTIST" class="fa-solid fa-stethoscope"></i>
          <i v-else-if="user?.role === Roles.UNCATEGORIZED" class="fa-solid fa-user"></i
          ><i v-else class="fa-solid fa-crown"></i
        ></span>
      </li>
      <li class="list-group-item pe-2">
        <span class="me-1"> Σταθερό τηλέφωνο:</span>
        <span class="text-primary" v-if="user?.telephone"
          >{{ user?.telephone }} <i class="fa-solid fa-phone"></i
        ></span>
        <span class="text-primary" v-else>--</span>
      </li>
      <li class="list-group-item pe-2">
        <span class="me-1"> Κινήτο τηλέφωνο:</span>
        <span class="text-primary" v-if="user?.cellPhone"
          >{{ user?.cellPhone }} <i class="fa-solid fa-mobile-screen-button"></i
        ></span>
        <span class="text-primary" v-else>--</span>
      </li>
    </ul>
    <div class="d-flex align-items-center justify-content-center p-2 card-footer">
      <router-link :to="`profile/${user?._id}`">Προφίλ</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { User } from '../../types/interfaces'
import { Roles } from '../../types/enums'

defineProps<{
  users: User[]
}>()
</script>

<style scoped>
.card {
  width: 33%;
  background-color: #4c4d4e10;
}

@media (max-width: 1190px) {
  .card {
    width: 49% !important;
    margin: 10px 0 0 5px !important;
  }
}

@media (max-width: 690px) {
  .card {
    width: 100% !important;
    margin: 10px 0 0 !important;
  }
}
</style>
