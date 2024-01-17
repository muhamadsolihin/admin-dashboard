<template>
  <div>
    <div class="card p-3">
      <div class="card-body">
        <div
          class="d-flex justify-content-start flex-row align-items-center flex-wrap pb-2"
          style="border-bottom: 1px solid #e6ecf5; margin-bottom: 30px"
        >
          <mks-title
            title="Detail Saldo"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              illo nisi harum facere dignissimos hic culpa non! Iusto sapiente
              vero voluptates,"
          >
          </mks-title>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="card p-4">
              <div class="border-bottom w-100 pb-3">
                <p class="mb-0 text-center">Total Saldo</p>
                <p class="mb-0 text-center text-secondary fw-500">
                  Rp.
                  <span
                    class="text-money"
                    style="color: black; font-size: 3rem; font-weight: 600"
                    >{{ formatCurrency(balance.total_balance) }}</span
                  >
                </p>
              </div>
              <div
                class="d-flex flex-row justify-content-between flex-wrap mt-3"
              >
                <p class="mb-1 text-left text-secondary fw-500">
                  Sisa subsidi:
                </p>
                <p
                  class="mb-0 fw-500"
                  v-if="
                    userAccess.amount != null &&
                    userAccess.default_amount != null
                  "
                >
                  Rp {{ formatCurrency(userAccess.amount) }}
                  <span class="text-secondary"
                    >dari Rp
                    {{ formatCurrency(userAccess.default_amount) }}</span
                  >
                </p>
                <p class="mb-0 fw-500" v-else>Anda tidak memiliki subsidi</p>
              </div>
              <div
                class="d-flex flex-row justify-content-between flex-wrap mt-1"
                v-if="userAccess.expired_date"
              >
                <p class="mb-0 text-left text-secondary fw-500">
                  Kedaluwarsa subsidi:
                </p>
                <p class="mb-0">
                  {{
                    epochToDateTime(
                      userAccess.expired_date,
                      "DD MMM YYYY, HH:mm"
                    )
                  }}
                </p>
              </div>
            </div>

            <div class="row g-3 mt-1">
              <div class="col-12 col-md-6">
                <div
                  class="card p-3 d-flex flex-column align-items-center justify-content-center"
                >
                  <p class="mb-0 fw-500 fs-20">
                    Rp {{ formatCurrency(balance.hold_balance) }}
                  </p>
                  <p class="mb-0 text-primary text-center fw-500">
                    Saldo Tertahan
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div
                  class="card p-3 d-flex flex-column align-items-center justify-content-center"
                >
                  <p class="mb-0 fw-500 fs-20">
                    Rp {{ formatCurrency(balance.balance) }}
                  </p>
                  <p class="mb-0 text-primary text-center text-success fw-500">
                    Dapat Dicairkan
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <p class="mb-2 fw-600 fs-20">Catatan</p>
            <ol>
              <li v-for="(note, indexNote) in notes" :key="indexNote">
                <p class="mb-2" style="line-height: 25px">{{ note }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div
        class="d-flex justify-content-end"
        style="border: none; border-top: 1px solid #e6ecf5"
      >
        <mks-button
          type="submit"
          size="lg"
          class="mt-4"
          @click="refundBalance"
          color="primary"
        >
          Cairkan Saldo
        </mks-button>
      </div>
    </div>
  </div>
  <ConfirmVerifModal v-model:show="showModalVerif" />
  <VerifyProcessModal v-model:show="showModalProcess" />
</template>

<script lang="ts" setup>
import http from "@/http-common";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { epochToDateTime, formatCurrency } from "@/helper";
import { Balance } from "@/types/balance/Balance.interface";
import { useAuthStore } from "@/stores/auth";

import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import ConfirmVerifModal from "../auth/ConfirmVerifModal.vue";
import VerifyProcessModal from "../auth/VerifyProcessModal.vue";

const loadingPage = ref<boolean>(false);
const balance = ref<Balance>({
  balance: 0,
  hold_balance: 0,
  total_balance: 0,
});

const getBalance = async () => {
  loadingPage.value = true;
  try {
    const {
      data: { status, data },
    } = await http.get(`/owl/v1/balance/`);
    if (status) {
      balance.value = data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingPage.value = false;
  }
};

const authStore = useAuthStore();

onMounted(() => {
  getBalance();
  authStore.fetchUserAccess();
});

const router = useRouter();
const showModalProcess = ref<boolean>(false);
const showModalVerif = ref<boolean>(false);

const refundBalance = () => {
  if (authStore.userProfile.verified == 1) {
    router.push("/balance/add");
  } else if (authStore.userProfile.is_waiting_verified == 1) {
    showModalProcess.value = true;
  } else {
    showModalVerif.value = true;
  }
};

const notes = [
  "Permintaan pencairan saldo akan diproses selama 1x24 jam.",
  "Untuk pencairan saldo dapat dilakukan berulang.",
  "Setiap melakukan pencairan dikenakan biaya transaksi.",
  "Minimum pencairan saldo adalah Rp 100.000",
  "Pastikan anda memiliki saldo yang cukup untuk dapat mencairkan saldo anda.",
];
const userAccess = computed(() => authStore.getUserAccessByCode("MGBTRANS"));
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .text-money {
    font-size: 1.5em !important;
  }
  .card-sub-balance {
    font-size: 14px;
  }
}
</style>
