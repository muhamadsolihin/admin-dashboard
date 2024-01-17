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
            title="Edit Diskon"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          ></mks-title>
        </div>
      </div>

      <mks-form-skeleton :total-field="7" v-if="loadingDetail"></mks-form-skeleton>
      <Form
        @submit="onSubmit"
        v-slot="{ errors }"
        autocomplete="off"
        v-if="!loadingDetail"
      >
        <div class="row" style="margin-top: 30px">
          <div class="col-12 col-md-6">
            <label class="form-label">Nama Diskon</label>
            <Field
              type="text"
              rules="required"
              name="discountName"
              v-model="discountName"
              :class="{ 'border-danger': errors.discountName }"
              class="form-control form-input form-control-solid border border-2"
            />
            <p class="text-danger mt-2">{{ errors.discountName }}</p>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Tipe Diskon</label>
            <Field
              as="select"
              name="discountType"
              v-model="discountType"
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
              name="discountAmount"
              v-model="discountAmount"
              :disabled="discountType == 2 ? true : false"
              :rules="discountType == 2 ? '' : 'required'"
              class="form-control form-input form-control-solid border border-2 d-none"
            />
            <InputCurrency
              :value="discountType == 2 ? '' : discountAmount"
              :disabled="discountType == 2 ? true : false"
              :class="{ 'border-danger': errors.discountAmount }"
              @update:value="(newValue) => (discountAmount = newValue)"
            />
            <p class="text-danger mt-2">{{ errors.discountAmount }}</p>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Persentase Diskon</label>
            <div class="input-group">
              <Field
                type="number"
                name="discountPercentage"
                v-model="discountPercentage"
                :disabled="discountType == 1 ? true : false"
                :rules="discountType == 1 ? '' : 'required|minMax:1,100'"
                :class="{ 'border-danger': errors.discountPercentage }"
                class="form-control form-input form-control-solid border border-2"
              />
              <span class="input-group-text">%</span>
            </div>
            <p class="text-danger mt-2">{{ errors.discountPercentage }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <label class="form-label">Toko</label>
            <Field
              as="select"
              name="outlet"
              rules="required"
              v-model="selectedOutlet"
              :class="{ 'border-danger': errors.outlet }"
              class="form-select form-input form-select-solid border border-2"
            >
              <option value="" disabled>Pilih Toko</option>
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
              :disabled="discountType == 1 ? true : false"
              :rules="discountType == 1 ? '' : 'required'"
              class="form-control form-input form-control-solid border border-2 d-none"
            />
            <InputCurrency
              :value="discountType == 1 ? '0' : maxDiscountPrice"
              :disabled="discountType == 1 ? true : false"
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
import { ref, onMounted } from "vue";
import { Form, Field } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import { formatDate, convertEpochToDate } from "@/helper";
import { useOutletStore } from "@/stores/outlet";
import { showErrorNotif, showSuccessNotif } from "@/helper/notification";
import http from "@/http-common";

import MksFormSkeleton from "@/components/organism/MksFormSkeleton.vue";
import InputCurrency from "@/components/InputCurrenty.vue";
import MksTitle from "@/components/atoms/MksTitle.vue";
import MksButton from "@/components/atoms/MksButton.vue";

const discountName = ref<string>("");
const discountType = ref<number>(1);
const discountAmount = ref<string>("");
const discountPercentage = ref<string>("");
const temporaryDiscPercentage = ref<string>("");
const maxDiscountPrice = ref<string>("0");
const expiredDate = ref<string>("");
const selectedOutlet = ref<string>("");
const discountUuid = ref<string>("");

const changeTypeVoucher = () => {
  if (discountType.value == 1) {
    temporaryDiscPercentage.value = discountPercentage.value;
    discountPercentage.value = "";
  } else {
    discountPercentage.value = temporaryDiscPercentage.value;
  }
};

const loading = ref<boolean>(false);
const router = useRouter();

const onSubmit = () => {
  loading.value = true;

  const formData = new FormData();
  formData.append("name", discountName.value);
  formData.append("disc_amount", discountType.value == 2 ? "" : discountAmount.value);
  formData.append(
    "disc_percentage",
    discountType.value == 1 ? "" : discountPercentage.value
  );
  formData.append(
    "max_discount_price",
    discountType.value == 1 ? "" : maxDiscountPrice.value
  );
  formData.append("outlet_id", selectedOutlet.value);
  formData.append("_method", "PUT");
  if (expiredDate.value) {
    formData.append("expired_date", expiredDate.value);
  }

  http
    .post(`/falcon/v1/voucher/oklahoma/${discountUuid.value}`, formData)
    .then((response) => {
      const res = response.data;
      if (res.status) {
        showSuccessNotif("Diskon berhasil diubah");
        router.push("/product/discount/list");
      } else {
        showErrorNotif(res.error[0].text);
      }
    })
    .catch(() => {
      showErrorNotif("Terjadi kesalahan server");
    })
    .finally(() => (loading.value = false));
};

const route = useRoute();
const outletStore = useOutletStore();
const loadingDetail = ref<boolean>(false);

onMounted(async () => {
  loadingDetail.value = true;
  outletStore.outlets = [];
  await outletStore.getOutlets({
    search: "",
    cursor: "",
    perPage: "100",
  });

  http
    .get(`/falcon/v1/voucher/hawaii/${route.params.uuid}?outlet_id=${route.params.uuid}`)
    .then((result) => {
      const res = result.data;
      if (res.status) {
        discountUuid.value = res.data.uuid;
        discountName.value = res.data.name;
        discountAmount.value = res.data.disc_amount.toString();
        discountType.value = res.data.disc_amount ? 1 : 2;
        discountPercentage.value = res.data.disc_percentage.toString();
        maxDiscountPrice.value = res.data.max_discount_price.toString();
        selectedOutlet.value = res.data.outlet_id.toString();

        if (res.data.expired_date) {
          expiredDate.value = formatDate(
            convertEpochToDate(res.data.expired_date),
            "YYYY-MM-DD"
          );
        }
      }
    })
    .finally(() => {
      loadingDetail.value = false;
    });
});
</script>
