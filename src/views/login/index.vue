<template>
  <div class="container-fluid px-0">
    <div
      class="row d-flex justify-content-center align-items-center m-0"
      style="height: 100vh"
    >
      <div
        class="col-12 col-md-6 col-lg-6 col-xl-6 d-flex flex-column justify-content-center align-items-center"
        style="padding: 0 10%"
      >
        <h1 class="login-title text-center">Login</h1>
        <p class="wording text-center">
          Silakan masuk dengan nomor HP-mu atau alamat email yang terdaftar
        </p>

        <div class="card wrapper__form my-1">
          <div class="card-header border-bottom-0 py-0 px-0">
            <mks-auth-tab
              :active-tab="authStore.authType"
              @change="changeTab"
            ></mks-auth-tab>
          </div>
          <div class="card-body">
            <div v-if="authStore.authType == 0" class="tab1">
              <div>
                <div class="input-group mb-3">
                  <span class="input-group-text border border-2">+ 62</span>
                  <input
                    type="text"
                    v-model="authStore.phone"
                    class="form-control border border-2 rounded-end"
                    :class="{ 'border-danger': messagePhoneError }"
                    @keyup="validateInputPhoneNumber"
                    @keyup.enter="submit"
                  />
                </div>
                <p class="text-danger">{{ messagePhoneError }}</p>
              </div>
            </div>
            <div v-else class="tab2">
              <input
                type="email"
                v-model="authStore.email"
                class="form-control border border-2"
                :class="{ 'border-danger': messageEmailError }"
                placeholder="name@example.com"
                @keyup.enter="submit"
              />
              <p class="text-danger mt-2">{{ messageEmailError }}</p>
            </div>
          </div>
        </div>
        <mks-button
          size="lg"
          class="mt-4 w-100"
          @click="submit"
          color="primary"
          :loading="loading"
        >
          Login
        </mks-button>
        <p class="mt-5 text-center">
          Belum punya akun?
          <a href="#" class="text-primary" @click.prevent="$router.push('/registration')"
            >Daftar</a
          >
        </p>
      </div>
      <div
        class="col-12 col-md-6 col-lg-6 col-xl-6 p-0 bg-primary d-none d-md-block"
        style="height: 100%"
      >
        <mks-illustration></mks-illustration>
      </div>
    </div>
  </div>

  <mks-otp-method
    v-model:show="showOtpMethodDialog"
    :phone-number="authStore.phone"
    @select="selectMethodOTP"
  ></mks-otp-method>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, watch } from "vue";
import { isNumber, isEmailValid } from "@/helper";
import { useAuthStore } from "@/stores/auth";
import { showErrorNotif, showInfoNotif, showSuccessNotif } from "@/helper/notification";
import http from "@/http-common";

import MksAuthTab from "@/components/organism/auth/MksAuthTab.vue";
import MksIllustration from "@/components/organism/auth/MksIllustration.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import MksOtpMethod from "@/components/organism/MksOtpMethod.vue";

const authStore = useAuthStore();
watch(
  () => authStore.phone,
  () => {
    validationForm();
  }
);
watch(
  () => authStore.email,
  () => {
    validationForm();
  }
);
const messagePhoneError = ref<string>("");
const messageEmailError = ref<string>("");

const changeTab = () => {
  authStore.authType == 0 ? (authStore.authType = 1) : (authStore.authType = 0);
};

const validateInputPhoneNumber = (event: Event) => {
  const _target = event.target as HTMLInputElement;

  if (!isNumber(_target.value)) {
    authStore.phone = authStore.phone.substring(0, _target.value.length - 1);
    return;
  }

  if (_target.value.charAt(0) == "0") {
    authStore.phone = authStore.phone.substring(1);
  }
};

const validationForm = () => {
  if (authStore.authType == 0 && authStore.phone.trim().length == 0) {
    messagePhoneError.value = "Wajib diisi!";
    return false;
  } else {
    messagePhoneError.value = "";
  }

  if (authStore.authType == 1 && authStore.email.trim().length == 0) {
    messageEmailError.value = "Wajib diisi!";
    return false;
  } else {
    messageEmailError.value = "";
  }

  if (authStore.authType == 1 && !isEmailValid(authStore.email)) {
    messageEmailError.value = "Email tidak valid";
    return false;
  } else {
    messageEmailError.value = "";
  }
  return true;
};

const router = useRouter();

const showOtpMethodDialog = ref<boolean>(false);
const selectMethodOTP = (methodID: number) => {
  const _target = event?.target as HTMLDivElement;
  _target.style.opacity = "0.6";

  authStore.selectedOtpMethod = methodID;
  loading.value = true;
  http
    .post("/owl/v1/check-account/check-otp", {
      phone: "62" + authStore.phone,
      method: authStore.selectedOtpMethod,
    })
    .then((result) => {
      const res = result.data;
      if (res.status) {
        showOtpMethodDialog.value = false;
        authStore.tokenFcm = window.sessionStorage.getItem("token_fcm") as string;
        showSuccessNotif(
          `OTP berhasil dikirim melalui ${
            authStore.selectedOtpMethod == 1 ? "Whatsapp" : "SMS"
          }!`
        );
        router.push("/login/confirm-code");
      } else {
        showOtpMethodDialog.value = false;
        showErrorNotif(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const checkingCode = (codeStatus: string) => {
  switch (codeStatus) {
    case "REG-E/I":
      // Account available
      router.push("/login/enter-pin");
      break;
    case "REG-E/II":
      // OTP sended
      if (authStore.authType) {
        showSuccessNotif("OTP berhasil dikirim ke email anda!");
        router.push("/login/confirm-code");
      } else {
        showOtpMethodDialog.value = true;
      }
      break;
    default:
      break;
  }
};

const loading = ref<boolean>(false);
const submit = () => {
  if (!validationForm()) {
    return false;
  }

  loading.value = true;
  const formData = new FormData();
  // authType = 1 is login by email
  authStore.authType
    ? formData.append("email", authStore.email != undefined ? authStore.email : "")
    : formData.append(
        "phone",
        authStore.phone != undefined ? `62${authStore.phone}` : ""
      );

  authStore
    .checkAccountAvailability(formData)
    .then((res) => {
      if (res.status) {
        authStore.tokenFcm = window.sessionStorage.getItem("token_fcm") as string;
        if (res.data.user_type_name == "Owner") {
          // Grant access for owner
          checkingCode(res.data.code);
        } else {
          // Reject access for not owner
          showInfoNotif("Maaf akun anda tidak memiliki akses!");
        }
      } else {
        showInfoNotif(res.message);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.login-title {
  font-size: 30px;
}
.img__responsive {
  width: 230px;
}
.wording {
  color: #b7bed3;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 30px;
}
.wrapper__form {
  width: 100%;
  height: auto;
}

.card {
  .card-header {
    height: 50px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
}
label {
  font-size: 1.2rem !important;
  font-weight: 600;
}
</style>
