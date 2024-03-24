<template>
  <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
    >Γενικές πληροφορίες<i class="fa-solid fa-info ms-1"></i
  ></span>
  <div class="card shadow mb-2">
    <div class="card-body d-flex flex-wrap justify-content-between">
      <p class="m-1">
        <span class="me-1">Tιμή:</span>
        <span class="text-primary">{{ product?.price }}€</span>
      </p>
      <p class="m-1">
        <span class="me-1">Ονομα:</span>
        <span class="text-primary text-capitalize">{{ product?.name }}</span>
      </p>
    </div>
  </div>
  <span class="badge bg-primary fs-6 fw-normal p-2 w-100 mb-2"
    >Δημιουργός προιόντος<i class="fa-solid fa-user ms-1"></i
  ></span>
  <div class="card shadow" v-if="product?.createdBy">
    <div class="card-body d-flex flex-wrap justify-content-between">
      <p class="m-1">
        <span class="me-1">Ον/Επ:</span>
        <span class="text-primary text-capitalize">{{ product?.createdBy?.fullName }}</span>
      </p>
      <p class="m-1">
        <span class="me-1">Ε-mail:</span>
        <span class="text-primary"
          >{{ product?.createdBy?.email }} <i class="fa-solid fa-envelope"></i
        ></span>
      </p>
      <p class="m-1">
        <span class="me-1">Κινητό τηλέφωνο:</span>
        <span class="text-primary" v-if="product?.createdBy?.cellPhone"
          >{{ product?.createdBy?.cellPhone }} <i class="fa-solid fa-mobile-screen-button"></i
        ></span>
        <span class="text-primary" v-else>--</span>
      </p>
    </div>
    <div class="card-footer">
      <router-link :to="`/profile/${product?.createdBy?._id}`">Προφίλ</router-link>
    </div>
  </div>
  <not-found-entity
    v-if="!product.createdBy"
    :message="'Δεν βρέθηκε ο χρήστης'"
    :use-margin-top="true"
  />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { Product } from '../../types/interfaces'
import NotFoundEntity from '../NotFoundEntity.vue'

defineProps<{
  product: Product
}>()
</script>
