<template>
  <h1 class="mt-3">Konfirmasi PIN</h1>
  <p class="wording mb-0 text-center">
    Atur PIN yang akan anda set sebagai password akun anda
  </p>
  <mks-pin class="my-5" :digitCount="6" @update:pin="updatePin"></mks-pin>
  <p class="text-primary mt-3 mb-4" v-if="errorMessage">{{ errorMessage }}</p>
  <p class="mt-3 text-center">Masukan nomor PIN yang anda setting sebelum ini.</p>
  <mks-button :loading="loading" size="lg" class="w-100 mt-3" @click="nextStep"
    >Konfirmasi PIN</mks-button
  >
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import MksPin from "@/components/molecules/MksPin.vue";
import MksButton from "@/components/atoms/MksButton.vue";

const updatePin = (val: any) => {
  authStore.confirmationPin = val;
  nextStep();
};
const errorMessage = ref<string>("");
const loading = ref<boolean>(false);

const router = useRouter();
const authStore = useAuthStore();

const nextStep = () => {
  loading.value = true;
  if (authStore.confirmationPin == authStore.settingPin) {
    setTimeout(() => {
      router.push("/registration/outlet");
      loading.value = false;
    }, 2000);
    return;
  } else {
    errorMessage.value = "PIN yang anda masukkan tidak sesuai";
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.wording {
  color: #b7bed3;
  font-weight: 500;
  font-size: 15px;
}
</style>
