<template>
  <div class="card p-3">
    <div class="card-body">
      <div
        class="d-flex justify-content-start flex-row align-items-center flex-wrap"
        style="border-bottom: 1px solid #e6ecf5"
      >
        <div
          class="d-flex justify-content-start w-100 align-items-start me-auto flex-wrap"
        >
          <a @click.prevent="$router.back" class="me-1" href="#"
            ><img
              class="d-flex align-items-center py-2 me-3 justify-content-center"
              src="@/assets/images/icons/back.svg"
          /></a>
          <mks-title
            title="Detail Pencairan Saldo"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          ></mks-title>
        </div>
      </div>
      <div
        class="row p-3 g-3 mt-2"
        style="border: none; border-bottom: 1px solid #e6ecf5"
      >
        <div class="col-md-6 me-auto">
          <div class="card p-4">
            <div
              class="d-flex flex-row align-items-center justify-content-between border-bottom pb-2"
            >
              <p class="mb-0 text-primary">{{ refund.signature_id }}</p>
              <p class="mb-0 text-secondary">
                {{ epochToDateTime(refund.unix_time, "DD MMM YYYY, HH:mm") }}
              </p>
            </div>
            <div class="pt-2">
              <p class="mb-0 fw-bolf" v-if="refund.status == 1">
                Pencairan saldo berhasil
                <i class="bi bi-check-circle-fill text-success"></i>
              </p>
              <p class="mb-0 fw-bold" v-else-if="refund.status == 0">
                Pencairan saldo sedang diproses
                <i class="bi bi-arrow-clockwise text-warning fs-16"></i>
              </p>
              <p class="mb-0 fw-bold" v-else>
                Pencairan saldo gagal
                <i class="bi bi-exclamation-circle-fill text-danger"></i>
              </p>
            </div>
            <div class="mt-3 border-bottom pb-3 text-center">
              <p class="mb-0">Total saldo</p>
              <p class="mb-0 fs-24 fw-bold">
                Rp. {{ formatCurrency(refund.amount) }}
              </p>
              <p class="mb-0">
                Biaya admin (Rp {{ formatCurrency(refund.fee + refund.vat) }})
              </p>
            </div>
            <div class="pt-5">
              <p class="mb-0">Detail Penerima</p>
              <div
                class="d-flex flex-row align-items-center justify-content-between mt-3"
              >
                <p class="mb-0 text-secondary">Nama penerima:</p>
                <p class="mb-0">{{ refund.bank_name_holder }}</p>
              </div>
              <div
                class="d-flex flex-row align-items-center justify-content-between mt-3"
              >
                <p class="mb-0 text-secondary">Akun bank:</p>
                <p class="mb-0">
                  {{ refund.bank_name + " - " + refund.bank_account_number }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 ">
          <div class="row g-3">
            <div class="col-12 col-md-12">
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
                    <p
                      class="mb-0 text-primary text-center text-success fw-500"
                    >
                      Dapat Dicairkan
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-12">
              <p class="mb-2 fw-600 fs-20">Catatan</p>
              <ol>
                <li v-for="(note, indexNote) in notes" :key="indexNote">
                  <p class="mb-2" style="line-height: 25px">{{ note }}</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end">
            <mks-button
              type="submit"
              size="lg"
              class="mt-4"
              color="primary"
              @click="$router.push(`/balance/add`)"
            >
              Cairkan Saldo
            </mks-button>
          </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MksTitle from "@/components/atoms/Mkstitle.vue";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import BalanceModule from "@/store/modules/BalanceModule";
import { epochToDateTime, formatCurrency } from "@/helper";
import { UserAccess } from "@/types/auth/UserAccess.interface";
import MksButton from "@/components/atoms/MksButton.vue";

const balanceState = getModule(BalanceModule);
const route = useRoute();
const router = useRouter();
const balance = computed(() => balanceState.getBalance);
const userAccess = computed(
  (): UserAccess => authState.getUserAccessByCode("MGBTRANS")
);
const authState = getModule(AuthModule);
const refund = computed(() => balanceState.getRefund);
const loading = ref<boolean>(false);

const notes = [
  "Permintaan pencairan saldo akan diproses selama 1x24 jam.",
  "Untuk pencairan saldo dapat dilakukan berulang.",
  "Setiap melakukan pencairan dikenakan biaya transaksi.",
  "Minimum pencairan saldo adalah Rp 100.000",
  "Pastikan anda memiliki saldo yang cukup untuk dapat mencairkan saldo anda.",
];
const getBalance = () => {
  loading.value = true;
  balanceState.getCurrentBalance().finally(() => {
    loading.value = false;
  });
};

onMounted(() => {
  getBalance();
});

onMounted(() => {
  if (route.params.id != undefined) {
    loading.value = true;
    balanceState.getDetailRefund(route.params.id).finally(() => {
      loading.value = false;
    });
  } else {
    router.go(-1);
  }
});
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .mobile-card {
    padding-top: 20px;
  }
  .text-money {
    font-size: 1.5em !important;
  }
  .card-sub-balance {
    font-size: 14px;
  }
}


</style>
