<template>
  <h1 class="mt-3">Konfirmasi Kode</h1>
  <p class="wording text-center mb-0" v-if="!authStore.authType">
    Kami telah mengirimkan kode OTP kepada nomor<br />
    <span class="text-primary">(+62) {{ authStore.phone }}</span
    >. Silahkan isi kode OTP
  </p>
  <p class="wording mb-5 text-center" v-else>
    kami telah mengirimkan kode OTP ke email anda
  </p>

  <mks-pin
    class="my-5"
    :input-type="'text'"
    :digitCount="6"
    @update:pin="updatePin"
  ></mks-pin>

  <mks-button :loading="loading" size="lg" class="w-100" @click="submit"
    >Konfirmasi</mks-button
  >

  <p class="mt-3 mb-0 fw-semibold timer__font_size">{{ formattedTimeLeft }}</p>

  <p class="mt-3 mb-0">Tidak mendapatkan kode?</p>
  <a
    href="#"
    v-if="activeResend"
    class="mt-1 text-danger opacity-1"
    @click.prevent="resend"
    >Kirim Ulang</a
  >
  <p v-else class="text-danger opacity-05 mt-1">Kirim Ulang</p>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { showErrorNotif, showInfoNotif, showSuccessNotif } from "@/helper/notification";
import http from "@/http-common";

import MksPin from "@/components/molecules/MksPin.vue";
import MksButton from "@/components/atoms/MksButton.vue";

const authStore = useAuthStore();

const emit = defineEmits(["next"]);

const confirmationCode = ref<string>("");
const updatePin = (val: any) => {
  confirmationCode.value = val;
  submit();
};

const timeLimit = ref<number>(120);
const timePassed = ref<number>(0);
const timerInterval = ref<any>(null);

const timeLeft = computed(() => timeLimit.value - timePassed.value);

const formattedTimeLeft = computed(() => {
  let timeLeftStart: number = timeLeft.value;
  let minutes: number = Math.floor(timeLeftStart / 60);
  let seconds: number = timeLeftStart % 60;

  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
});

const activeResend = computed(() => (formattedTimeLeft.value == "00:00" ? true : false));

const onTimesUp = () => {
  clearInterval(timerInterval.value);
};

const startTimer = () => {
  timerInterval.value = setInterval(() => (timePassed.value += 1), 1000);
};

const changeStartTimer = (limit: number) => {
  timeLimit.value = limit;
  timePassed.value = 0;
  timerInterval.value = null;
};

watch(timeLeft, (newVal) => {
  if (newVal === 0) {
    onTimesUp();
  }
});

const checkingCode = (
  codeStatus: string,
  message: string = "Terjadi kesalahan server"
) => {
  switch (codeStatus) {
    case "REG-E/V":
      emit("next");
      break;
    case "REG-E/VI":
      showErrorNotif('Kode OTP tidak ditemukan');
      break;
    default:
      showInfoNotif(message);
      break;
  }
};

const loading = ref<boolean>(false);
const submit = () => {
  loading.value = true;
  const formData = new FormData();
  authStore.authType
    ? formData.append("email", authStore.email)
    : formData.append("phone", "62" + authStore.phone);
  formData.append("code", confirmationCode.value);

  http
    .post("/owl/v1/check-account/regist/check-otp", formData)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        checkingCode(res.data.code, res.message);
      } else {
        showErrorNotif(res.message);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => (loading.value = false));
};

const resend = () => {
  if (authStore.authType) {
    changeStartTimer(120);
    startTimer();
    const formData = new FormData();
    formData.append("email", authStore.email);
    authStore
      .checkEmailAvailability(formData)
      .then((res) => {
        if (res.status) {
          showSuccessNotif("OTP berhasil dikirim ke email anda!");
        } else {
          showErrorNotif(res.message);
        }
      })
      .catch(() => {
        showErrorNotif("Terjadi kesalahan server");
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    changeStartTimer(120);
    startTimer();

    authStore
      .checkPhoneAvailability({
        phone: authStore.phone,
        method: authStore.selectedOtpMethod,
      })
      .then((res) => {
        if (res.status) {
          showSuccessNotif(
            `OTP berhasil dikirim melalui ${
              authStore.selectedOtpMethod == 1 ? "Whatsapp" : "SMS"
            }!`
          );
        } else {
          showErrorNotif(res.message);
        }
      })
      .catch(() => {
        showErrorNotif("Terjadi kesalahan server");
      });
  }
};

onMounted(() => {
  timeLimit.value = 120;
  startTimer();
});
</script>

<style lang="scss" scoped>
.wording {
  color: #b7bed3;
  font-weight: 500;
  font-size: 15px;
}

.timer__font_size {
  font-size: 2rem;
}

.opacity-1 {
  opacity: 1;
}

.opacity-05 {
  opacity: 0.5;
}
</style>
