<template>
  <div>
    <div class="card">
      <div class="card-body p-3">
        <div
          class="d-flex justify-content-start align-items-left me-auto flex-wrap"
        >
          <a @click.prevent="$router.back" class="me-2" href="#"
            ><img
              class="d-flex align-items-center py-2 me-3 justify-content-center"
              src="@/assets/images/icons/back.svg"
          /></a>
          <mks-title
            title="Edit Banner"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
              nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
              voluptates,"
          ></mks-title>
        </div>
        <div class="container">
          <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
            <div class="row" style="margin-top: 30px">
              <div class="col-md-6">
                <label class="form-label">Nama</label>
                <Field
                  type="text"
                  name="name"
                  v-model="name"
                  class="form-input form-control form-control-solid border border-2"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">URL Gambar</label>
                <Field
                  type="text"
                  name="url"
                  v-model="url"
                  class="form-input form-control form-control-solid border border-2"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-6">
                <label class="form-label">Deskripsi</label>
                <Field
                  type="text"
                  as="textarea"
                  rules="required"
                  name="description"
                  v-model="description"
                  style="height: 300px"
                  :class="{ 'border-danger': errors.description }"
                  class="form-input form-control form-control-solid border border-2"
                />
                <p class="text-danger mt-2">{{ errors.description }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">Gambar </label>

                <div
                  class="row"
                  v-bind="getRootProps()"
                  v-if="image == null && fileName == ''"
                >
                  <Field
                    type="text"
                    name="image"
                    rules="required"
                    v-model="image"
                    style="display: none"
                  />
                  <div
                    class="upload__image_dropzone d-flex flex-column justify-content-center align-items-center"
                    :class="{
                      drag__active: isDragActive || errors.image,
                    }"
                  >
                    <div
                      class="d-flex justify-content-center align-items-center"
                    >
                      <input v-bind="getInputProps()" />
                      <PictureSvg
                        :color="
                          isDragActive || errors.image
                            ? colorSvgPicture[0]
                            : colorSvgPicture[1]
                        "
                      />
                      <h2>Unggah Banner</h2>
                    </div>
                    <button
                      type="button"
                      class="btn"
                      :class="{
                        'btn-primary': isDragActive,
                        'btn-secondary': !isDragActive,
                      }"
                      style="margin-top: 30px"
                      @click.stop="open"
                    >
                      Unggah banner
                    </button>
                  </div>
                </div>
                <div
                  v-else-if="image && fileName == ''"
                  style="position: relative; width: 300px"
                  class="mb-3 mt-8"
                >
                  <img
                    style="width: 300px; height: 300px; object-cover"
                    class="rounded"
                    :src="image"
                  />
                  <div
                    style="
                      position: absolute;
                      top: 0;
                      right: -30px;
                      z-index: 98;
                    "
                  >
                    <i @click="editImage" style="cursor: pointer">
                      <img
                        size="lg"
                        class="w-100"
                        src="@/assets/images/icons/pencil.svg"
                      />
                    </i>
                  </div>
                </div>
                <div v-else>
                  <div class="row">
                    <div class="col d-flex">
                      <p class="fw-bold m-0 mt-8">File terpilih :</p>
                      <p class="mx-2 mt-8">
                        {{ fileName }}
                      </p>
                      <p
                        class="fw-bold text-decoration-underline text-primary m-0 mt-8"
                        style="cursor: pointer"
                        @click="removeFile"
                      >
                        Batal
                      </p>
                    </div>
                  </div>
                </div>

                <p
                  v-if="editedImage && fileName == ''"
                  class="text-center text-primary"
                  @click="cancelEditImage"
                  style="cursor: pointer"
                >
                  Cancel
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label class="form-label">Toko</label>
                <Field
                  disabled
                  as="select"
                  name="outlet"
                  rules="required"
                  v-model="selectedOutlet"
                  class="form-input form-select form-select-solid border border-2 text__grey"
                  :class="{ 'border-primary': errors.outlet }"
                >
                  <option value="" disabled>Pilih Toko</option>
                  <option
                    :value="item.id.toString()"
                    :key="item.id"
                    v-for="item in myOutlets"
                  >
                    {{ item.name }}
                  </option>
                </Field>
                <p class="text-danger mt-2">
                  {{ errors.outlet }}
                </p>
              </div>
            </div>

            <div
              class="col d-flex justify-content-end"
              style="margin-top: 200px"
            >
              <mks-button
                :loading="loading"
                type="submit"
                size="lg"
                color="primary"
                >Simpan
              </mks-button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field } from "vee-validate";
