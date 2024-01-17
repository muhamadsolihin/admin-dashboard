<template>
  <div class="card">
    <div class="card-body p-3">
      <div class="card-body p-3" style="border-bottom: 1px solid #e6ecf5">
        <div
          class="d-flex justify-content-start align-items-start me-auto flex-wrap"
        >
          <a @click.prevent="$router.back" class="me-1" href="#"
            ><img
              class="d-flex align-items-center py-2 me-3 justify-content-center"
              src="@/assets/images/icons/back.svg"
          /></a>
          <mks-title
            title="Tambah Outlet"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          ></mks-title>
        </div>
      </div>

      <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
        <div class="row" style="margin-top: 30px">
          <div class="col-md-6">
            <label for="name" class="form-label">Nama Pemilik </label>
            <Field
              id="name"
              type="text"
              name="user_name"
              v-model="userName"
              rules="required"
              :class="{ 'border-danger': errors.user_name }"
              class="form-input form-control form-control-solid border border-2 w-100"
            />
            <p class="text-danger mt-2">{{ errors.user_name }}</p>
          </div>

          <div class="col-md-6">
            <div class="justify-content-end d-flex flex-column">
              <label for="ouletName" class="form-label">Nama Toko</label>
              <Field
                type="text"
                id="outletName"
                name="outlet_name"
                rules="required"
                v-model="outletName"
                :class="{ 'border-danger': errors.outlet_name }"
                class="form-input form-control form-control-solid border border-2"
              />
              <p class="text-danger">{{ errors.outlet_name }}</p>
            </div>
          </div>

          <div class="col-md-6">
            <label for="phone" class="form-label">No. Telepon</label>
            <div class="input-group form-input w-100" style="border: none">
              <span class="input-group-text">+62</span>
              <Field
                id="phone"
                type="number"
                name="phone"
                maxlength="13"
                v-model="phone"
                @keyup="checkingInputUser"
                :rules="(email as string).length > 0  ? '' : 'required'"
                :class="{ 'border-danger': errors.phone }"
                class="form-input form-control form-control-solid border border-2 input-with-prepend"
              />
            </div>
            <p class="text-danger mt-2">{{ errors.phone }}</p>
          </div>
          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <Field
              id="email"
              type="email"
              name="email"
              v-model="email"
              :class="{ 'border-danger': errors.email }"
              rules="required"
              class="form-input form-control form-control-solid border border-2 w-100"
            />
            <p class="text-danger mt-2">{{ errors.email }}</p>
          </div>

          <div class="col-md-6">
            <label for="food" class="form-label">Pilih Kategori:</label>
            <div class="d-flex flex-row flex-wrap">
              <div class="form-check me-3">
                <Field
                  name="outletCategory"
                  rules="required"
                  v-model="outletCategory"
                  class="form-check-input"
                  type="radio"
                  id="food"
                  value="1"
                />
                <label class="form-check-label" for="food"> Makanan </label>
              </div>
              <div class="form-check me-3">
                <Field
                  name="outletCategory"
                  v-model="outletCategory"
                  class="form-check-input"
                  type="radio"
                  id="shirt"
                  value="2"
                />
                <label class="form-check-label" for="shirt"> Pakaian </label>
              </div>
              <div class="form-check me-3">
                <Field
                  name="outletCategory"
                  v-model="outletCategory"
                  class="form-check-input"
                  type="radio"
                  id="retail"
                  value="3"
                />
                <label class="form-check-label" for="retail"> Retail </label>
              </div>
              <div class="form-check me-3">
                <Field
                  name="outletCategory"
                  v-model="outletCategory"
                  class="form-check-input"
                  type="radio"
                  id="other"
                  value="4"
                />
                <label class="form-check-label" for="other"> Other </label>
              </div>
            </div>
            <p class="text-danger mt-2">{{ errors.outletCategory }}</p>
          </div>
          <div class="col-md-6">
            <label for="online" class="form-label">Tipe Toko:</label>
            <div class="d-flex flex-row flex-wrap">
              <div class="form-check">
                <Field
                  name="outletType"
                  class="form-check-input"
                  v-model="outletType"
                  rules="required"
                  type="radio"
                  id="online"
                  value="1"
                />
                <label class="form-check-label" for="online"> Online </label>
              </div>
              <div class="form-check mx-3">
                <Field
                  name="outletType"
                  v-model="outletType"
                  class="form-check-input"
                  type="radio"
                  id="offline"
                  value="2"
                />
                <label class="form-check-label" for="offline"> Offline </label>
              </div>
              <div class="form-check">
                <Field
                  name="outletType"
                  class="form-check-input"
                  type="radio"
                  id="both"
                  v-model="outletType"
                  value="3"
                />
                <label class="form-check-label" for="both"> Keduanya </label>
              </div>
            </div>
            <p class="text-danger mt-2">{{ errors.outletType }}</p>
          </div>

          <div class="col-md-6">
            <label for="address" class="form-label">Alamat</label>
            <Field
              id="address"
              name="address"
              rules="required"
              v-model="address"
              :class="{ 'border-primary': errors.address }"
              class="form-input form-control form-control-solid border border-2 w-100"
            />
            <p class="text-danger mt-2">{{ errors.address }}</p>
          </div>
          <div class="col-md-6">
            <label for="location" class="form-label">Lokasi</label>
            <Field
              name="village"
              type="hidden"
              v-model="selectedVillage.name"
              rules="required"
            />
            <mks-input-select-search
              id="location"
              :items="villages"
              @search-data="getVillage"
              @selected="selectVillage"
              @clear="clearVillage"
              placeholder="Cari daerah..."
              :error="errors.village ? true : false"
            ></mks-input-select-search>
            <p class="text-danger mt-2">{{ errors.village }}</p>
          </div>

          <div class="col-md-12 mt-0">
            <label for="description" class="form-label">Deskripsi</label>
            <Field
              as="textarea"
              id="description"
              rules="required"
              name="outlet_description"
              v-model="outletDescription"
              :class="{ 'border-danger': errors.outlet_description }"
              class="textarea form-control form-control-solid border border-2 w-100"
            />
            <p class="text-danger mt-2">{{ errors.outlet_description }}</p>
          </div>

          <div class="col-md-6 mt-0 d-flex flex-column justify-content-center">
            <div>
              <input
                id="export"
                type="checkbox"
                name="is_export_product"
                v-model="isExportProduct"
                class="form-check-input ms-2"
              />
              <label for="export" class="form-label ms-3"
                >Ekspor produk dari toko utama</label
              >
            </div>
          </div>
        </div>

        <div class="col d-flex justify-content-end" style="margin-top: 100px">
          <mks-button
            type="button"
            size="lg"
            color="secondary"
            @click.prevent="$router.back"
          >
            Reset
          </mks-button>
          <mks-button
            :loading="loading"
            type="submit"
            size="lg"
            class="ms-3"
            color="primary"
          >
            Simpan
          </mks-button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import http from "@/http-common";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SelectedOption from "@/types/SelectedOption.interface";
