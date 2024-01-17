<template>
  <div class="w-100 background__wrapper d-flex justify-content-center">
    <div class="card p-3 d-flex flex-column align-items-center width__responsive">
      <p class="fs-24 fw-bold mb-0">Data Toko</p>
      <p class="text-secondary">Isilah data toko dibawah ini</p>
      <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off" class="w-100">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-shop mx-1"></i>
          </span>
          <Field
            type="text"
            name="outletName"
            v-model="outletName"
            rules="required"
            :class="{ 'border-danger': errors.outletName }"
            class="form-input form-control form-control-solid border"
            placeholder="Nama Toko"
          />
        </div>
        <p class="text-danger mt-1">{{ errors.outletName }}</p>
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-person mx-1"></i>
          </span>
          <Field
            type="text"
            name="userName"
            v-model="userName"
            rules="required"
            :class="{ 'border-danger': errors.userName }"
            class="form-input form-control form-control-solid border"
            placeholder="Nama Pemilik"
          />
        </div>
        <p class="text-danger mt-1">{{ errors.userName }}</p>

        <div class="input-group mb-3">
          <span class="input-group-text border border-2 fs-12 mx-0">+62</span>
          <Field
            type="text"
            name="phone"
            v-model="authStore.phone"
            rules="required"
            :class="{ 'border-danger': errors.phone }"
            class="form-input form-control form-control-solid border"
            placeholder="No. Telepon"
            @keyup="validateInputPhoneNumber"
          />
        </div>
        <p class="text-danger mt-1">{{ errors.phone }}</p>

        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-envelope mx-1"></i>
          </span>
          <Field
            type="text"
            name="email"
            v-model="authStore.email"
            rules="required"
            :class="{ 'border-danger': errors.email }"
            class="form-input form-control form-control-solid border"
            placeholder="E-mail"
          />
        </div>
        <p class="text-danger mt-1">{{ errors.email }}</p>
        <div class="input-group mb-1">
          <span class="input-group-text">
            <i class="bi bi-geo-alt mx-1"></i>
          </span>
          <Field
            name="village"
            v-model="village"
            rules="required"
            placeholder="kelurahan"
            @keyup="getVillage"
            class="form-input form-control form-control-solid border border-2"
          />
          <div
            class="btn__close"
            @click="clearDropdown"
            v-if="!isLoadingMultiple && village.length >= 4"
          >
            <i class="bi bi-x-lg"></i>
          </div>
          <div class="spinner__dropdown" v-if="isLoadingMultiple">
            <span
              class="spinner-border spinner-border-sm text-primary"
              role="status"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden">Loading...</span>
          </div>

          <div
            class="rounded p-2 bg-white dropdown__cust shadow"
            :style="{ opacity: dropdown ? 5 : 0 }"
            v-if="dropdown"
          >
            <div class="d-flex flex-column">
              <div
                class="list p-1"
                :data-id="item.id"
                :data-name="item.name"
                @click="selectVillage"
                v-for="(item, index) in villages"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <p class="text-danger mt-1">{{ errors.village }}</p>

        <mks-pick-address
          v-model:latitude="latitude"
          v-model:longitude="longitude"
          v-model:address="address"
          @setPickedCoordinate="changeCoordinate"
        ></mks-pick-address>

        <div class="input-group mb-3 mt-3">
          <span class="input-group-text">
            <i class="bi bi-geo-alt-fill mx-1"></i>
          </span>
          <Field
            type="text"
            name="address"
            rules="required"
            v-model="address"
            class="form-control border border-2 rounded-end"
            :class="{ 'border-danger': errors.address }"
            placeholder="Alamat"
            disabled
          />
        </div>

        <div class="d-flex flex-column">
          <label class="form-label">Tipe Toko:</label>
          <div class="d-flex flex-row flex-wrap">
            <div class="form-check">
              <Field
                name="outletType"
                class="form-check-input"
                rules="required"
                v-model="outletType"
                type="radio"
                id="online"
                value="1"
              />
              <label class="form-check-label" for="online"> Online </label>
            </div>
            <div class="form-check mx-3">
              <Field
                name="outletType"
                class="form-check-input"
                v-model="outletType"
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
                v-model="outletType"
                type="radio"
                id="both"
                value="3"
              />
              <label class="form-check-label" for="both"> Keduanya </label>
            </div>
          </div>
          <p class="text-danger mt-1">{{ errors.outletType }}</p>
        </div>
        <h3 class="title__category">Kategori Toko</h3>
        <div class="d-flex flex-wrap justify-content-between">
          <div
            class="category__wrapper p-4 my-3 rounded"
            :class="{ category__active: item.id == outletCategory }"
            v-for="(item, i) in categories"
            @click="changeCategory(item.id)"
            style="cursor: pointer"
            :key="i"
          >
            <div class="d-flex align-items-center">
              <div
                class="category__wrapper_icon bg__color_grey_light rounded"
                :class="{ 'bg-white': item.id == outletCategory }"
              >
                <FoodSvg
                  v-if="item.name == 'Makanan & Minuman'"
                  :color="
                    item.id == outletCategory ? colorSvg[0].value : colorSvg[1].value
                  "
                />
                <ClothingSvg
                  v-if="item.name == 'Pakaian' || item.name == 'Retail'"
                  :color="
                    item.id == outletCategory ? colorSvg[0].value : colorSvg[1].value
                  "
                />
                <OtherSvg
                  v-if="item.name == 'Lain-lain'"
                  :color="
                    item.id == outletCategory ? colorSvg[0].value : colorSvg[1].value
                  "
                />
              </div>
              <h6 class="ms-3">{{ item.name }}</h6>
            </div>
          </div>
        </div>

        <div class="my-3">
          <Field
            rows="5"
            as="textarea"
            rules="required"
            v-model="outletDescription"
            name="outletDescription"
            class="form-control border border-2 deskripsi rounded-end"
            placeholder="Tentang bisnis anda"
          ></Field>
        </div>
        <p class="text-danger">{{ errors.outletDescription }}</p>

        <mks-button
          :loading="loading"
          type="submit"
          size="lg"
          class="w-100"
          color="primary"
        >
          DAFTAR
        </mks-button>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import http from "@/http-common";
