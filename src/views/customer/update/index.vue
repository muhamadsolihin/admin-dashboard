<template>
  <div class="card">
    <div class="card-body">
      <div class="container">
        <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
          <div class="row" style="margin-top: 30px">
            <div class="col-6">
              <label class="form-label">Nama</label>
              <Field
                type="text"
                name="name"
                v-model="name"
                rules="required"
                :class="{ 'border-danger': errors.name }"
                class="form-control form-input form-control-solid border border-2"
              />
              <p class="text-danger mt-2">{{ errors.name }}</p>
            </div>
            <div class="col-6">
              <label class="form-label">Email</label>
              <Field
                type="text"
                name="email"
                v-model="email"
                :class="{ 'border-danger': errors.email }"
                class="form-control form-input form-control-solid border border-2"
              />
              <p class="text-danger mt-2">{{ errors.email }}</p>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <label class="form-label">No. Telepon</label>
              <div class="input-group">
                <span class="input-group-text">+62</span>
                <Field
                  type="text"
                  name="phone"
                  maxLength="13"
                  v-model="phone"
                  @keyup="checkingInputUser"
                  :class="{ 'border-danger': errors.phone }"
                  class="form-control form-input form-control-solid border border-2"
                />
              </div>
              <p class="text-danger mt-2">{{ errors.phone }}</p>
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
  </div>
</template>
<script lang="ts" setup>
import { useStore } from "vuex";
import { Form, Field } from "vee-validate";
import { defineComponent, ref, onMounted } from "vue";
import { getModule } from "vuex-module-decorators";
import CustomerModule from "@/store/modules/CustomerModule";
import MksButton from "@/components/atoms/MksButton.vue";

import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";

const name = ref<string | Blob>("");
const phone = ref<string | Blob>("");
const email = ref<string | Blob>("");
const loading = ref<boolean>(false);
const dropdown = ref<boolean>(false);

const isLoadingMultiple = ref<boolean>(false);

const store = useStore();
const router = useRouter();
const route = useRoute();
const CustomerState = getModule(CustomerModule);

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

  loading.value = true;
  CustomerState.addCustomer(formData)
    .then((res) => {
      const response = res.data;

      if (response.status) {
        ElNotification({
          title: "Sukses",
          type: "success",
          duration: 2000,
          customClass: "successNotif",
          message: "Pelanggan berhasil ditambahkan!",
        });
      } else {
        ElNotification({
          title: "Error",
          type: "error",
          duration: 2000,
          customClass: "errorNotif",
          message: response.message,
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
    });
};

onMounted(async () => {
  CustomerState.getDetailCustomer(route.params.uuid).then((res) => {
    if (res.status) {
      name.value = res.data.name ? res.data.name : "";
      phone.value = res.data.phone ? res.data.phone : "";
      email.value = res.data.email ? res.data.email : "";
    }
  });
});
</script>
