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
            title="Tambah Karyawan"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          ></mks-title>
        </div>
      </div>
      <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
        <div class="row" style="margin-top: 30px">
          <div class="col-md-6">
            <label class="form-label">Nama </label>
            <Field
              type="text"
              name="name"
              v-model="name"
              rules="required"
              :class="{ 'border-danger': errors.name }"
              class="form-input form-control form-control-solid border border-2 w-100"
            />
            <p class="text-danger mt-2">{{ errors.name }}</p>
          </div>

          <div class="col-md-6">
            <div class="justify-content-end d-flex flex-column">
              <label class="form-label">Email</label>
              <Field
                type="email"
                name="email"
                v-model="email"
                :class="{ 'border-danger': errors.email }"
                rules="required"
                class="form-input form-control form-control-solid border border-2 w-100"
              />
              <p class="text-danger mt-2">{{ errors.email }}</p>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">No. Telepon</label>
            <div class="input-group form-input w-100" style="border: none">
              <span class="input-group-text">+62</span>
              <Field
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
            <label class="form-label">Lokasi</label>
            <Field
              name="village"
              v-model="village"
              rules="required"
              placeholder="Cari daerah..."
              @keyup="getVillage"
              class="form-input form-control form-control-solid border border-2 w-100"
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
            <p class="text-danger mt-2">{{ errors.village }}</p>
          </div>

          <div class="col-md-6 d-flex flex-column">
            <label class="form-label">Tipe Pengguna</label>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="radio"
                v-model="typeUser"
                id="inlineRadio2"
                value="2"
              />
              <label class="form-check-label" for="inlineRadio2">Kasir</label>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Pin</label>
            <Field
              type="text"
              rules="required|numeric|maxLength:6"
              name="pin"
              v-model="pin"
              :class="{ 'border-danger': errors.pin }"
              class="form-input d-none form-control form-control-solid border border-2 w-100"
            />
            <InputPinPassword
              :value="pin"
              :error="errors.pin"
              @update:value="(newVal) => (pin = newVal)"
            />
            <p class="text-danger mt-2">{{ errors.pin }}</p>
          </div>

          <div class="col-md-6">
            <div class="d-flex flex-column">
              <div>
                <label class="form-label">Alamat</label>
                <Field
                  name="address"
                  rules="required"
                  v-model="address"
                  :class="{ 'border-primary': errors.addressc }"
                  class="form-input form-control form-control-solid border border-2 w-100"
                />
                <p class="text-danger mt-2">{{ errors.address }}</p>
              </div>
              <div>
                <label class="form-label">Toko</label>
                <Field
                  as="select"
                  id="outlet"
                  name="outlet"
                  rules="required"
                  class="form-select form-select-solid border border-2"
                  :class="{ 'border-danger': errors.outlet }"
                  v-model="selectedOutlet"
                >
                  <option value="" disabled>Pilih Toko</option>
                  <option
                    :key="item.id"
                    :value="item.id.toString()"
                    v-for="item in myOutlets"
                  >
                    {{ item.name }}
                  </option>
                </Field>
                <p class="text-danger mt-2">{{ errors.outlet }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div v-bind="getRootProps()" v-if="image == null">
              <div
                class="upload__image_dropzone d-flex flex-column justify-content-center align-items-center"
                :class="{ drag__active: isDragActive }"
              >
                <div class="d-flex justify-content-center align-items-center">
                  <input v-bind="getInputProps()" />
                  <PictureSvg
                    :color="
                      isDragActive ? colorSvgPicture[0] : colorSvgPicture[1]
                    "
                  />
                  <h2>Unggah foto profil</h2>
                </div>
                <button
                  class="btn"
                  type="button"
                  :class="{
                    'btn-primary': isDragActive,
                    'btn-secondary': !isDragActive,
                  }"
                  style="margin-top: 30px"
                  @click.stop="open"
                >
                  Unggah foto
                </button>
              </div>
            </div>
            <div v-else class="d-flex mt-8">
              <p class="fw-bold m-0">File terpilih :</p>
              <p class="mx-2">
                {{ fileName }}
              </p>
              <p
                class="fw-bold text-decoration-underline text-primary m-0"
                style="cursor: pointer"
                @click="removeFile"
              >
                Batal
              </p>
            </div>
          </div>
        </div>

        <div class="col d-flex justify-content-end mt-5">
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
import { Form, Field } from "vee-validate";
import { useDropzone } from "vue3-dropzone";
import { ref, onMounted, computed } from "vue";
import PictureSvg from "@/components/atoms/PictureSvg.vue";
import InputPinPassword from "@/components/InputPinPassword.vue";
import { useOutletStore } from "@/stores/outlet";
import MksButton from "@/components/atoms/MksButton.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";

