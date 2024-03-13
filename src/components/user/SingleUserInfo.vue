<template>
  <div class="w-100">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Πληροφορίες <i class="fa-solid fa-info ms-1"></i
    ></span>
    <div class="card border">
      <div class="card-body text-secondary d-flex flex-wrap justify-content-between">
        <p class="mb-1 ms-1">
          Ονοματεπώνυμο:
          <span class="text-primary text-capitalize">{{ user?.fullName }}</span>
        </p>
        <p class="mb-1 ms-1">
          E-mail:
          <span class="text-primary"
            >{{ user?.email }}<i class="fa-solid fa-envelope ms-1"></i
          ></span>
        </p>
        <p class="mb-1 ms-1">
          Ρόλος:
          <span class="text-primary">
            {{ user?.role }}
            <i v-if="user?.role === Roles.DENTIST" class="fa-solid fa-stethoscope"></i>
            <i v-else-if="user?.role === Roles.UNCATEGORIZED" class="fa-solid fa-user"></i
            ><i v-else class="fa-solid fa-crown"></i>
          </span>
        </p>
        <p class="mb-1 ms-1">
          Κινητό τηλέφωνο:
          <span class="text-primary me-3" v-if="user?.cellPhone">
            {{ user.cellPhone }}
            <i class="fa-solid fa-mobile-screen-button"></i>
          </span>
          <span v-else> -- </span>
        </p>
        <p class="mb-1 ms-1">
          Σταθερό τηλέφωνο:
          <span class="text-primary" v-if="user?.telephone">
            {{ user?.telephone }}
            <i class="fa-solid fa-phone"></i>
          </span>
          <span v-else class="text-primary"> -- </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { User } from '../../types/interfaces'
import { Roles } from '../../types/enums'

defineProps<{
  user: User
}>()
</script>
