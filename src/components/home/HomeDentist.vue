<template>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/my-profile'" class="btn btn-primary">
      Προφιλ <i class="fa-solid fa-user ms-1"></i
    ></router-link>
  </div>
  <p>Μπορείτε να δείτε και να διαχειριστήτε τα δεδομένα σχετίκα με το δικό σας προφίλ.</p>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/my-orders'" class="btn btn-primary">
      Παραγγελίες<i class="fa-solid fa-truck-fast ms-1"></i
    ></router-link>
  </div>
  <p>Μπορείτε να δείτε τα δεδομένα των παραγγελιών οπώς την κατάσταση, προιόντα κτλ.</p>
</template>

<script setup lang="ts"></script>

<style scoped>
p,
a {
  width: 100%;
  max-width: 700px;
}
</style>