import router from "@/router";
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Form, Field } from "vee-validate";
import { isNumber, validateEmail } from "@/helper";
import { Coordinate } from "@/types/auth/Coordinate.interface";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";
import FoodSvg from "@/components/svg/FoodSvg.vue";
import ClothingSvg from "@/components/svg/ClothingSvg.vue";
import OtherSvg from "@/components/svg/OtherSvg.vue";

import MksButton from "@/components/atoms/MksButton.vue";
import MksPickAddress from "@/components/organism/MksPickAddress.vue";

const authStore = useAuthStore();

const categories = [
  {
    id: 1,
    name: "Makanan & Minuman",
  },
  {
    id: 2,
    name: "Pakaian",
  },
  {
    id: 3,
    name: "Retail",
  },
  {
    id: 4,
    name: "Lain-lain",
  },
];

const colorSvg = ref<any[]>([
  {
    state: "active",
    value: "#E60023",
  },
  {
    state: "inactive",
    value: "#b7bed3",
  },
]);
const changeCategory = (value: number): void => {
  outletCategory.value = value;
};
const outletName = ref<string>("");
const userName = ref<string>("");
const address = ref<string>("");
const latitude = ref(0);
const longitude = ref(0);

const outletType = ref<string>("3");
const outletDescription = ref<string>("");

const outletCategory = ref<number>(1);
const village = ref<string>("");
const loading = ref<boolean>(false);
const dropdown = ref<boolean>(false);
const selectedVillage = ref<any>([]);
const villages = ref<any>([]);
const isLoadingMultiple = ref<boolean>(false);
const selectVillage = (event: Event) => {
  const _target = event.target as HTMLDivElement;

  const array = [
    _target.getAttributeNode("data-id")?.value,
    _target.getAttributeNode("data-name")?.value,
  ];

  selectedVillage.value = array;
  village.value = selectedVillage.value[1];
  dropdown.value = false;
};