import { useRouter } from "vue-router";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";

const name = ref<string>("");
const phone = ref<string>("");
const email = ref<string>("");
const typeUser = ref<string>("2");
const address = ref<string>("");
const image = ref<any>(null);
const fileName = ref<string>("");
const pin = ref<string>("");
const village = ref<string>("");
const loading = ref<boolean>(false);
const dropdown = ref<boolean>(false);
const colorSvgPicture = ref<string[]>(["#E60023", "#b7bed3"]);
const selectedOutlet = ref<string>("");
const selectedVillage = ref<any>([]);
const villages = ref<any>([]);
const isLoadingMultiple = ref<boolean>(false);

const router = useRouter();
const myOutlets = computed(() => outletStore.activeOutlet);
onMounted(async () => {
  await outletStore.getOutlets({ search: "", cursor: "", perPage: "10" });
});
const onDrop = (acceptFiles: { name: string }[], rejectReasons: any) => {
  image.value = acceptFiles[0];
  fileName.value = acceptFiles[0].name;
};

const removeFile = () => {
  image.value = null;
  fileName.value = "";
};

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });

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

const onSubmit = () => {
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("email", email.value);
  if (phone.value) {
    formData.append("phone", `62${phone.value}`);
  }
  formData.append("user_type", typeUser.value);
  formData.append("address", address.value);
  formData.append("outlet_id", selectedOutlet.value);
  formData.append("village_id", selectedVillage.value[0]);
  formData.append("village_name", selectedVillage.value[1]);
  formData.append("pin", pin.value);

  if (image.value != null) {
    formData.append("image", image.value as any);
  }

  loading.value = true;
  http
    .post("/vulture/v1/california", formData)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Karyawan berhasil ditambahkan!");
        router.push("/employee/list");
      } else {
        showErrorNotif(res.error[0].text);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi Kesalahan Server!");
    })
    .finally(() => {
      loading.value = false;
    });
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
const outletStore = useOutletStore();
onMounted(() => {
  outletStore.outlets = [];
  outletStore.getOutlets({
    search: "",
    cursor: "",
    perPage: "100",
  });
});
</script>

<style lang="scss" scoped>
.btn__close {
  position: absolute;
  top: 0;
  right: 24px;
  margin-top: 41px;
  cursor: pointer;
}

.spinner__dropdown {
  position: absolute;
  top: 0;
  right: 24px;
  margin-top: 39px;
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
.subtitle {
  width: 75%;
  font-family: "Poppins";
  font-style: normal;
  margin-top: -1em;
  font-weight: 500;
  margin-top: -1em;
  font-size: 14px;
  line-height: 21px;
  color: #878d9f;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.text-header {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;

  line-height: 30px;
  color: #0f0f0f;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.upload__image_dropzone {
  width: 100%;
  height: 300px;
  margin-bottom: 30px;
  border-radius: 10px;
  border: 2px solid #878d9f;
  border-style: dashed;
  background-color: #fafafa;

  h2 {
    color: #000;
    margin-left: 10px;
  }
}

.drag__active {
  border: 2px solid #e60023;
  border-style: dashed !important;
  background-color: #fafafa;

  h2 {
    color: #e60023;
  }
}
</style>
