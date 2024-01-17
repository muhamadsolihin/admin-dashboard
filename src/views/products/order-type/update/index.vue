<template>
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
            title="Ubah Tipe Pesanan"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
          nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
          voluptates,"
          ></mks-title>
        </div>
      </div>

      <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
        <div class="col" style="margin-top: 30px">
          <label class="form-label">Nama Tipe Pesanan</label>
          <Field
            type="text"
            rules="required"
            name="typeOrderName"
            v-model="typeOrderName"
            :class="{ 'border-danger': errors.typeOrderName }"
            class="form-control fom-input form-control-solid border border-2"
          />
          <p class="text-danger mt-2">{{ errors.typeOrderName }}</p>
        </div>
        <div class="col">
          <label class="form-label">Pilih Warna</label>
          <Field
            type="color"
            v-model="color"
            name="color"
            style="width: 50px"
            class="form-control form-input form-control-color form-control-solid border border-2"
          />
        </div>
        <div class="col d-flex justify-content-end mt-3">
          <mks-button :loading="loading" type="submit" size="lg" color="primary"
            >Simpan
          </mks-button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field } from "vee-validate";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import MksTitle from "@/components/atoms/Mkstitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import http from "@/http-common";
import { useRoute } from "vue-router";

const typeOrderName = ref<string | Blob>("");
const color = ref<string | Blob>("#000000");
const loading = ref<boolean>(false);
const router = useRouter();
const onSubmit = (values: any, { resetForm }) => {
  const formData = new FormData();
  formData.append("name", typeOrderName.value);
  formData.append("color", color.value);
  loading.value = true;
  http.post("/falcon/v1/type_order/california", formData).then((res) => {
    const response = res.data;
    if (response.status) {
      ElNotification({
        title: "Sukses",
        type: "success",
        duration: 2000,
        customClass: "successNotif",
        message: "Tipe pesanan berhasil ditambahkan!",
      });
      resetForm();
      router.push("/product/order-type/list");
    } else {
      ElNotification({
        title: "Error",
        type: "error",
        duration: 2000,
        customClass: "errorNotif",
        message: response.error[0].text,
      });
    }
  });
};

const route = useRoute();
onMounted(async () => {
  http
    .get(`/falcon/v1/type_order/hawaii/${route.params.uuid}`)
    .then((result) => {
      const res = result.data;
      if (res.status) {
        typeOrderName.value = res.data.name;
        color.value = res.data.color;
      }
    });
});
</script>
