<template>
  <div>
    <div class="card">
      <div class="card-body p-3">
        <div class="card-body p-3" style="border-bottom: 1px solid #e6ecf5">
          <div
            class="d-flex justify-content-start align-items-left me-auto flex-wrap"
          >
            <a @click.prevent="$router.back" class="me-2" href="#"
              ><img
                class="d-flex align-items-center py-2 me-3 justify-content-center"
                src="@/assets/images/icons/back.svg"
            /></a>
            <mks-title
              title="Tambah Banner"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
            ></mks-title>
          </div>
        </div>
        <div class="px-2">
          <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
            <div class="row g-3" style="margin-top: 30px">
              <div class="col-md-6">
                <label for="name" class="form-label">Nama</label>
                <Field
                  id="name"
                  type="text"
                  name="name"
                  v-model="name"
                  class="form-input form-control form-control-solid border border-2"
                />
              </div>
              <div class="col-md-6">
                <label for="urlImage" class="form-label">URL Gambar</label>
                <Field
                  id="urlImage"
                  type="text"
                  name="url"
                  v-model="url"
                  class="form-input form-control form-control-solid border border-2"
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-6">
                <label for="description" class="form-label">Deskripsi</label>
                <Field
                  type="text"
                  as="textarea"
                  rules="required"
                  id="description"
                  name="description"
                  v-model="description"
                  style="height: 300px"
                  :class="{ 'border-danger': errors.description }"
                  class="form-input form-control form-control-solid border border-2"
                />
                <p class="text-danger mt-2">{{ errors.description }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label">Upload Gambar</label>
                <div v-bind="getRootProps()" v-if="image == null">
                  <Field
                    type="text"
                    name="image"
                    rules="required"
                    v-model="image"
                    style="display: none"
                  />
                  <div
                    class="upload__image_dropzone d-flex flex-column justify-content-center align-items-center"
                    :class="{ drag__active: isDragActive || errors.image }"
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
                  v-else
                  class="w-100 d-flex flex-column flex-xxl-row align-items-start align-items-xxl-center"
                >
                  <p class="fw-bold m-0">File terpilih :</p>
                  <div class="d-flex align-items-center m-0 ms-xxl-2">
                    <p class="m-0">
                      {{ fileName }}
                      <span
                        class="fw-bold text-decoration-underline text-primary mb-0"
                        style="cursor: pointer"
                        @click="removeFile"
                      >
                        Batal
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-3 mt-md-1">
              <div class="col-md-6">
                <label for="outlet" class="form-label">Toko</label>
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
                <p class="text-danger mt-2">
                  {{ errors.outlet }}
                </p>
              </div>
            </div>

            <div class="col d-flex justify-content-end mt-3">
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
import http from "@/http-common";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useOutletStore } from "@/stores/outlet";

import { Form, Field } from "vee-validate";
import { useDropzone } from "vue3-dropzone";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import PictureSvg from "@/components/atoms/PictureSvg.vue";
import { ElNotification } from "element-plus";

const name = ref<string>("");
const url = ref<string>("");
const description = ref<string>("");
const selectedOutlet = ref<string>("");
const loading = ref<boolean>(false);
const router = useRouter();

const onSubmit = () => {
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("url", url.value);
  formData.append("description", description.value);
  formData.append("image", image.value);
  formData.append("outlet_id", selectedOutlet.value);

  loading.value = true;
  http
    .post(`/parrot/v1/banner/california`, formData)
    .then((res) => {
      const { data } = res;
      if (data.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "Banner berhasil ditambahkan!",
        });
        router.push("/setting/banner/list");
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 2000,
          customClass: "errorNotif",
          message: data.error[0].text,
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

const outletStore = useOutletStore();
onMounted(async () => {
  await outletStore.getOutlets({ search: "", cursor: "", perPage: "10" });
});

const myOutlets = computed(() => outletStore.activeOutlet);

const image = ref<any>(null);
const fileName = ref<string>("");

const onDrop = (acceptFiles: any, rejectReasons: any) => {
  image.value = acceptFiles[0];
  fileName.value = acceptFiles[0].name;
};

const { getRootProps, getInputProps, isDragActive, open, ...rest } =
  useDropzone({
    maxFiles: 1,
    onDrop,
  });

const removeFile = () => {
  image.value = null;
  fileName.value = "";
};

const colorSvgPicture = ref<string[]>(["#E60023", "#b7bed3"]);
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

.form-select {
  height: 3.1em !important;
  background-color: #f5f8fa;
}
</style>
