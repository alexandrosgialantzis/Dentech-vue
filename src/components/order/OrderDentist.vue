<template>
  <div class="col-lg-4 p-2 mb-2">
    <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
      >Οδοντίατρος<i class="fa-solid fa-stethoscope ms-1"></i
    ></span>
    <div class="card shadow" v-if="dentist">
      <div class="card-body d-flex flex-wrap justify-content-between">
        <p class="m-1">
          <span class="me-1"> Oν/Επ:</span>
          <span class="text-primary">{{ dentist?.fullName }} </span>
        </p>
        <p class="m-1">
          <span class="me-1"> E-mail:</span>
          <span class="text-primary"
            >{{ dentist?.email }}<i class="fa-solid fa-envelope ms-1"></i
          ></span>
        </p>
        <p class="m-1">
          <span class="me-1"> Κινητό τηλέφωνο:</span>
          <span class="text-primary" v-if="dentist?.cellPhone"
            >{{ dentist?.telephone }} <i class="fa-solid fa-mobile-screen-button ms-1"></i
          ></span>
          <span class="text-primary" v-else>--</span>
        </p>
        <p class="mb-0 mx-1 mt-1">
          <span class="me-1"> Σταθερό τηλέφωνο:</span>
          <span class="text-primary" v-if="dentist?.telephone"
            >{{ dentist?.telephone }} <i class="fa-solid fa-phone ms-1"></i
          ></span>
          <span class="text-primary" v-else>--</span>
        </p>
      </div>
      <div class="card-footer text-center `">
        <router-link :to="id === dentist?._id ? '/my-profile' : `/profile/${dentist?._id}`">
          Προφίλ
        </router-link>
      </div>
    </div>
    <div class="card shadow pb-3" v-else>
      <not-found-entity :message="'Δεν βρέθηκε ο ιατρός'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { User } from '../../types/interfaces'
import NotFoundEntity from '../NotFoundEntity.vue'

defineProps<{
  dentist: User
  id: string
}>()
</script>