const clearDropdown = () => {
  village.value = "";
  dropdown.value = false;
};

const pickedPos = ref<Coordinate>({} as Coordinate);
function changeCoordinate(event: Coordinate) {
  pickedPos.value = event;
}

const validateInputPhoneNumber = (event: Event) => {
  const _target = event.target as HTMLInputElement;

  if (!isNumber(_target.value)) {
    authStore.phone = authStore.phone.substring(0, _target.value.length - 1);
    return;
  }

  if (_target.value.charAt(0) == "0") {
    authStore.phone = authStore.phone.substring(1);
  }
};

const getVillage = (event: Event) => {
  const _target = event.target as HTMLInputElement;

  if (_target.value.length >= 4) {
    isLoadingMultiple.value = true;

    if (isLoadingMultiple.value == true) {
      http.get(`/flamingo/v1/data-village?q=${_target.value}`).then((res) => {
        if (res.data.status) {
          villages.value = res.data.data;
          dropdown.value = true;
        }
        isLoadingMultiple.value = false;
      });
    }
  }
};

const onSubmit = (
  _values: any,
  actions: { setFieldError: (arg0: string, arg1: string) => void }
) => {
  if (authStore.email != "" && !validateEmail(authStore.email)) {
    actions.setFieldError("email", "Email tidak valid");
    showErrorNotif("Email tidak valid");
    return false;
  }
  loading.value = true;

  const formData = new FormData();
  formData.append("outlet_name", outletName.value);
  formData.append("user_name", userName.value);
  formData.append("email", authStore.email);
  formData.append("village_id", selectedVillage.value[0]);
  formData.append("village_name", selectedVillage.value[1]);
  formData.append("address", address.value);
  formData.append("latitude", pickedPos.value.lat.toString());
  formData.append("longitude", pickedPos.value.lng.toString());
  formData.append("outlet_type", outletType.value);
  formData.append("outlet_category", outletCategory.value as any);
  formData.append("outlet_description", outletDescription.value);
  formData.append("pin", authStore.settingPin);
  formData.append("pin_confirmation", authStore.confirmationPin);
  formData.append("auth_use", authStore.authType.toString());

  if (authStore.phone) {
    formData.append("phone", `62${authStore.phone}`);
  } else {
    formData.append("phone", "");
  }
  http
    .post("/owl/v1/register", formData)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Registrasi akun berhasil!");
        router.push("/login");
      } else {
        showErrorNotif(res.data.error[0].text);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => (loading.value = false));
};

onMounted(() => {
  if (!authStore.phone && !authStore.email) {
    router.push("/registration");
  }
});

onUnmounted(() => {
  authStore.phone = "";
  authStore.email = "";
});
</script>

<style lang="scss" scoped>
.background__wrapper {
  min-height: 100vh;
  background-color: #f1f5ff;
}

.width__responsive {
  margin: 30px;
  width: 500px;
}
.category__wrapper {
  width: 230px;
  background-color: white;
  border: 2px solid #f1f5ff;
}

.category__active {
  border: 2px solid #e60023;
  background-color: #fff1ea;
}

.category__wrapper_icon {
  // padding: 20px;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner__dropdown {
  position: absolute;
  top: 0;
  right: 24px;
  margin-top: 39px;
}
.deskripsi {
  resize: none;
  height: 50%;
}

.dropdown__cust {
  position: absolute;
  top: 0;
  margin: 80px 0;
  z-index: 10;
  padding: 10px 0;
  width: 96%;
  max-height: 300px;
  opacity: 0;
  overflow-y: auto;
  transition: all ease-in-out 0.2ms;

  .list {
    padding: 10px 20px;
  }
  .list:hover {
    background-color: #e60023;
    color: white !important;
    cursor: pointer;
  }
}
</style>