import debounce from "lodash.debounce";

import { Form, Field } from "vee-validate";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksInputSelectSearch from "@/components/atoms/MksInputSelectSearch.vue";
import {
  showErrorNotif,
  showInfoNotif,
  showSuccessNotif,
} from "@/helper/notification";

const userName = ref<string>("");
const outletName = ref<string>("");
const outletType = ref<string>("");
const outletCategory = ref<string>("");
const outletDescription = ref<string>("");
const phone = ref<string>("");
const email = ref<string>("");
const typeUser = ref<string>("2");
const address = ref<string>("");
const selectedVillage = ref<SelectedOption>({
  id: 0,
  name: "",
});
const isExportProduct = ref<boolean>(false);
const loading = ref<boolean>(false);

const router = useRouter();

const authStore = useAuthStore();
const currentOutletId = computed(() => authStore.getCurrentOutletId);
const userAccessOutlet = computed(() => authStore.getUserAccessByCode("MMOUT"));

const onSubmit = () => {
  loading.value = true;

  if (
    userAccessOutlet.value.have_access == 0 ||
    userAccessOutlet.value.amount == 0
  ) {
    loading.value = false;
    showInfoNotif("Maaf anda tidak memiliki akses");
    return;
  }

  const formData = new FormData();
  formData.append("user_name", userName.value);
  formData.append("email", email.value);
  if (phone.value) {
    formData.append("phone", `62${phone.value}`);
  }
  formData.append("outlet_name", outletName.value);
  formData.append("outlet_type", outletType.value);
  formData.append("outlet_description", outletDescription.value);
  formData.append("user_type", typeUser.value);
  formData.append("outlet_category", outletCategory.value);
  formData.append("address", address.value);
  formData.append("outlet_id", currentOutletId.value.toString());
  formData.append("village_id", selectedVillage.value!.id!.toString());
  formData.append("village_name", selectedVillage.value.name);
  formData.append("is_export_product", isExportProduct.value ? 1 : (0 as any));

  http
    .post(`/crow/v1/california`, formData)
    .then((res) => {
      const {
        data: { status, data },
      } = res;
      if (status) {
        showSuccessNotif("Toko berhasil ditambahkan");
        router.push(`/outlet/list`);
      } else {
        showErrorNotif(data.error[0].text);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => {
      loading.value = false;
    });
};

const checkingInputUser = (event: Event) => {
  const _target = event.target as HTMLInputElement;
  if (
    _target.value.charAt(0) == "0" ||
    _target.value.charAt(0) == "6" ||
    _target.value.charAt(0) == "2"
  ) {
    phone.value = phone.value.toString().substring(1);
  }
};

const villages = ref<any>([]);
const dropdown = ref<boolean>(false);

const delayGetVillage = debounce((val: string) => {
  http.get(`/flamingo/v1/data-village?q=${val}`).then((res) => {
    if (res.data.status) {
      villages.value = res.data.data;
      dropdown.value = true;
    }
  });
}, 1000);

const getVillage = (val: string) => {
  delayGetVillage(val);
};

const selectVillage = (val: SelectedOption) => {
  selectedVillage.value = val;
};

const clearVillage = () => {
  selectedVillage.value = { id: 0, name: "" };
};

authStore.fetchUserAccess();
</script>
