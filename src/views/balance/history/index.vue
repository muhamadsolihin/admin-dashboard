<template>
  <div class="card">
    <div class="card-body p-3 w-100">
      <div
        class="d-flex justify-content-start flex-row align-items-center flex-wrap w-100"
      >
        <mks-title
          title="Daftar Transaksi"
          subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
        ></mks-title>
      </div>
    </div>

    <div class="card-body w-100" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex justify-content-start flex-row align-items-center flex-wrap w-100"
      >
        <div class="w-50  me-auto" >
          <el-date-picker
            v-model="filterRangeDate"
            @change="triggerFetch = true"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD"
            class="ms-auto mb-0"
            type="daterange"
            unlink-panel
            :clearable="false"
          />
        </div>
        <div
          class="input-group input-search input-group d-flex justify-content-end ms-3"
          style="
            width: 157px;
            height: 45px;
            background: #ffffff;
            border: 2px solid #f1f5ff;
            border-radius: 7px;
            border-right-color: default;
          "
        >
          <div class="input-group form-control ms-auto">
            <input
              style="border: none"
              type="text"
              class="form-control form-control-sm ms-auto"
              placeholder="Cari..."
            />
            <span class="d-flex align-items-center"
              ><img src="@/assets/images/icons/search.svg" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3">
      <el-tabs stretch v-model="activeName" class="demo-tabs">
        <el-tab-pane label="Pencairan" name="pencairan">
          <RefundHistoryComponent
            :date-from="filterRangeDate[0]"
            :date-to="filterRangeDate[1]"
            v-model:triggerFetch="triggerFetch"
          />
        </el-tab-pane>
        <el-tab-pane label="Transaksi" name="tx">
          <TxHistoryComponent
            :date-from="filterRangeDate[0]"
            :date-to="filterRangeDate[1]"
            v-model:triggerFetch="triggerFetch"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import moment from "moment";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import RefundHistoryComponent from "../components/RefundHistoryComponent.vue";
import TxHistoryComponent from "../components/TxHistoryComponent.vue";

const filterRangeDate = ref<any[]>([
  moment().subtract(7, "days").format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
]);
const activeName = ref("pencairan");
const triggerFetch = ref<boolean>(false);
</script>

