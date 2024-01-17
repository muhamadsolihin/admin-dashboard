<template>
  <div class="card w-100">
    <el-table
      :data="refunds"
      v-loading="loading"
      style="width: 100%"
      table-layout="fixed"
    >
      <el-table-column
        prop="signature_id"
        label="ID"
        align="center"
        sortable
      ></el-table-column>
      <el-table-column prop="amount" label="Jumlah (Rp)" sortable>
        <template #default="scope">
          {{ formatCurrency(scope.row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="unix_time" label="Waktu" sortable>
        <template #default="scope">
          {{ epochToDateTime(scope.row.unix_time, "DD MMM YYYY, HH:mm") }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" sortable width="120">
        <template #default="scope">
          <mks-badge v-if="scope.row.status == 0" color="success" size="xl">
            Diproses
          </mks-badge>

          <mks-badge v-if="scope.row.status == 1" color="success" size="xl">
            Sukses
          </mks-badge>

          <mks-badge v-if="scope.row.status == 2" color="danger" size="xl">
            Gagal
          </mks-badge>
        </template></el-table-column
      >
      <el-table-column label="Aksi" align="center" width="80">
        <template #default="scope">
          <mks-button
            type="button"
            size="lg"
            color="secondary"
            @click="
              $router.push(
                `/balance/detail/${encodeURIComponent(scope.row.signature_id)}`
              )
            "
          >
            <i><img src="@/assets/images/icons/three-dots-vertical.svg" /></i>
          </mks-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="d-flex justify-content-end mt-5">
      <button
        class="btn btn-sm ms-3"
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
import MksBadge from "@/components/atoms/MksBadge.vue";
import BalanceModule from "@/store/modules/BalanceModule";
import { epochToDateTime, formatCurrency } from "@/helper";
import MksButton from "@/components/atoms/MksButton.vue";
import {useRoute } from "vue-router";
const balanceState = getModule(BalanceModule);
const route = useRoute();
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
      getRefundList();
    }
  }
);
const emits = defineEmits(["update:triggerFetch"]);
const cursor = ref<string | null>("");
const perPage = ref<number>(10);
const loading = ref<boolean>(false);
const refunds = computed(() => balanceState.getRefunds);
const metaPagination = computed(() => balanceState.getterMetaPaginationRefunds);

const prevPage = () => {
  cursor.value = metaPagination.value.prev_cursor;
  getRefundList();
};

const nextPage = () => {
  cursor.value = metaPagination.value.next_cursor;
  getRefundList();
};

const getRefundList = () => {
  loading.value = true;
  balanceState
    .getRefundHistoryList({
      perPage: perPage.value,
      cursor: cursor.value,
      dateFrom: moment(props.dateFrom).format("YYYY-MM-DD"),
      dateTo: moment(props.dateTo).format("YYYY-MM-DD"),
    })
    .finally(() => {
      emits("update:triggerFetch", false);
      loading.value = false;
    });
};

onMounted(() => {
  getRefundList();
});
</script>
