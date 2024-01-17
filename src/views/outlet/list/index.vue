<template>
  <div class="card p-3">
    <div class="card-body p-3" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex flex-column flex-xl-row align-items-end align-items-xl-center justify-content-end gap-3"
      >
        <div class="w-80 me-auto">
          <mks-title
            title="Daftar Toko"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
          ></mks-title>
        </div>
        <div
          class="w-100 d-flex flex-column flex-md-row align-items-end align-items-md-center justify-content-end gap-3"
        >
          <div class="item-1">
            <mks-input-search
              v-model="outletStore.search"
              @enter="searchData"
              @clear="clearSearch"
            ></mks-input-search>
          </div>
          <mks-button
            color="success"
            type="button"
            size="lg"
            @click="$router.push('/outlet/add')"
            :disabled="
              userAccessOutlet.have_access == 0 || userAccessOutlet.amount == 0
            "
          >
            <div class="d-flex flex-row align-items-center">
              <span class="me-2">Tambah</span
              ><img src="@/assets/images/icons/plus.svg" alt="icon" />
            </div>
          </mks-button>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div
        class="alert__app mb-5 d-flex justify-content-start align-items-center w-100 flex-row flex-wrap"
        v-if="
          userAccessOutlet?.have_access == 0 || userAccessOutlet.amount == 0
        "
      >
        <img src="@/assets/images/icons/warning.svg" class="me-3 mb-0" />
        <p class="text-alert d-flex justify-content-start mb-0">
          Anda tidak bisa menambah toko. Upgrade paket untuk menambah toko.
        </p>
        <div class="ms-auto">
          <mks-button
            size="sm"
            color="primary"
            class="mt-1"
            type="btn"
            @click="subscribe"
          >
            Upgrade Paket
          </mks-button>
        </div>
      </div>

      <el-table
        :data="outlets"
        table-layout="fixed"
        v-loading="loadingDatatable"
      >
        <el-table-column prop="name" label="Nama Toko" width="250">
        </el-table-column>
        <el-table-column prop="is_active" label="status" width="100">
          <template #default="scope">
            <mks-badge v-if="scope.row.is_active" color="success" size="xl">
              Aktif
            </mks-badge>
            <mks-badge v-else color="danger"> Tidak Aktif </mks-badge>
          </template>
        </el-table-column>
        <el-table-column prop="is_center" label="Tipe" width="100" sortable>
          <template #default="scope">
            {{ scope.row.is_center ? "Pusat" : "Cabang" }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="Kelurahan" width="400" />
        <el-table-column prop="village_name" width="400" label="Alamat" />
        <el-table-column label="Aksi" width="250" align="center">
          <template #default="scope">
            <div class="d-flex justify-content-center my-3 flex-wrap">
              <mks-button
                :disabled="
                  scope.row.is_center == 1 || scope.row.id == currentOutletId
                "
                @click="selectItem(scope.row)"
                type="danger button"
                size="lg"
                color="danger"
              >
                <span><img src="@/assets/images/icons/trash.svg" /></span>
              </mks-button>
              <mks-button
                @click="$router.push(`/outlet/update/${scope.row.uuid}`)"
                type="buttom"
                color="secondary"
                class="bg-grey ms-3"
                size="lg"
              >
                <i><img src="@/assets/images/icons/pencil.svg" /></i>
              </mks-button>

              <el-dropdown
                trigger="click"
                class="ms-3"
                :disabled="scope.row.is_center == 1"
              >
                <span class="el-dropdown-link">
                  <mks-button
                    :disabled="
                      scope.row.is_center == 1 ||
                      scope.row.id == currentOutletId
                    "
                    type="info"
                    size="lg"
                    color="secondary"
                  >
                    <i
                      ><img src="@/assets/images/icons/three-dots-vertical.svg"
                    /></i>
                  </mks-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="updateStatusActive(scope.row)">{{
                      scope.row.is_active
                        ? "Non Aktifkan Toko"
                        : "Aktifkan Toko"
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <mks-pagination
        @prev="prevPage"
        @next="nextPage"
        :disable-prev="!outletStore.metaPagination.prev_cursor"
        :disable-next="!outletStore.metaPagination.next_cursor"
      ></mks-pagination>
    </div>
  </div>
  <mks-confirm
    v-model="deleteDialog"
    :message="`Apakah anda yakin akan menghapus toko ${selectedItem.name}?`"
    @cancel="deleteDialog = false"
    @confirm="confirmRemove"
  >
  </mks-confirm>
</template>

<script lang="ts" setup>
import http from "@/http-common";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useOutletStore } from "@/stores/outlet";
import { Outlet } from "@/types/outlet/Outlet.interface";
import { UserAccess } from "@/types/auth/UserAccess.interface";
import { showSuccessNotif, showErrorNotif } from "@/helper/notification";

import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksBadge from "@/components/atoms/MksBadge.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";
import MksPagination from "@/components/organism/MksPagination.vue";
import MksInputSearch from "@/components/atoms/MksInputSearch.vue";

const outlets = ref<Outlet[]>([]);
const outletStore = useOutletStore();
const loadingDatatable = ref<boolean>(false);

const fetchOutlet = async () => {
  loadingDatatable.value = true;
  try {
    const {
      status,
      data,
      meta: { prev_cursor, next_cursor },
    } = await outletStore.getOutlets({
      search: outletStore.search,
      perPage: outletStore.perPage!.toString(),
      cursor: outletStore.cursor,
    });

    if (status) {
      outlets.value = data;
      outletStore.metaPagination = { prev_cursor, next_cursor };
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDatatable.value = false;
  }
};

const authStore = useAuthStore();
const userAccessOutlet = computed(
  (): UserAccess => authStore.getUserAccessByCode("MMOUT")
);

onMounted(() => {
  fetchOutlet();
  authStore.fetchUserAccess();
});

const searchData = () => {
  outletStore.cursor = "";
  fetchOutlet();
};

const clearSearch = () => {
  outletStore.search = "";
  fetchOutlet();
};

const prevPage = () => {
  outletStore.cursor = outletStore.metaPagination.prev_cursor || "";
  fetchOutlet();
};

const nextPage = () => {
  outletStore.cursor = outletStore.metaPagination.next_cursor || "";
  fetchOutlet();
};

const deleteDialog = ref(false);
const selectedItem = ref<Outlet>({} as Outlet);

const selectItem = (item: Outlet) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const updateStatusActive = (item: any) => {
  const isActive = item.is_active ? 0 : 1;
  http
    .post(`/crow/v1/oklahoma/status/active/${item.uuid}`, { status: isActive })
    .then(async (res) => {
      const {
        data: { status, message },
      } = res;
      if (status) {
        await authStore.fetchUserAccess();
        showSuccessNotif("Berhasil Memperbarui Status Nonaktif Oulet");
        fetchOutlet();
      } else {
        showErrorNotif(message);
      }
    })
    .catch((err) => {
      showErrorNotif("Terjadi kesalahan server");
    });
};

const loadingBtnDialog = ref<boolean>(false);
const confirmRemove = () => {
  loadingBtnDialog.value = true;

  http
    .delete(`/crow/v1/nevada/${selectedItem.value.uuid}`)
    .then(async (res) => {
      const {
        data: { status, data },
      } = res;
      if (status) {
        await authStore.fetchUserAccess();
        showSuccessNotif("Toko berhasil dihapus");
        if (
          outlets.value.length == 1 &&
          outletStore.metaPagination.prev_cursor
        ) {
          outletStore.cursor = "";
        }
        fetchOutlet();
      } else {
        showErrorNotif(data.error[0].text);
      }
    })
    .catch((err) => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      deleteDialog.value = false;
      loadingBtnDialog.value = false;
      selectedItem.value = {} as Outlet;
    });
};

const router = useRouter();
const subscribe = () => {
  if (authStore.userProfile.subscription.expired_date) {
    router.push("/subscribe/add-ons");
  } else {
    router.push("/subscribe/list");
  }
};

const currentOutletId = computed(() => authStore.getCurrentOutletId);
</script>

<style lang="scss" scoped>
.alert__app {
  padding: 20px;
  z-index: 999;
  border-radius: 10px;
  background-color: #fff2f4;
  border: 1px dashed #ffa9b2;
  right: 45px;
}
.text-alert {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #0f0f0f;
}
</style>
