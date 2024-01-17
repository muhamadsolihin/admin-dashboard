<template>
  <h1 class="mt-3">Setting PIN</h1>
  <p class="wording mb-0 text-center">
    Atur PIN yang akan anda set sebagai password akun anda
  </p>
  <mks-pin class="my-5" :digitCount="6" @update:pin="updatePin"></mks-pin>
  <p class="mt-3 text-center">
    Ingat-ingat PIN anda untuk melanjutkan<br />konfirmasi nomor PIN.
  </p>
  <mks-button size="lg" class="w-100 mt-3" @click="nextStep">Konfirmasi PIN</mks-button>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

import MksPin from "@/components/molecules/MksPin.vue";
import MksButton from "@/components/atoms/MksButton.vue";

const authStore = useAuthStore();
const updatePin = (val: any) => {
  authStore.settingPin = val;
  nextStep();
};

const emit = defineEmits(["next"]);
const nextStep = () => {
  emit("next");
};
</script>

<style lang="scss" scoped>
.wording {
  color: #b7bed3;
  font-weight: 500;
  font-size: 15px;
}
</style>
