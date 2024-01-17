<template>
  <el-dialog
    :title="'Pilih Metode Pengiriman OTP'"
    v-model="showModal"
    :width="screenWidth > 768 ? '30%' : '90%'"
  >
    <div class="row g-3">
      <div class="col-12" v-if="phoneNumber">
        <div
          @click="selectMethodOTP(1)"
          class="card d-flex flex-row align-items-center p-3 pointer"
        >
          <i class="bi bi-whatsapp text-primary" style="font-size: 2rem"></i>
          <div class="d-flex flex-column ms-3">
            <p class="mb-0 fw-500" style="word-break: keep-all">Whatsapp</p>
            <p class="mb-0 fw-500">{{ phoneNumber }}</p>
          </div>
        </div>
      </div>
      <div class="col-12" v-if="email">
        <div
          @click="selectMethodOTP(3)"
          class="card d-flex flex-row align-items-center p-3 pointer"
        >
          <i class="bi bi-envelope text-primary" style="font-size: 2rem"></i>
          <div class="d-flex flex-column ms-3">
            <p class="mb-0 fw-500" style="word-break: keep-all">Email</p>
            <p style="word-break: keep-all" class="mb-0 fw-500">
              {{ email }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: false,
    default: "",
  },
  email: {
    type: String,
    require: false,
    default: "",
  },
});
watch(
  () => props.show,
  (val) => {
    console.log(props.phoneNumber);
  }
);

const emit = defineEmits(["select", "update:show"]);
const screenWidth = computed(() => screen.width);

const selectMethodOTP = (value: number) => {
  emit("select", value);
};
const showModal = computed({
  get: () => {
    return props.show;
  },
  set: () => {
    emit("update:show", false);
  },
});
</script>

<style lang="scss" scoped>
#contentOptionMethod {
  gap: 10px;
}
</style>
