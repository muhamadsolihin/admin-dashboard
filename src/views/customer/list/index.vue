<template>
  <div>
    <div class="card p-3">
      <div class="card-body p-3 w-100">
        <div
          class="d-flex justify-content-start flex-row align-items-center flex-wrap w-100"
        >
          <mks-title
            title=" Daftar Pelanggan"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
          ></mks-title>

          <div
            class="ms-auto d-flex flex-row align-items-center justify-content-end flex-wrap"
          >
            <div
              class="input-group input-search input-group mb-3 ms-auto"
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
                  class="form-control form-control-sm rounded-end ms-auto"
                  v-model="customerStore.search"
                  v-on:keyup.enter="getCustomers"
                  placeholder="Cari "
                />
                <span class="d-flex align-items-center"
                  ><img src="@/assets/images/icons/search.svg" />
                </span>
              </div>
            </div>
            <mks-button
              type="button"
              color="success"
              size="small"
              class="ms-3 mb-3"
              @click="$router.push('/customer/add')"
            >
              <span class="me-2">Tambah Pelanggan</span>
              <img src="@/assets/images/icons/plus-white.svg" />
            </mks-button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <el-table
          :data="customers"
          v-loading="loading"
          class="py-3"
          style="border-radius: 15px; border: 2px solid #f5f8fa"
        >
          <el-table-column prop="name" label="Nama" />
          <el-table-column prop="phone" label="No. Telepon" />
          <el-table-column prop="email" label="Email" />
          <el-table-column label="Aksi" width="250" align="center">
            <template #default="scope">
              <div class="d-flex justify-content-center my-3 flex-wrap">
                <mks-button
                  @click="selectItem(scope.row)"
                  type="danger button"
                  size="lg"
                  color="danger"
                >
                  <span><img src="@/assets/images/icons/trash.svg" /></span>
                </mks-button>
                <mks-button
                  @click="$router.push(`/customer/update/${scope.row.uuid}`)"
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
          :disablePrev="!customerStore.metaPagination.prev_cursor"
          :disableNext="!customerStore.metaPagination.next_cursor"
        >
        </mks-pagination>
      </div>
    </div>
    <mks-confirm
      v-model="deleteDialog"
      :message="`Apakah anda yakin akan menghapus pelanggan ${selectedItem.name}?`"
      @cancel="deleteDialog = false"
      @confirm="confirmRemove"
    >
    </mks-confirm>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Customer } from "@/types/customer/Customer.interface";
import { useCustomerStore } from "@/stores/customer";
import http from "@/http-common";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";
import MksPagination from "@/components/organism/MksPagination.vue";

const deleteDialog = ref(false);
const search = ref<string>("");
const cursor = ref<string | null>("");
const clearable = ref<boolean>(false);
const loading = ref<boolean>(false);
const selectedItem = ref<Customer>({} as Customer);
const customerStore = useCustomerStore();
const customers = ref<Customer[]>([]);
const getCustomers = () => {
  loading.value = true;
  http
    .get(
      `/sparrow/v1/?search=${customerStore.search}&date=${customerStore.date}&perpage=${customerStore.perPage}&cursor=${customerStore.cursor}`
    )
    .then((result) => {
      const res = result.data;
      if (res) {
        customers.value = res.data;
        customerStore.metaPagination = res.meta;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
const selectItem = (item: Customer) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};
const loadingRemove = ref<boolean>(false);
const confirmRemove = () => {
  loadingRemove.value = true;
  http
    .delete(`/sparrow}/v1/nevada/${selectedItem.value.uuid}`)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Pelanggan berhasil dihapus");
        if (
          customers.value.length == 1 &&
          customerStore.metaPagination.prev_cursor != null
        ) {
          customerStore.cursor = "";
        }
        getCustomers();
      } else {
        showErrorNotif(res.message);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      deleteDialog.value = false;
      loadingRemove.value = false;
      selectedItem.value = {} as Customer;
    });
};
const prevPage = () => {
  customerStore.cursor = customerStore.metaPagination.prev_cursor || "";
  getCustomers();
};

const nextPage = () => {
  customerStore.cursor = customerStore.metaPagination.next_cursor || "";
  getCustomers();
};

onMounted(() => {
  getCustomers();
});
</script>
