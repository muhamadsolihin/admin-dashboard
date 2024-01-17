<template>
  <div class="card p-3">
    <div class="card-body p-3 w-100" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex flex-column flex-xl-row align-items-end align-items-xl-center justify-content-end gap-3"
      >
        <div class="w-80 me-auto">
          <mks-title
            title="Daftar Banner"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
          ></mks-title>
        </div>
        <div
          class="w-100 d-flex flex-column flex-md-row align-items-end align-items-md-center justify-content-end gap-3"
        >
          <div class="item-1">
            <div class="input-group form-control form-control-filter">
              <select
                v-model="bannerStore.outlet"
                placeholder="Select"
                @change="changeBanner"
                class="form-select form-select-sm"
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
          </div>
          <div class="item-2">
            <mks-input-search
              v-model="bannerStore.search"
              @enter="searchBanner"
              @clear="clearSearch"
            ></mks-input-search>
          </div>
          <mks-button
            color="success"
            type="button"
            size="lg"
            @click="$router.push('/setting/banner/add')"
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
      <el-table :data="banners" v-loading="loadingDatatable">
        <el-table-column label="Gambar">
          <template #default="scope">
            <img
              :src="scope.row.images"
              size="sm"
              style="cursor: pointer; width: 30%"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Deskripsi" />
        <el-table-column prop="name" label="Nama" />
        <el-table-column prop="url" label="URL Gambar" />
        <el-table-column label="Aksi" width="250" align="center">
          <template #default="scope">
            <div class="d-flex justify-content-center flex-wrap">
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
                    `/setting/banner/update/${scope.row.uuid}?oid=${scope.row.outlet_id}`
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
        :disablePrev="!bannerStore.metaPagination.prev_cursor"
        :disableNext="!bannerStore.metaPagination.next_cursor"
      ></mks-pagination>
    </div>
  </div>
  <mks-confirm
    v-model="deleteDialog"
    message="Apakah anda yakin akan menghapus item ini?"
    @cancel="deleteDialog = false"
    @confirm="confirmRemove"
  ></mks-confirm>
</template>

<script lang="ts" setup>
import http from "@/http-common";
import { ref, onMounted, computed } from "vue";
import { useOutletStore } from "@/stores/outlet";
import { useBannerStore } from "@/stores/settings/banner";
import { Banner } from "@/types/banner/Banner.interface";

import { ElNotification } from "element-plus";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksConfirm from "@/components/organism/MksConfirm.vue";
import MksPagination from "@/components/organism/MksPagination.vue";
import MksInputSearch from "@/components/atoms/MksInputSearch.vue";

const banners = ref<Banner[]>([]);
const loadingDatatable = ref<boolean>(false);
const coreUrlAPI = ref<string>("/parrot/v1/banner/");
const bannerStore = useBannerStore();

const getBanners = async () => {
  loadingDatatable.value = true;

  try {
    const {
      data: { data: listBanners, meta, status },
    } = await http.get(
      `${coreUrlAPI.value}index?search=${bannerStore.search}&perpage=${
        bannerStore.perPage
      }&cursor=${bannerStore.cursor}&outlet_id=${bannerStore.outlet || ""}`
    );

    if (status) {
      banners.value = listBanners;
      const { next_cursor, prev_cursor } = meta;
      bannerStore.metaPagination = { prev_cursor, next_cursor };
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDatatable.value = false;
  }
};

onMounted(() => {
  getBanners();
});

const searchBanner = () => {
  bannerStore.cursor = "";
  getBanners();
};

const clearSearch = () => {
  bannerStore.search = "";
  getBanners();
};

const changeBanner = () => {
  bannerStore.cursor = "";
  getBanners();
};

const prevPage = () => {
  bannerStore.cursor = bannerStore.metaPagination.prev_cursor || "";
  getBanners();
};

const nextPage = () => {
  bannerStore.cursor = bannerStore.metaPagination.next_cursor || "";
  getBanners();
};

const outletStore = useOutletStore();
const filterOutlets = computed(() => outletStore.outletsForFilter);

onMounted(() => {
  outletStore.getOutlets({ search: "", cursor: "", perPage: "10" });
});

const deleteDialog = ref<boolean>(false);
const selectedItem = ref<Banner>({} as Banner);

const selectItem = (item: any) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const loadingBtnDialog = ref<boolean>(false);
const confirmRemove = () => {
  loadingBtnDialog.value = true;
  http
    .delete(
      `${coreUrlAPI.value}nevada/${selectedItem.value.uuid}?outlet_id=${selectedItem.value.outlet_id}`
    )
    .then((res) => {
      if (res.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 3000,
          customClass: "successNotif",
          message: "Banner berhasil dihapus",
        });
        if (
          banners.value.length == 1 &&
          bannerStore.metaPagination.prev_cursor
        ) {
          bannerStore.cursor = "";
        }
        getBanners();
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 3000,
          customClass: "errorNotif",
          message: res.data.error[0].text,
        });
      }
    })
    .finally(() => {
      deleteDialog.value = false;
      loadingBtnDialog.value = false;
      selectedItem.value = {} as Banner;
    });
};
</script>

<style lang="scss" scoped>
.input-search {
  @media screen and (max-width: 768px) {
    margin-left: 1em !important;
    padding-bottom: 50px !important;
  }
}

.item-1,
.item-2 {
  flex: 1;
  max-width: 250px;
}

@media screen and (max-width: 768px) {
  .item-1,
  .item-2 {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
}
</style>
