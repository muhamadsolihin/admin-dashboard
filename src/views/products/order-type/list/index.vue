<template>
  <div class="card p-3">
    <div class="card-body p-3 mb-3" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex justify-content-start flex-row align-items-center flex-wrap"
      >
        <mks-title
          title="Daftar Tipe Pesanan"
          subtitle=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              illo nisi harum facere dignissimos hic culpa non! Iusto sapiente
              vero voluptates,"
        >
        </mks-title>
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
                v-model="typeorderStore.search"
                v-on:keyup.enter="getTypeOrder"
                style="border: none"
                type="text"
                class="form-control form-control-sm border-right-white border-right-white rounded-end ms-auto"
                placeholder="Cari..."
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
            @click="$router.push('/product/order-type/add')"
          >
            <span class="me-2">Tambah Tipe Pesanan</span>
            <img src="@/assets/images/icons/plus-white.svg" />
          </mks-button>
        </div>
      </div>
    </div>

    <el-table
      :data="typeorder"
      class="py-3"
      style="border-radius: 15px; border: 2px solid #f5f8fa"
    >
      <el-table-column
        prop="name"
        label-class="fw-bold"
        label="Label"
        width="auto"
      >
      </el-table-column>

      <el-table-column prop="color" label="Warna">
        <template #default="scope">
          <div class="d-flex align-items-center">
            <div
              class="rounded-circle"
              :style="{ backgroundColor: scope.row.color }"
              style="width: 30px; height: 30px; border: 4px solid #d3dbe3"
            ></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Aksi" width="auto" align="center">
        <template #default="scope">
          <div class="d-flex justify-content-center my-3 flex-wrap">
            <mks-button
              type="danger button"
              size="lg"
              color="danger"
              @click="selectItem(scope.row)"
            >
              <span><img src="@/assets/images/icons/trash.svg" /></span>
            </mks-button>
            <mks-button
              @click="
                $router.push(`/product/order-type/update/${scope.row.uuid}`)
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
    <div class="d-flex justify-content-end mt-5">
      <button
        class="btn btn-sm"
        @click="prevPage"
        :disabled="!typeorderStore.metaPagination.prev_cursor"
        :class="{
          'text-danger': typeorderStore.metaPagination.prev_cursor,
          'text-secondary': !typeorderStore.metaPagination.prev_cursor,
        }"
      >
        SEBELUMNYA
      </button>
      <button
        class="btn btn-sm ms-3"
        @click="nextPage"
        :disabled="!typeorderStore.metaPagination.next_cursor"
        :class="{
          'text-danger': typeorderStore.metaPagination.next_cursor,
          'text-secondary': !typeorderStore.metaPagination.next_cursor,
        }"
      >
        SELANJUTNYA
      </button>
    </div>
    <mks-confirm
      v-model="confirmDialog"
      :message="`Apakah anda yakin akan menghapus tipe pesanan ${selectedItem.name}?`"
      :loading="loadingRemove"
      @cancel="confirmDialog = false"
      @confirm="confirmRemove"
    >
    </mks-confirm>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElNotification } from "element-plus";
import http from "@/http-common";
import {  TypeOrder } from "@/stores/typeOrder";
import { usetypeOrderStore } from "@/stores/typeOrder";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";

const selectedItem = ref<TypeOrder>({} as TypeOrder);
const confirmDialog = ref(false);
const selectItem = (item: TypeOrder) => {
  selectedItem.value = item;
  confirmDialog.value = true;
};

const loadingRemove = ref<boolean>(false);

const prevPage = () => {
  typeorderStore.cursor = typeorderStore.metaPagination.prev_cursor || "";
  getTypeOrder();
};

const nextPage = () => {
  typeorderStore.cursor = typeorderStore.metaPagination.next_cursor || "";
  getTypeOrder();
};

const typeorderStore = usetypeOrderStore();
const typeorder = ref<TypeOrder[]>([]);
const loading = ref<boolean>(false);

const confirmRemove = () => {
  loadingRemove.value = true;
  http
    .delete(`/falcon/v1/type_order/nevada/${selectedItem.value.uuid}`)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "Tipe Pesanan berhasil dihapus",
        });
        if (
          typeorder.value.length == 1 &&
          typeorderStore.metaPagination.prev_cursor != null
        ) {
          typeorderStore.cursor = "";
        }
        getTypeOrder();
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 3000,
          customClass: "errorNotif",
          message: res.message,
        });
      }
    })
    .catch(() => {
      ElNotification({
        title: "Error",
        type: "error",
        duration: 3000,
        customClass: "errorNotif",
        message: "Terjadi kesalahan server",
      });
    })
    .finally(() => {
      confirmDialog.value = false;
      loadingRemove.value = false;
      selectedItem.value = {} as TypeOrder;
    });
};

const getTypeOrder = () => {
  loading.value = true;
  http
    .get(
      `/falcon/v1/type_order/index?perpage=10&cursor=${typeorderStore.cursor}&search=${typeorderStore.search}`
    )
    .then((result) => {
      const res = result.data;
      if (res) {
        typeorder.value = res.data;
        typeorderStore.metaPagination = res.meta;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getTypeOrder();
});
</script>
