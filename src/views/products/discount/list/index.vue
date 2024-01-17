<template>
  <div class="card p-3">
    <div class="card-body p-3 w-100" style="border-bottom: 1px solid #e6ecf5">
      <div class="row g-3 align-items-center justify-content-end">
        <div class="col-12 col-md-6">
          <mks-title
            title="Daftar Diskon"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
            nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
            voluptates,"
          ></mks-title>
        </div>
        <div class="col-12 col-md-2">
          <div class="input-group form-control form-control-filter">
            <select
              class="form-select form-select-sm"
              v-model="discountStore.outlet"
              placeholder="Select"
              @change="getDiscount"
            >
              <option
                selected
                v-for="outlet in outletStore.outletsForFilter"
                :key="outlet.id"
                :label="outlet.name"
                :value="outlet.id"
              />
            </select>
          </div>
        </div>
        <div class="col-12 col-md-2">
          <div class="input-group form-control form-control-filter">
            <input
              v-model="discountStore.search"
              v-on:keyup.enter="getDiscount"
              type="text"
              class="form-control form-control-sm ms-auto"
              placeholder="Cari..."
            />
            <span class="d-flex align-items-center"
              ><img src="@/assets/images/icons/search.svg" />
            </span>
          </div>
        </div>
        <div class="col-8 col-md-2">
          <mks-button
            class="w-100"
            color="success"
            type="button"
            size="lg"
            @click="$router.push('/product/discount/add')"
          >
            <div class="d-flex flex-row align-items-center justify-content-center">
              <span class="me-2">Tambah</span
              ><img src="@/assets/images/icons/plus.svg" alt="icon" />
            </div>
          </mks-button>
        </div>
      </div>
    </div>

    <div class="card-body mt-3">
      <el-table :data="discounts" v-loading="loading">
        <el-table-column prop="name" label="Nama"></el-table-column>

        <el-table-column prop="disc_amount" label="Jumlah Diskon" align="right">
          <template #default="prop">
            <span v-if="prop.row.disc_amount == 0">-</span>
            <span v-else> Rp {{ formatCurrency(prop.row.disc_amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="disc_percentage" label="Diskon (%)" align="right">
          <template #default="prop">
            <span v-if="prop.row.disc_percentage == 0">-</span>
            <span v-else> {{ prop.row.disc_percentage }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="max_discount_price" label="Maksimal Diskon" align="right">
          <template #default="prop">
            <span v-if="prop.row.max_discount_price == 0">-</span>
            <span v-else> Rp {{ formatCurrency(prop.row.max_discount_price) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="expired_date" label="Kedaluwarsa" align="center">
          <template #default="prop">
            <span v-if="!prop.row.expired_date">-</span>
            <span v-else>
              {{
                formatDate(convertEpochToDate(prop.row.expired_date), "DD MMM YYYY")
              }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="Aksi" align="center">
          <template #default="scope">
            <div class="d-flex justify-content-center">
              <mks-button
                @click="selectItem(scope.row)"
                type="danger button"
                size="lg"
                color="danger"
              >
                <span><img src="@/assets/images/icons/trash.svg" /></span>
              </mks-button>
              <mks-button
                @click="
                  $router.push(
                    `/product/discount/update/${scope.row.uuid}/?oid=${scope.row.outlet_id}`
                  )
                "
                type="buttom"
                color="secondary"
                class="bg-grey ms-3"
                size="lg"
              >
                <i><img src="@/assets/images/icons/pencil.svg" /></i>
              </mks-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <mks-pagination
        @prev="prevPage"
        @next="nextPage"
        :disablePrev="!discountStore.metaPagination.prev_cursor"
        :disableNext="!discountStore.metaPagination.next_cursor"
      >
      </mks-pagination>
    </div>
    <mks-confirm
      v-model="confirmDialog"
      :message="`Apakah anda yakin akan menghapus diskon ${selectedItem.name}?`"
      :loading="loadingRemove"
      @cancel="confirmDialog = false"
      @confirm="confirmRemove"
    >
    </mks-confirm>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { formatCurrency, formatDate, convertEpochToDate } from "@/helper";
import http from "@/http-common";
import { useDiscountStore } from "@/stores/products/discount";
import { useOutletStore } from "@/stores/outlet";
import { Discount } from "@/types/products/Discount.interface";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";
import MksPagination from "@/components/organism/MksPagination.vue";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";

const selectedItem = ref<Discount>({} as Discount);
const confirmDialog = ref(false);
const selectItem = (item: Discount) => {
  selectedItem.value = item;
  confirmDialog.value = true;
};

const loadingRemove = ref<boolean>(false);
const confirmRemove = () => {
  loadingRemove.value = true;
  http
    .delete(
      `/falcon/v1/voucher/nevada/${selectedItem.value.uuid}?outlet_id=${selectedItem.value.outlet_id}`
    )
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Diskon berhasil dihapus");
        if (
          discounts.value.length == 1 &&
          discountStore.metaPagination.prev_cursor != null
        ) {
          discountStore.cursor = "";
        }
        getDiscount();
      } else {
        showErrorNotif(res.message);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      confirmDialog.value = false;
      loadingRemove.value = false;
      selectedItem.value = {} as Discount;
    });
};

const prevPage = () => {
  discountStore.cursor = discountStore.metaPagination.prev_cursor || "";
  getDiscount();
};

const nextPage = () => {
  discountStore.cursor = discountStore.metaPagination.next_cursor || "";
  getDiscount();
};

const discountStore = useDiscountStore();
const discounts = ref<Discount[]>([]);
const loading = ref<boolean>(false);

const getDiscount = () => {
  loading.value = true;
  http
    .get(
      `/falcon/v1/voucher/index?perpage=10&cursor=${discountStore.cursor}&search=${
        discountStore.search
      }&outlet_id=${discountStore.outlet == 0 ? "" : discountStore.outlet}`
    )
    .then((result) => {
      const res = result.data;
      if (res) {
        discounts.value = res.data;
        discountStore.metaPagination = res.meta;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const outletStore = useOutletStore();

onMounted(() => {
  outletStore.outlets = [];
  outletStore.getOutlets({
    search: "",
    cursor: "",
    perPage: "100",
  });

  getDiscount();
});
</script>
