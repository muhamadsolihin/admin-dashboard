<template>
  <div>
    <div class="card p-3" style="border-bottom: 1px solid #e6ecf5">
      <div class="card-body">
        <div class="d-flex justify-content-start flex-row align-items-center flex-wrap">
          <div class="d-flex justify-content-start align-items-start me-auto flex-wrap">
            <a @click.prevent="$router.back" class="me-1" href="#"
              ><img
                class="d-flex align-items-center py-2 me-3 justify-content-center"
                src="@/assets/images/icons/back.svg"
            /></a>
            <mks-title
              title="Cairkan Saldo"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            ></mks-title>
          </div>

          <div class="row g-3">
            <div class="col-12 col-md-9 d-flex">
              <div class="card d-flex flex-column p-3 flex w-100">
                <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
                  <div
                    class="field-section"
                    style="border: none; border-bottom: 1px solid #e6ecf5"
                  >
                    <label
                      for="price"
                      class="form-label text-center justify-content-center d-flex"
                      >Masukkan Jumlah Pencairan</label
                    >
                    <Field
                      name="amount"
                      rules="required"
                      v-model="amount"
                      class="d-none"
                    />
                    <InputCurrency
                      :value="amount"
                      :class="{ 'border-danger': errors.amount }"
                      @update:value="(newValue) => (amount = newValue)"
                    />
                    <p class="text-danger mt-2">{{ errors.amount }}</p>
                  </div>
                  <p class="mb-1 d-none">Bank Penerima:</p>
                  <div class="d-none bank-account card p-2 w-50">
                    <p class="mb-0 fw-600">
                      {{ bankAccount.bank_account_number }} ({{
                        bankAccount.bank_name_holder
                      }})
                    </p>
                    <p class="mb-0">{{ bankAccount.bank_name }}</p>
                  </div>
                  <div class="d-flex w-100 flex-wrap mt-3 mb-0">
                    <div class="d-flex me-auto" style="color: #a0a7bc">
                      Sisa saldo anda :
                    </div>
                    <p class="mb-0 text-center text__regent_grey d-flex ms-auto fw-500">
                      (Rp 
                      <span class="ms-1" style="color: black; font-size: 1rem;">{{
                        formatCurrency(balance.total_balance)
                      }}</span
                      >)
                    </p>
                  </div>
                </Form>
              </div>
            </div>

            <div class="col-12 col-md-3">
              <div class="row">
                <div class="col-12 mb-3">
                  <div
                    class="px-3 py-4 card d-flex flex-column justify-content-center align-items-center"
                  >
                    <h1 class="mb-0 fw-500">
                      Rp {{ formatCurrency(balance.hold_balance) }}
                    </h1>
                    <p class="mb-0 text-primary text-center fw-500">Saldo Tertahan</p>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="px-3 py-4 card d-flex flex-column justify-content-center align-items-center"
                  >
                    <h1 class="mb-0 fw-500">Rp {{ formatCurrency(balance.balance) }}</h1>
                    <p class="mb-0 text-primary text-success fw-500">Dapat Dicairkan</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="alert__app d-flex flex-row align-items-center">
                <img src="@/assets/images/icons/warning.svg" class="w-30 mb-0" />
                <p class="mb-0 text-primary ms-3">
                  Minimum penarikan dana <span class="fw-600">Rp100,000</span>. Biaya
                  Admin
                  <span class="fw-600">Rp. {{ formatCurrency(cost) }}</span> dipotong
                  saldo
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="d-flex justify-content-end mt-4"
          style="border: none; border-top: 1px solid #e6ecf5"
        >
          <mks-button
            type="submit"
            size="lg"
            :loading="loading"
            class="mt-3"
            @click="onSubmit"
            color="primary"
          >
            Cairkan Saldo
          </mks-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

import { formatCurrency } from "@/helper";
import AuthModule from "@/store/modules/AuthModule";
import BalanceModule from "@/store/modules/BalanceModule";
import { getModule } from "vuex-module-decorators";
import { UserAccess } from "@/types/auth/UserAccess.interface";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import InputCurrency from "@/components/inputCurrency.vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { Form, Field } from "vee-validate";

const balanceState = getModule(BalanceModule);

const loading = ref<boolean>(false);
const authState = getModule(AuthModule);
const balance = computed(() => balanceState.getBalance);
const userAccess = computed((): UserAccess => authState.getUserAccessByCode("MGBTRANS"));
const amount = ref<string>("");

const getBalance = () => {
  loading.value = true;
  balanceState.getCurrentBalance().finally(() => {
    loading.value = false;
  });
};

const router = useRouter();

const cost = ref<number>(0);
const loadingSubmit = ref<boolean>(false);
const bankAccount = computed(() => authState.getUserBankAccount);

const onSubmit = () => {
  loadingSubmit.value = true;
  let formData = new FormData();
  formData.append("amount", amount.value);
  formData.append("bank_id", bankAccount.value.id.toString());
  authState
    .createRefund(formData)
    .then((res) => {
      if (res.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: res.message,
        });
        router.push("/balance/current");
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 2000,
          customClass: "errorNotif",
          message: res.message,
        });
      }
    })
    .catch(() => {
      ElNotification({
        title: "Error",
        type: "error",
        duration: 2000,
        customClass: "errorNotif",
        message: "Terjadi kesalahan server",
      });
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};


onMounted(() => {
  getBalance();
});

onMounted(() => {
  authState.SET_BANK_ACCOUNT;
  authState.getBankAccount();
  authState
    .getDisbursementCost()
    .then((res) => {
      if (res.status) {
        cost.value = res.data;
      }
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
});
</script>

<style lang="scss" scoped>
.card-sub-balance {
  width: 194px;
  height: 111px;
  background: #ffffff;
  border: 1px solid #e4e8f4;
  border-radius: 12px;
}
.alert__app {
  padding: 20px;
  z-index: 999;
  border-radius: 10px;
  background-color: #fff2f4;
  border: 1px dashed #ffa9b2;
  right: 45px;
}
</style>
