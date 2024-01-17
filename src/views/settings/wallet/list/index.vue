<template>
  <div>
    <div class="card p-3">
      <div class="card-body p-3" style="border-bottom: 1px solid #e6ecf5">
        <div class="d-flex justify-content-start flex-row align-items-center flex-wrap">
          <mks-title
            title="Daftar Akun E-Wallet"
            subtitle=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                illo nisi harum facere dignissimos hic culpa non! Iusto sapiente
                vero voluptates,"
          >
          </mks-title>
          <div
            class="input-group input-search input-group d-flex align-items-center ms-auto mb-1"
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
              v-model="selectedOutlet"
              placeholder="Select"
              @change="changeOutlet"
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
            class="input-group input-search input-group d-flex justify-content-end ms-3 mb-1"
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
                v-model="search"
                @keyup="textSearch"
                v-on:keyup.enter="searchData"
              />
              <span class="d-flex align-items-center"
                ><img src="@/assets/images/icons/search.svg" />
              </span>
            </div>
          </div>

          <mks-button
            color="success"
            type="button"
            class="ms-3 mb-1"
            size="lg"
            @click="$router.push('/setting/wallet/add')"
          >
            <div class="d-flex flex-row align-items-center">
              <span class="me-2">Tambah</span
              ><img src="@/assets/images/icons/plus.svg" alt="icon" />
            </div>
          </mks-button>
        </div>
      </div>
      <div class="card-body">
        <el-table
          :data="wallets"
          v-loading="loadingDatatable"
          class="py-3"
          style="border-radius: 15px; border: 2px solid #f5f8fa"
        >
          <el-table-column prop="name" label="Nama" />
          <el-table-column prop="number" label="Nomor" />
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
                  @click="
                    $router.push(
                      `/setting/wallet/update/${scope.row.uuid}?oid=${scope.row.outlet_id}`
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
        <div class="d-flex justify-content-end mt-5">
          <button
            class="btn btn-sm"
            @click="prevPage"
            :disabled="!metaPagination.prev_cursor"
            :class="{
              'text-danger': metaPagination.prev_cursor,
              'text-secondary': !metaPagination.prev_cursor,
            }"
          >
            SEBELUMNYA
          </button>
          <button
            class="btn btn-sm ms-3"
            @click="nextPage"
            :disabled="!metaPagination.next_cursor"
            :class="{
              'text-danger': metaPagination.next_cursor,
              'text-secondary': !metaPagination.next_cursor,
            }"
          >
            SELANJUTNYA
          </button>
        </div>
      </div>
    </div>
    <mks-confirm
      v-model="deleteDialog"
      :message="`Apakah anda yakin akan menghapus akun ${selectedItem.name}?`"
      @cancel="deleteDialog = false"
      @confirm="confirmRemove"
    >
    </mks-confirm>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, computed } from "vue";
import WalletModule, { Wallet } from "@/store/modules/WalletModule";
import OutletModule from "@/store/modules/OutletModule";
import AuthModule from "@/store/modules/AuthModule";
import { getModule } from "vuex-module-decorators";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import { ElNotification } from "element-plus";
import MksConfirm from "@/components/organism/MksConfirm.vue";

const deleteDialog = ref(false);
const loadingBtnDialog = ref(false);
const loadingDatatable = ref(false);

const search = ref<string>("");
const cursor = ref<string | null>("");
const perPage = ref<number>(10);
const clearable = ref<boolean>(false);
const selectedOutlet = ref<string>("");
const myOutletId = computed(() => AuthState.getOutletId);
const selectedItem = ref<Wallet>({} as Wallet);
const AuthState = getModule(AuthModule);
const WalletState = getModule(WalletModule);
const OutletState = getModule(OutletModule);

const wallets = computed(() => WalletState.getterLists);
const filterOutlets = computed(() => OutletState.getFilterOutlet);
const metaPagination = computed(() => WalletState.getterMetaPaginationWallet);

const selectItem = (item: any) => {
  selectedItem.value = item;
  selectedOutlet.value = item.outlet_id;
  deleteDialog.value = true;
};

const textSearch = () => {
  if (search.value) clearable.value = true;
  else clearable.value = false;
};

const getWallet = () => {
  loadingDatatable.value = true;
  WalletState.getListWallet({
    outletId: selectedOutlet.value,
    search: search.value,
    cursor: cursor.value,
    perPage: perPage.value,
  }).finally(() => (loadingDatatable.value = false));
};

const searchData = () => {
  getWallet();
};

const confirmRemove = () => {
  loadingBtnDialog.value = true;
  const selected = toRefs(selectedItem.value);

  WalletState.removeWallet({
    uuid: selected.uuid.value,
    outletId: selectedOutlet.value,
  })
    .then((res) => {
      const response = res.data;
      if (response.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "E-wallet berhasil dihapus!",
        });
        getWallet();
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 2000,
          customClass: "errorNotif",
          message: response.error[0].text,
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
      deleteDialog.value = false;
      loadingBtnDialog.value = false;
      selectedItem.value = {} as Wallet;
    });
};

const prevPage = () => {
  cursor.value = metaPagination.value.prev_cursor;
  getWallet();
};

const nextPage = () => {
  cursor.value = metaPagination.value.next_cursor;
  getWallet();
};

const changeOutlet = () => {
  getWallet();
};

onMounted(async () => {
  WalletState.SET_LISTS([]);
  await getWallet();

  OutletState.SET_OUTLETS([]);
  OutletState.getOutletsAPI({
    outletId: myOutletId.value,
    search: search.value,
    cursor: cursor.value,
    perPage: perPage.value,
  });
});
</script>
