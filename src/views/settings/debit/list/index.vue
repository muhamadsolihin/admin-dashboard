<template>
  <div class="card p-3">
    <div class="card-body p-3 mb-3" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex justify-content-start flex-row align-items-center flex-wrap"
      >
        <mks-title
          title="Daftar Akun debit"
          subtitle=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
              illo nisi harum facere dignissimos hic culpa non! Iusto sapiente
              vero voluptates,"
        >
        </mks-title>

        <div
          class="input-group input-search input-group d-flex align-items-center ms-auto"
          style="
            width: 157px;
            height: 45px;
            background: #ffffff;
            border: 2px solid #f1f5ff;
            border-radius: 7px;
            border-right-color: default;
          "
        >
          <select
            v-model="debitstore.outletId"
            placeholder="Select"
            @change="getDebit"
            style="border: none; font-size: 14px"
            class="form-select form-select-lg"
            clearable
            filterable
          >
            <option
              selected
              v-for="item in filterOutlets"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </select>
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
              v-model="debitstore.search"
              v-on:keyup.enter="getDebit"
            />
            <span class="d-flex align-items-center"
              ><img src="@/assets/images/icons/search.svg" />
            </span>
          </div>
        </div>

        <mks-button
          color="success"
          type="button"
          class="ms-3"
          size="lg"
          @click="$router.push('/setting/debit/add')"
        >
          <div class="d-flex flex-row align-items-center">
            <span class="me-2">Tambah</span
            ><img src="@/assets/images/icons/plus.svg" alt="icon" />
          </div>
        </mks-button>
      </div>
    </div>

    <el-table
      :data="Debit"
      class="py-3"
      style="border-radius: 15px; border: 2px solid #f5f8fa"
    >
      <el-table-column
        prop="name"
        label-class="fw-bold"
        label="Nama Bank"
        width="auto"
      >
      </el-table-column>

      <el-table-column prop="number" label="No Rekening"> </el-table-column>
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
              @click="$router.push(`/setting/debit/update/${scope.row.uuid}`)"
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
        :disabled="!debitstore.metaPagination.prev_cursor"
        :class="{
          'text-danger': debitstore.metaPagination.prev_cursor,
          'text-secondary': !debitstore.metaPagination.prev_cursor,
        }"
      >
        SEBELUMNYA
      </button>
      <button
        class="btn btn-sm ms-3"
        @click="nextPage"
        :disabled="!debitstore.metaPagination.next_cursor"
        :class="{
          'text-danger': debitstore.metaPagination.next_cursor,
          'text-secondary': !debitstore.metaPagination.next_cursor,
        }"
      >
        SELANJUTNYA
      </button>
    </div>
    <mks-confirm
      v-model="confirmDialog"
      :message="`Apakah anda yakin akan menghapus akun ${selectedItem.name}?`"
      :loading="loadingRemove"
      @cancel="confirmDialog = false"
      @confirm="confirmRemove"
    >
    </mks-confirm>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { ElNotification } from "element-plus";
import http from "@/http-common";
import { useDebit, Debit } from "@/stores/debit";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";

import { getModule } from "vuex-module-decorators";
import OutletModule from "@/store/modules/OutletModule";
import AuthModule from "@/store/modules/AuthModule";

const selectedItem = ref<Debit>({} as Debit);
const confirmDialog = ref(false);
const selectItem = (item: Debit) => {
  selectedItem.value = item;
  confirmDialog.value = true;
};
const selectedOutlet = ref<string>("");
const loadingRemove = ref<boolean>(false);

const prevPage = () => {
  debitstore.cursor = debitstore.metaPagination.prev_cursor || "";
  getDebit();
};

const nextPage = () => {
  debitstore.cursor = debitstore.metaPagination.next_cursor || "";
  getDebit();
};

const confirmRemove = () => {
  loadingRemove.value = true;
  http
    .delete(
      `/parrot/v1/edc-machine/nevada/${selectedItem.value.uuid}?outlet_id=${selectedItem.value.outlet_id}`
    )
    .then((response) => {
      const res = response.data;
      if (res.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "Akun debit berhasil dihapus",
        });
        if (
          Debit.value.length == 1 &&
          debitstore.metaPagination.prev_cursor != null
        ) {
          debitstore.cursor = "";
        }
        getDebit();
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
      selectedItem.value = {} as Debit;
    });
};

const debitstore = useDebit();
const Debit = ref<Debit[]>([]);
const loading = ref<boolean>(false);

const getDebit = () => {
  loading.value = true;
  http
    .get(
      `/parrot/v1/edc-machine/index?search=${debitstore.search}&perpage=${debitstore.perpage}&cursor=${debitstore.cursor}&outlet_id=${debitstore.outletId}`
    )
    .then((result) => {
      const res = result.data;
      if (res) {
        Debit.value = res.data;
        debitstore.metaPagination = res.meta;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const search = ref<string>("");
const cursor = ref<string | null>("");
const perPage = ref<number>(10);
const OutletState = getModule(OutletModule);
const myOutletId = computed(() => AuthState.getOutletId);
const AuthState = getModule(AuthModule);
const filterOutlets = computed(() => OutletState.getFilterOutlet);

onMounted(() => {
  OutletState.SET_OUTLETS([]);
  OutletState.getOutletsAPI({
    outletId: myOutletId.value,
    search: search.value,
    cursor: cursor.value,
    perPage: perPage.value,
  });
});

onMounted(() => {
  getDebit();
});
</script>
