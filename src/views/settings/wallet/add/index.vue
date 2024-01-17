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
                title="Tambah Akun E-Wallet"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae illo
            nisi harum facere dignissimos hic culpa non! Iusto sapiente vero
            voluptates,"
              ></mks-title>
            </div>
          </div>
          <div class="container">
            <Form @submit="onSubmit" v-slot="{ errors }" autocomplete="off">
              <div class="row" style="margin-top: 30px">
                <div class="col-md-6">
                  <label class="form-label">Nama E-Wallet</label>
                  <Field
                    type="text"
                    name="bankName"
                    v-model="bankName"
                    rules="required"
                    :class="{ 'border-danger': errors.bankName }"
                    class="form-input form-control form-control-solid border border-2"
                  />
                  <p class="text-danger mt-2">{{ errors.bankName }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label">No. Akun E-Wallet</label>
                  <Field
                    type="number"
                    name="numberCard"
                    rules="required"
                    v-model="numberCard"
                    :class="{ 'border-danger': errors.numberCard }"
                    class="form-input form-control form-control-solid border border-2"
                  />
                  <p class="text-danger mt-2">{{ errors.numberCard }}</p>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Toko</label>
                  <Field
                    as="select"
                    name="outlet"
                    rules="required"
                    v-model="selectedOutlet"
                    :class="{ 'border-danger': errors.outlet }"
                    class="form-input form-select form-select-solid border border-2"
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
                  <p class="text-danger mt-2">{{ errors.outlet }}</p>
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
  import { Form, Field } from "vee-validate";
  import {  ref, onMounted, computed } from "vue";
  import { getModule } from "vuex-module-decorators";
  import WalletModule from "@/store/modules/WalletModule";
  import OutletModule from "@/store/modules/OutletModule";
  import AuthModule from "@/store/modules/AuthModule";
  import MksTitle from "@/components/atoms/Mkstitle.vue";
  import MksButton from "@/components/atoms/MksButton.vue";
  import { useRouter } from "vue-router";
  import { ElNotification } from "element-plus";
  
  const bankName = ref<string | Blob>("");
  const numberCard = ref<string | Blob>("");
  const selectedOutlet = ref<string>("");
  const loading = ref<boolean>(false);
  
  const search = ref<string>("");
  const cursor = ref<string | null>("");
  const perPage = ref<number>(10);
  const router = useRouter();
  
  const AuthState = getModule(AuthModule);
  const DebitState = getModule(WalletModule);
  const OutletState = getModule(OutletModule);
  
  const myOutlets = computed(() =>
    OutletState.getOutlets.filter(
      (item) => item.id !== null && item.is_active != 0
    )
  );
  const myOutletId = computed(() => AuthState.getOutletId);
  
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("name", bankName.value);
    formData.append("number", numberCard.value);
    formData.append("outlet_id", selectedOutlet.value);
  
    loading.value = true;
    DebitState.addWallet(formData)
      .then((res) => {
        const response = res.data;
  
        if (response.status) {
          ElNotification({
            title: "Sukses",
            type: "success",
            duration: 2000,
            customClass: "successNotif",
            message: "E-Wallet berhasil ditambahkan!",
          });
          router.push(`/setting/wallet/list`)
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
        bankName.value = "";
        numberCard.value = "";
      });
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
  </script>
  
  <style lang="scss" scoped>
  * {
    font-family: Poppins !important;
  }
  </style>
  