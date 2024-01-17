<template>
  <div class="card">
    <div class="card-body p-3">
      <div class="card-body p-3" style="border-bottom: 1px solid #e6ecf5">
        <div class="d-flex justify-content-start align-items-start me-auto flex-wrap">
          <a @click.prevent="$router.back" class="me-1" href="#"
            ><img
              class="d-flex align-items-center py-2 me-3 justify-content-center"
              src="@/assets/images/icons/back.svg"
          /></a>
          <mks-title
            title="Tambah Diskon"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          ></mks-title>
        </div>
      </div>

      <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
        <div class="row" style="margin-top: 30px">
          <div class="col-12 col-md-6">
            <label class="form-label">Nama Diskon</label>
            <Field
              type="text"
              rules="required"
              name="voucherName"
              v-model="voucherName"
              :class="{ 'border-danger': errors.voucherName }"
              class="form-control form-input form-control-solid border border-2"
            />
            <p class="text-danger mt-2">{{ errors.voucherName }}</p>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Tipe Diskon</label>
            <Field
              as="select"
              name="typeVoucher"
              v-model="typeVoucher"
              @change="changeTypeVoucher"
              class="form-select form-input form-select-solid border border-2"
            >
              <option :value="1">Rupiah</option>
              <option :value="2">Persentase</option>
            </Field>
            <p class="text-danger mt-2"></p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <label class="form-label">Jumlah Diskon</label>
            <Field
              type="number"
              name="discAmount"
              v-model="discAmount"
              :disabled="typeVoucher == 2 ? true : false"
              :rules="typeVoucher == 2 ? '' : 'required'"
              class="form-control form-input form-control-solid border border-2 d-none"
            />
            <InputCurrency
              :value="typeVoucher == 2 ? '' : discAmount"
              :disabled="typeVoucher == 2 ? true : false"
              :class="{ 'border-danger': errors.discAmount }"
              @update:value="(newValue) => (discAmount = newValue)"
            />
            <p class="text-danger mt-2">{{ errors.discAmount }}</p>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Persentase Diskon</label>
            <div class="input-group">
              <Field
                type="number"
                name="discPercentage"
                v-model="discPercentage"
                :disabled="typeVoucher == 1 ? true : false"
                :rules="typeVoucher == 1 ? '' : 'required|minMax:1,100'"
                :class="{ 'border-danger': errors.discPercentage }"
                class="form-control form-input form-control-solid border border-2"
              />
              <span class="input-group-text">%</span>
            </div>
            <p class="text-danger mt-2">{{ errors.discPercentage }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <label class="form-label">Outlet</label>
            <Field
              as="select"
              name="outlet"
              rules="required"
              v-model="selectedOutlet"
              :class="{ 'border-danger': errors.outlet }"
              class="form-select form-input form-select-solid border border-2"
            >
              <option value="" disabled>Pilih Outlet</option>
              <option
                :value="item.id.toString()"
                :key="item.id"
                v-for="item in outletStore.activeOutlet"
              >
                {{ item.name }}
              </option>
            </Field>
            <p class="text-danger mt-2">{{ errors.outlet }}</p>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Maksimal Harga Diskon</label>
            <Field
              type="number"
              name="maxDiscountPrice"
              v-model="maxDiscountPrice"
              :disabled="typeVoucher == 1 ? true : false"
              :rules="typeVoucher == 1 ? '' : 'required'"
              class="form-control form-input form-control-solid border border-2 d-none"
            />
            <InputCurrency
              :value="typeVoucher == 1 ? '0' : maxDiscountPrice"
              :disabled="typeVoucher == 1 ? true : false"
              :class="{ 'border-danger': errors.maxDiscountPrice }"
              @update:value="(newValue) => (maxDiscountPrice = newValue)"
            />
            <p class="text-danger mt-2">{{ errors.maxDiscountPrice }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <label class="form-label">Kedaluwarsa</label>
            <Field
              type="date"
              name="expiredDate"
              v-model="expiredDate"
              class="form-control form-input form-control-solid border border-2"
            />
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
import { Form, Field } from "vee-validate";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOutletStore } from "@/stores/outlet";
import http from "@/http-common";

import InputCurrency from "@/components/InputCurrenty.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";

const voucherName = ref<string>("");
const typeVoucher = ref<number>(1);
const discAmount = ref<string>("");
const discPercentage = ref<string>("");
const temporaryDiscPercentage = ref<string>("");
const maxDiscountPrice = ref<string>("0");
const expiredDate = ref<string>("");
const selectedOutlet = ref<string>("");

const changeTypeVoucher = () => {
  if (typeVoucher.value == 1) {
    temporaryDiscPercentage.value = discPercentage.value;
    discPercentage.value = "";
  } else {
    discPercentage.value = temporaryDiscPercentage.value;
  }
};

const router = useRouter();
const loading = ref<boolean>(false);

const onSubmit = () => {
  const formData = new FormData();
  formData.append("name", voucherName.value);
  formData.append(
    "disc_amount",
    typeVoucher.value == 2 ? null : (discAmount.value as any)
  );
  formData.append(
    "disc_percentage",
    typeVoucher.value == 1 ? null : (discPercentage.value as any)
  );
  formData.append(
    "max_discount_price",
    typeVoucher.value == 1 ? null : (maxDiscountPrice.value as any)
  );
  formData.append("outlet_id", selectedOutlet.value);

  if (expiredDate.value) {
    formData.append("expired_date", expiredDate.value);
  }

  loading.value = true;
  http
    .post("/falcon/v1/voucher/california", formData)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Diskon berhasil ditambahkan!");
        router.push("/product/discount/list");
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
