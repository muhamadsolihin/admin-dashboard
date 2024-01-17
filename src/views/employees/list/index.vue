<template>
  <div class="card p-3">
    <div class="card-body p-3 w-100" style="border-bottom: 1px solid #e6ecf5">
      <div class="row g-3 align-items-center justify-content-end">
        <div class="col-12 col-md-6">
          <MksTitle
            title="Daftar Karyawan"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
          ></MksTitle>
        </div>
        <div class="col-12 col-md-2">
          <div class="input-group form-control form-control-filter">
            <select
              class="form-select form-select-sm"
              v-model="employeeStore.outletId"
              placeholder="Select"
              @change="getEmployees"
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
              v-model="employeeStore.search"
              v-on:keyup.enter="getEmployees"
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
          <MksButton
            color="success"
            type="button"
            class="ms-3"
            size="lg"
            :disabled="
              userAccessEmployee?.have_access == 0 ||
              userAccessEmployee.amount == 0
            "
            @click="$router.push('/employee/add')"
          >
            <div class="d-flex flex-row align-items-center">
              <span class="me-2">Tambah</span
              ><img src="@/assets/images/icons/plus.svg" alt="icon" />
            </div>
          </MksButton>
        </div>
      </div>
    </div>
  </div>

  <div class="card-body">
    <div
      class="alert__app mb-3 d-flex justify-content-start align-items-center w-100 flex-row flex-wrap"
      v-if="
        userAccessEmployee?.have_access == 0 || userAccessEmployee.amount == 0
      "
    >
      <img src="@/assets/images/icons/warning.svg" class="me-3 mb-2" />
      <p class="text-alert d-flex justify-content-start mb-0">
        Anda tidak bisa menambah karyawan. Upgrade paket untuk menambah
        karyawan.
      </p>
      <div class="ms-auto">
        <MksButton
          size="sm"
          color="primary"
          class="mt-1"
          type="btn"
          @click="subscribe"
        >
          Upgrade Paket
        </MksButton>
      </div>
    </div>

    <el-table :data="Employees" v-loading="loading">
      <el-table-column
        prop="name"
        label-class="fw-bold"
        label="Nama"
        width="auto"
      >
      </el-table-column>
      <el-table-column
        prop="user_type"
        label-class="fw-bold"
        label="Tipe Akun"
        width="auto"
      >
        <template #default="scope">
          {{ scope.row.user_type == 1 ? "Owner" : "Kasir" }}
        </template></el-table-column
      >
      <el-table-column prop="is_active" label="Status" width="auto">
        <template #default="scope">
          <MksBadge v-if="scope.row.is_active" color="success" size="xl">
            Aktif
          </MksBadge>
          <MksBadge v-else color="danger"> Tidak Aktif </MksBadge>
        </template>
      </el-table-column>
      <el-table-column prop="is_center" label="Tipe" width="auto" sortable>
        <template #default="scope">
          {{ scope.row.is_center ? "Pusat" : "Cabang" }}
        </template>
      </el-table-column>
      <el-table-column label="Aksi" align="center" width="auto">
        <template #default="scope">
          <div class="d-flex justify-content-center my-3 flex-wrap">
            <MksButton
              :disabled="
                scope.row.is_center == 1 || scope.row.id == currentOutletId
              "
              @click="selectItem(scope.row)"
              type="danger button"
              size="lg"
              color="danger"
            >
              <span><img src="@/assets/images/icons/trash.svg" /></span>
            </MksButton>
            <MksButton
              @click="$router.push(`/employee/update/${scope.row.uuid}`)"
              type="buttom"
              color="secondary"
              class="bg-grey ms-3"
              size="lg"
            >
              <i><img src="@/assets/images/icons/pencil.svg" /></i>
            </MksButton>

            <el-dropdown
              trigger="click"
              class="ms-3"
              :disabled="scope.row.is_center == 1"
            >
              <span class="el-dropdown-link">
                <MksButton
                  :disabled="
                    scope.row.is_center == 1 || scope.row.id == currentOutletId
                  "
                  type="info"
                  size="lg"
                  color="secondary"
                >
                  <i
                    ><img src="@/assets/images/icons/three-dots-vertical.svg"
                  /></i>
                </MksButton>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateStatusActive(scope.row)">{{
                    scope.row.is_active
                      ? "Non Aktifkan Karyawan"
                      : "Aktifkan Karyawan"
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <MksPagination
      @prev="prevPage"
      @next="nextPage"
      :disablePrev="!employeeStore.metaPagination.prev_cursor"
      :disableNext="!employeeStore.metaPagination.next_cursor"
    >
    </MksPagination>
  </div>
  <MksConfirm
    v-model="deleteDialog"
    :message="`Apakah anda yakin akan menghapus karyawan ${selectedItem.name}?`"
    @cancel="deleteDialog = false"
    @confirm="confirmRemove"
  >
  </MksConfirm>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useEmployeeStore } from "@/stores/employee";
