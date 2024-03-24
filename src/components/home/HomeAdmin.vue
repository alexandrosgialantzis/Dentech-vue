<template>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/my-profile'" class="btn btn-primary">
      Προφιλ <i class="fa-solid fa-user ms-1"></i
    ></router-link>
  </div>
  <p>Μπορείτε να δείτε και να διαχειριστήτε τα δεδομένα σχετίκα με το δικό σας προφίλ.</p>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/users'" class="btn btn-primary">
      Χρήστες<i class="fa-solid fa-users ms-1"></i>
    </router-link>
  </div>
  <p>
    Μπορείτε να δείτε δεδομένα σχετίκα με όλους τους χρήστες, πηγαίνοντας στο προφίλ του καθέ χρήστη
    μπορείτε να αλλάξετε μόνο το ρόλο του.
  </p>

  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/products'" class="btn btn-primary">
      Προιόντα<i class="fa-solid fa-tooth ms-1"></i>
    </router-link>
  </div>
  <p>
    Μπορείτε να δείτε όλα με τα δεδομένα των προιόντων, επίσης μπορείτε να δημιουργήσετε νέα
    προιόντα, πηγαίνοντας στο προφίλ του καθέ προιόντος μπορείτε διαχειριστήτε το οτιδήποτε σχετίκα
    με το προιόν και να το διαγράψετε.
  </p>
  <div class="w-100 d-flex justify-content-center align-items-center">
    <router-link :to="'/orders'" class="btn btn-primary">
      Παραγγελίες<i class="fa-solid fa-truck-fast ms-1"></i
    ></router-link>
  </div>
  <p>
    Μπορείτε να δείτε όλα με τα δεδομένα σχετίκα με τις παραγγελίες, επίσης μπορείτε να
    δημιουργήσετε νέα παραγγελία, πηγαίνοντας στο προφίλ της καθέ παραγγελίας μπορείτε διαχειριστήτε
    το οτιδήποτε σχετίκα με τη παραγγελία ή να τη διαγράψετε.
  </p>
</template>

<script setup lang="ts"></script>

<style scoped>
p,
a {
  width: 100%;
  max-width: 700px;
}
</style>
