<template>
  <div class="container-fluid px-0">
    <div
      class="row d-flex justify-content-center align-items-center m-0"
      style="height: 100vh"
    >
      <div
        class="col-12 col-md-6 col-lg-6 col-xl-6 d-flex justify-content-center align-items-center"
      >
        <div
          class="d-flex flex-column align-items-center mx-auto"
          style="max-width: 500px"
        >
          <h1 class="mt-5">Masukan PIN Anda</h1>
          <p class="wording text-center mb-0">Silahkan masukkan PIN anda</p>
          <mks-pin class="mt-4" :digitCount="6" @update:pin="updatePin"></mks-pin>
          <p class="text-primary mt-3 mb-4" v-if="errorMessage">{{ errorMessage }}</p>
          <mks-button
            type="button"
            class="w-100 mt-5"
            size="lg"
            :loading="loading"
            @click="submit"
            >Lanjut</mks-button
          >
          <p class="mt-4">
            Lupa PIN?
            <a href="#" class="text-primary"> Atur Ulang </a>
          </p>
        </div>
      </div>
      <div
        class="col-12 col-md-6 col-lg-6 col-xl-6 p-0 bg-primary d-none d-md-block"
        style="height: 100%"
      >
        <mks-illustration></mks-illustration>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { showErrorNotif } from "@/helper/notification";
import JwtService from "@/core/services/JwtService";
import http from "@/http-common";

import MksPin from "@/components/molecules/MksPin.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import MksIllustration from "@/components/organism/auth/MksIllustration.vue";

const pin = ref<string>("");

const updatePin = (val: any) => {
  errorMessage.value = "";
  pin.value = val;
  submit();
};

const authStore = useAuthStore();
const loading = ref<boolean>(false);
const router = useRouter();
const submit = () => {
  if (!validatePin()) {
    return false;
  }
  loading.value = true;
  const formData = new FormData();

  authStore.authType
    ? formData.append("email", authStore.email)
    : formData.append("phone", `62${authStore.phone}`);
  formData.append("pin", pin.value);
  formData.append("fcm_token", authStore.tokenFcm || "");

  http
    .post("/owl/v1/login", formData)
    .then((result) => {
      const res = result.data;
      if (res.status) {
        JwtService.saveToken(res.data.access_token);
        router.go(-1);
      } else {
        errorMessage.value = res.message;
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      loading.value = false;
    });
};

const errorMessage = ref<string>("");
const validatePin = () => {
  if (pin.value.length < 6) {
    errorMessage.value = "Silahkan masukkan PIN anda dengan benar";
    return false;
  }
  errorMessage.value = "";
  return true;
};

onMounted(() => {
  if (!authStore.phone && !authStore.email) {
    router.back();
  }
});
</script>

<style lang="scss" scoped>
.bg__primary {
  background-color: #e60023;
}

.wording {
  color: #b7bed3;
  font-weight: 500;
  font-size: 15px;
}

.mt__cust {
  margin-top: 30px !important;
}
</style>
