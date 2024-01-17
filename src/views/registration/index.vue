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
        <h1 class="login-title text-center">Registrasi</h1>
        <p class="wording text-center">
          Silahkan pilih salah satu form untuk melanjutkan registrasi
        </p>

        <div class="card wrapper__form my-1">
          <div class="card-header border-bottom-0 py-0 px-0">
            <mks-auth-tab
              :active-tab="authStore.authType"
              @change="changeTab"
            ></mks-auth-tab>
          </div>
          <div class="card-body">
            <figure>
              <div v-if="authStore.authType == 0" class="tab1">
                <div>
                  <div class="input-group mb-3">
                    <span class="input-group-text border border-2">+ 62</span>
                    <input
                      type="text"
                      v-model="authStore.phone"
                      class="form-control border border-2 rounded-end"
                      :class="{ 'border-danger': messagePhoneError }"
                      @keyup.enter="submit"
                      @keyup="validateInputPhoneNumber"
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
            </figure>
          </div>
        </div>
        <mks-button
          size="lg"
          class="mt-4 w-100"
          @click="submit"
          color="primary"
          :loading="loading"
        >
          Lanjut
        </mks-button>
        <p class="mt-5 text-center">
          Sudah punya akun?
          <a href="#" class="text-primary" @click.prevent="$router.push('/login')"
            >Login</a
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
import { isEmailValid, isNumber } from "@/helper";
import { showErrorNotif, showInfoNotif, showSuccessNotif } from "@/helper/notification";
import { useAuthStore } from "@/stores/auth";

import MksAuthTab from "@/components/organism/auth/MksAuthTab.vue";
import MksIllustration from "@/components/organism/auth/MksIllustration.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import MksOtpMethod from "@/components/organism/MksOtpMethod.vue";

const loading = ref<boolean>(false);
const showOtpMethodDialog = ref<boolean>(false);

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
const messageEmailError = ref<string>("");
const messagePhoneError = ref<string>("");

const router = useRouter();

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

const selectMethodOTP = (methodID: number) => {
  loading.value = true;
  showOtpMethodDialog.value = false;
  authStore.selectedOtpMethod = methodID;
  authStore
    .checkPhoneAvailability({
      phone: "62" + authStore.phone,
      method: authStore.selectedOtpMethod,
    })
    .then((res) => {
      if (res.status) {
        showSuccessNotif(
          `OTP berhasil dikirim melalui ${
            authStore.selectedOtpMethod == 1 ? "Whatsapp" : "SMS"
          }!`
        );

        router.push("/registration/step");
      } else {
        showErrorNotif(res.message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
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

const checkingCode = (codeStatus: string) => {
  switch (codeStatus) {
    case "REG-E/I":
      // Account available
      showInfoNotif(
        `${authStore.authType ? "Email" : "Nomor"} sudah didaftarkan. Silahkan login.`
      );
      break;
    case "REG-E/II":
      // OTP sended
      if (authStore.authType) {
        showSuccessNotif("OTP berhasil dikirim ke email anda!");
        router.push("/registration/step");
      } else {
        showOtpMethodDialog.value = true;
      }
      break;
    case "REG-E/III":
      // Email is bouncing
      showInfoNotif("Email tidak valid. Silahkan coba lagi atau ganti email anda.");
      break;
    case "REG-E/IV":
      // Waiting 2 minutes
      showInfoNotif("Tunggu 2 menit untuk mendaftar dan mendapatkan OTP kembali");
      break;
    default:
      break;
  }
};

const submit = () => {
  if (!validationForm()) {
    return false;
  }

  loading.value = true;
  const formData = new FormData();
  authStore.authType
    ? formData.append("email", authStore.email != undefined ? authStore.email : "")
    : formData.append(
        "phone",
        authStore.phone != undefined ? `62${authStore.phone}` : ""
      );

  if (authStore.authType) {
    authStore
      .checkEmailAvailability(formData)
      .then((res) => {
        if (res.status) {
          checkingCode(res.data.code);
        }
      })
      .catch(() => {
        showErrorNotif("Terjadi kesalahan server");
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    authStore
      .checkAccountAvailability(formData)
      .then((res) => {
        if (!res.status) {
          showOtpMethodDialog.value = true;
        } else {
          checkingCode(res.data.code);
        }
      })
      .catch(() => {
        showErrorNotif("Terjadi kesalahan server");
      })
      .finally(() => {
        loading.value = false;
      });
  }
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
  #navtab {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: 100%;
  }
  .tab-1 {
    border-top-left-radius: 20px;
  }
  .tab-2 {
    border-top-right-radius: 20px;
  }
}
label {
  font-size: 1.2rem !important;
  font-weight: 600;
}
.tabs {
  background-color: #f1f3f6;
  color: #9c9d9d;
  cursor: pointer;
  height: 50px;
  transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.active__tab {
  background-color: white;
  color: black;
}
</style>