import http from "@/http-common";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";
import { Employee } from "@/types/employee/Employee.interface";
import { useOutletStore } from "@/stores/outlet";
import { useRouter } from "vue-router";
import { UserAccess } from "@/types/auth/UserAccess.interface";
import MksButton from "@/components/atoms/MksButton.vue";
import MksBadge from "@/components/atoms/MksBadge.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";
import MksPagination from "@/components/organism/MksPagination.vue";
import { useAuthStore } from "@/stores/auth";


const selectedItem = ref<Employee>({} as Employee);
const authStore = useAuthStore();
const userAccessEmployee = computed(
  (): UserAccess => authStore.getUserAccessByCode("BMAKS")
);
const currentOutletId = computed(() => authStore.getCurrentOutletId);
const router = useRouter();
const Employees = ref<Employee[]>([]);
const deleteDialog = ref(false);
const selectItem = (item: any) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const updateStatusActive = (item: any) => {
  const toggleStatus = item.is_active ? 0 : 1;
  employeeStore
    .updateStatusEmployee({
      uuid: item.uuid,
      formData: { status: toggleStatus },
    })
    .then(async (res) => {
      const response = res.data;
      if (response.status) {
        await authStore.fetchUserAccess();
        showSuccessNotif("Karyawan berhasil diaktifkan");
        getEmployees();
      } else {
        showErrorNotif(
          "Anda tidak dapat mengaktifkan karyawan, subscribe untuk dapat mengaktifkan karyawan."
        );
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    });
};

const loadingRemove = ref<boolean>(false);
const confirmRemove = () => {
  loadingRemove.value = true;
  http
    .delete(`/vulture/v1/nevada/${selectedItem.value.uuid}`)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Karyawan berhasil dihapus");
        if (
          Employees.value.length == 1 &&
          employeeStore.metaPagination.prev_cursor != null
        ) {
          employeeStore.cursor = "";
        }
        getEmployees();
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
      selectedItem.value = {} as Employee;
    });
};

const loading = ref<boolean>(false);
const employeeStore = useEmployeeStore();
const getEmployees = () => {
  loading.value = true;
  http
    .get(
      `/vulture/v1/?search=${employeeStore.search}&perpage=${employeeStore.perPage}&outlet_id=${employeeStore.outletId}&cursor=${employeeStore.cursor}`
    )
    .then((result) => {
      const res = result.data;
      if (res) {
        Employees.value = res.data;
        employeeStore.metaPagination = res.meta;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const prevPage = () => {
  employeeStore.cursor = employeeStore.metaPagination.prev_cursor || "";
  getEmployees();
};

const nextPage = () => {
  employeeStore.cursor = employeeStore.metaPagination.next_cursor || "";
  getEmployees();
};

const subscribe = () => {
  if (authStore.userProfile.subscription.expired_date) {
    router.push("/subscribe/add-ons");
  } else {
    router.push("/subscribe/list");
  }
};
const outletStore = useOutletStore();

onMounted(() => {
  outletStore.outlets = [];
  outletStore.getOutlets({
    search: "",
    cursor: "",
    perPage: "100",
  });

  getEmployees();
});
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
