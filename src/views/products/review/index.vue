<template>
  <div class="card p-3">
    <div class="card-body p-3 w-100" style="border-bottom: 1px solid #e6ecf5">
      <div
        class="d-flex flex-column flex-xl-row align-items-end align-items-xl-center justify-content-end gap-3"
      >
        <div class="w-80 me-auto">
          <mks-title
            title="Daftar Ulasan"
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
                v-model="selectedOutlet"
                placeholder="Select"
                @change="searchData"
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
              v-model="search"
              @enter="searchData"
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
      <el-table :data="reviews" v-loading="loadingDatatable">
        <el-table-column prop="name" label="Nama" width="auto" sortable />

        <el-table-column prop="unix_time" label="Tanggal" width="auto" sortable>
          <template #default="prop">
            {{
              formatDate(convertEpochToDate(prop.row.unix_time), "DD MMM YYYY")
            }}
          </template>
        </el-table-column>

        <el-table-column prop="review" label="Ulasan" width="auto" sortable>
          <template #default="prop">
            {{ prop.row.review || "Tanpa ulasan" }}
          </template>
        </el-table-column>

        <el-table-column prop="files" label="Lampiran" width="auto" sortable>
          <template #default="prop">
            <div v-if="prop.row.files" class="d-flex align-items-center">
              <img
                class="rounded pointer"
                style="width: 40px; height: 40px; cursor: pointer"
                :src="prop.row.files[0].url"
                v-if="
                  prop.row.files[0].url.includes('.jpg') ||
                  prop.row.files[0].url.includes('.jpeg') ||
                  prop.row.files[0].url.includes('.png')
                "
                @click="selectAttachment(prop.row.files)"
                loading="lazy"
                alt="ulasan"
              />
              <div
                v-else
                class="wrapper__video rounded pointer"
                @click="selectAttachment(prop.row.files)"
              >
                <video
                  onload="none"
                  class="rounded"
                  style="width: 100%; height: 100%; object-fit: cover"
                >
                  <source :src="prop.row.files[0].url" />
                </video>
                <img
                  class="play"
                  loading="lazy"
                  src="@/assets/images/icons/button-play.png"
                />
              </div>
              <p
                class="mb-0 ms-2 pointer"
                @click="selectAttachment(prop.row.files)"
                v-if="prop.row.files.length > 1"
              >
                {{ prop.row.files.length - 1 }} lainnya
              </p>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column prop="star" label="Penilaian" width="200px" sortable>
          <template #default="scope">
            <mks-rating :value="scope.row.star"></mks-rating>
          </template>
        </el-table-column>
      </el-table>
      <mks-pagination
        @prev="prevPage"
        @next="nextPage"
        :disable-prev="!metaPagination.prev_cursor"
        :disable-next="!metaPagination.next_cursor"
      ></mks-pagination>
    </div>

    <mks-dialog-attachment
      v-model="dialogAttachment"
      v-model:selected-review="selectedReview"
    ></mks-dialog-attachment>
  </div>
</template>
<script lang="ts" setup>
import http from "@/http-common";
import { ref, onMounted, computed } from "vue";
import { convertEpochToDate, formatDate } from "@/helper";
import { useOutletStore } from "@/stores/outlet";
import { Review } from "@/types/products/Review.interface";
import MetaPagination from "@/types/MetaPagination.interface";

import MksTitle from "@/components/atoms/MksTitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import MksPagination from "@/components/organism/MksPagination.vue";
import MksInputSearch from "@/components/atoms/MksInputSearch.vue";
import MksRating from "./components/MksRating.vue";
import MksDialogAttachment from "./components/MksDialogAttachment.vue";

const reviews = ref<Review[]>([]);
const cursor = ref<string | null>("");
const perPage = ref<number>(10);
const search = ref<string>("");
const selectedOutlet = ref<string>("0");
const loadingDatatable = ref<boolean>(false);
const metaPagination = ref<MetaPagination>({
  prev_cursor: "",
  next_cursor: "",
});

const fetchReviews = async () => {
  loadingDatatable.value = true;
  try {
    const {
      data: {
        status,
        data,
        meta: { prev_cursor, next_cursor },
      },
    } = await http.get(
      `/penguin/v1/dash-reviewed?perpage=${perPage.value}&search=${search.value}&outlet_id=${selectedOutlet.value}&cursor=${cursor.value}`
    );
    if (status) {
      reviews.value = data;
      metaPagination.value = { prev_cursor, next_cursor };
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingDatatable.value = false;
  }
};

onMounted(() => fetchReviews());

const searchData = () => {
  cursor.value = "";
  fetchReviews();
};

const clearSearch = () => {
  search.value = "";
  fetchReviews();
};

const nextPage = () => {
  cursor.value = metaPagination.value.next_cursor || "";
  fetchReviews();
};

const prevPage = () => {
  cursor.value = metaPagination.value.prev_cursor || "";
  fetchReviews();
};

const outletStore = useOutletStore();
const filterOutlets = computed(() => outletStore.outletsForFilter);

onMounted(() =>
  outletStore.getOutlets({ search: "", cursor: "", perPage: "10" })
);

const dialogAttachment = ref<boolean>(false);
const selectedReview = ref<{
  onReview: string;
  files: { name: string; url: string }[];
}>({
  onReview: "",
  files: [],
});

const selectAttachment = (files: any) => {
  selectedReview.value.onReview = files[0].url;
  selectedReview.value.files = files;
  dialogAttachment.value = true;
};
</script>

<style lang="scss">
.on-review {
  width: 100%;
  height: 500px;

  img {
    width: 100%;
    object-fit: cover;
    height: auto;
    max-height: 500px;
  }
}

.items-review {
  display: flex;
  gap: 10px;
  width: 100%;
  overflow-x: auto;
  padding: 15px 0;
}

.wrapper__video {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
}

.play {
  position: absolute;
  width: 30px;
  height: 30px;
  // top: 0;
}
</style>