import { ref, onMounted, computed } from "vue";
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/AuthModule";
import BannerModule from "@/store/modules/BannerModule";
import OutletModule from "@/store/modules/OutletModule";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import { useDropzone } from "vue3-dropzone";
import PictureSvg from "@/components/atoms/PictureSvg.vue";

import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";

const name = ref<string>("");
const url = ref<string>("");
const description = ref<string>("");
const image = ref<any>(null);
const imageTemporary = ref<any>(null);
const fileName = ref<string>("");
const editedImage = ref<boolean>(false);
const selectedOutlet = ref<string>("");

const colorSvgPicture = ref<string[]>(["#E60023", "#b7bed3"]);
const loading = ref<boolean>(false);
const route = useRoute();
const router = useRouter();

const AuthState = getModule(AuthModule);
const BannerState = getModule(BannerModule);
const OutletState = getModule(OutletModule);

const myOutlets = computed(() =>
  OutletState.getOutlets.filter(
    (item) => item.id !== null && item.is_active != 0
  )
);
const myOutletId = computed(() => AuthState.getOutletId);
const search = ref<string>("");
const cursor = ref<string | null>("");
const perPage = ref<number>(10);

const onDrop = (acceptFiles: { name: string }[], rejectReasons: any) => {
  editedImage.value = false;
  image.value = acceptFiles[0];
  fileName.value = acceptFiles[0].name;
};

const { getRootProps, getInputProps, ...rest } = useDropzone({
  maxFiles: 1,
  onDrop,
});

const removeFile = () => {
  image.value = imageTemporary.value;
  fileName.value = "";
};

const onSubmit = async () => {
  const formData = new FormData();
  formData.append("uuid", route.params.uuid as any);
  formData.append("name", name.value);
  formData.append("url", url.value);
  formData.append("description", description.value);
  formData.append("outlet_id", selectedOutlet.value);
  formData.append("outlet_id", selectedOutlet.value);
  formData.append("_method", "PUT");

  if (typeof image.value != "string" || image.value != null) {
    formData.append("image", image.value);
  }
  if (typeof image.value != "string" || image.value != null) {
    formData.append("image", fileName.value);
  }

  loading.value = true;
  BannerState.updateBanner(formData)
    .then((res) => {
      const response = res.data;

      if (response.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "Banner berhasil diupdate!",
        });
        router.push(`/setting/banner/list`);
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
      loading.value = false;
      name.value = "";
      url.value = "";
    });
};

const editImage = () => {
  image.value = null;
  editedImage.value = true;
};

const cancelEditImage = () => {
  image.value = imageTemporary.value;
  editedImage.value = false;
};

onMounted(() => {
  OutletState.SET_OUTLETS([]);
  OutletState.getOutletsAPI({
    outletId: myOutletId.value,
    search: search.value,
    cursor: cursor.value,
    perPage: perPage.value,
  });
});

onMounted(async () => {
  const detail = await BannerState.getDetail({
    uuid: route.params.uuid,
    outletId: route.query.oid,
  });

  name.value = detail.data.name;
  url.value = detail.data.url;
  description.value = detail.data.description;
  image.value = detail.data.images;
  imageTemporary.value = detail.data.images;
  selectedOutlet.value = detail.data.outlet_id?.toString();
});
</script>

<style lang="scss" scoped>
.upload__image_dropzone {
  width: 100%;
  height: 300px;
  margin-bottom: 0px;
  border-radius: 10px;
  border: 2px solid #e6ecf5;
  border-style: dashed;

  h2 {
    color: #e6ecf5;
    margin-left: 10px;
  }
}
.drag__active {
  border: 2px solid #e60023;
  border-style: dashed !important;

  h2 {
    color: #e60023;
  }
}

.cust__collapse {
  transition: all 500ms ease-in-out;
}
</style>
