<template>
  <div class="card w-100">
    <el-table :data="transactions" v-loading="loading" width="100%">
      <el-table-column
        prop="trx_id"
        label="ID"
        align="center"
        width="auto"
        sortable
      ></el-table-column>
      <el-table-column
        prop="fee_trx"
        label="Biaya (Rp)"
        align="center"
        width="auto"
        sortable
      >
        <template #default="scope">
          {{ formatCurrency(scope.row.fee_trx) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="subsidy_fee"
        label="Subsidi (Rp)"
        align="center"
        width="auto"
        sortable
      >
        <template #default="scope">
          {{ formatCurrency(scope.row.subsidy_fee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="total"
        label="Jumlah (Rp)"
        align="center"
        width="auto"
        sortable
      >
        <template #default="scope">
          {{ formatCurrency(scope.row.total) }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Waktu" width="auto" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.created_at, "DD MMM YYYY, HH:mm") }}
        </template>
      </el-table-column>
      <el-table-column prop="outlet_name" label="Toko" width="auto" sortable>
        <template #default="scope">
          {{ scope.row.outlet_name || "-" }}
        </template></el-table-column
      >
      <el-table-column prop="is_move" label="Status" width="auto" sortable>
        <template #default="scope">
          <p class="mb-0 text-success" v-if="scope.row.is_move == 1">
            Dapat dicairkan
          </p>
          <p class="mb-0 text-danger" v-else>Tertahan</p>
        </template>
      </el-table-column>
    </el-table>

    <div class="d-flex justify-content-end mt-5">
      <button
        class="btn btn-sm"
        @click="prevPage"
        :disabled="!metaPagination.prev_cursor"
        :class="{
          'text-primary': metaPagination.prev_cursor,
          'text-secondary': !metaPagination.prev_cursor,
        }"
      >
        SEBELUMNYA
      </button>
      <button
        class="btn btn-sm"
        @click="nextPage"
        :disabled="!metaPagination.next_cursor"
        :class="{
          'text-primary': metaPagination.next_cursor,
          'text-secondary': !metaPagination.next_cursor,
        }"
      >
        SELANJUTNYA
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from "vue";
import { getModule } from "vuex-module-decorators";
import moment from "moment";

import BalanceModule from "@/store/modules/BalanceModule";
import { formatDate, formatCurrency } from "@/helper";

const balanceState = getModule(BalanceModule);
const props = defineProps({
  dateFrom: {
    type: String,
    require: true,
    default: moment().subtract(7, "days").format("YYYY-MM-DD"),
  },
  dateTo: {
    type: String,
    require: true,
    default: moment().format("YYYY-MM-DD"),
  },
  triggerFetch: {
    type: Boolean,
    require: true,
    default: false,
  },
});
watch(
  () => props.triggerFetch,
  (val) => {
    if (val) {
      cursor.value = "";
      getTxList();
    }
  }
);
const emits = defineEmits(["update:triggerFetch"]);

const cursor = ref<string | null>("");
const perPage = ref<number>(10);
const search = ref<string>("");
const loading = ref<boolean>(false);
const transactions = computed(() => balanceState.getTransactions);
const metaPagination = computed(() => balanceState.getterMetaPaginationTx);

const prevPage = () => {
  cursor.value = metaPagination.value.prev_cursor;
  getTxList();
};

const nextPage = () => {
  cursor.value = metaPagination.value.next_cursor;
  getTxList();
};

const getTxList = () => {
  loading.value = true;
  balanceState
    .getTxHistoryList({
      perPage: perPage.value,
      cursor: cursor.value,
      dateFrom: moment(props.dateFrom).format("YYYY-MM-DD"),
      dateTo: moment(props.dateTo).format("YYYY-MM-DD"),
      search: search.value,
    })
    .finally(() => {
      emits("update:triggerFetch", false);
      loading.value = false;
    });
};

onMounted(() => {
  getTxList();
});
</script>
