<template>
  <el-dialog v-model="showModal">
    <div class="mb-5">
      <h2
        class="mb-0 fs-15 fw-500 text-center"
        style="color: black; word-break: keep-all"
      >
        Pilih Metode Pengiriman OTP
      </h2>
    </div>
    <div class="d-flex justify-content-center align-items-center w-100">
      <div id="contentOptionMethod" class="d-flex justify-content-center p-4">
        <div
          v-if="phoneNumber"
          @click="selectMethodOTP(1)"
          class="card__otp w-100 d-flex align-items-center rounded border border-secondary p-4"
        >
          <i class="bi bi-whatsapp" style="font-size: 3rem"></i>
          <div class="d-flex flex-column">
            <p class="mb-0 ms-3 fs-13 fw-500 text__grey" style="word-break: keep-all">
              Whatsapp
            </p>
            <p class="mb-0 ms-3 fs-13 fw-500 text__grey">{{ phoneNumber }}</p>
          </div>
        </div>
        <div
          v-if="email.length > 0"
          @click="selectMethodOTP(3)"
          class="card__otp w-100 d-flex align-items-center rounded border border-secondary p-4"
        >
          <i class="bi bi-envelope" style="font-size: 3rem"></i>
          <div class="d-flex flex-column">
            <p class="mb-0 ms-3 fs-13 fw-500 text__grey" style="word-break: keep-all">
              Email
            </p>
            <p style="word-break: keep-all" class="mb-0 ms-3 fs-13 fw-500 text__grey">
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
watch(() => props.show, (val) => {console.log(props.phoneNumber);
})

const emit = defineEmits(["select", "update:show"]);

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
@import "@/assets/scss/main.scss";

.card__otp {
  cursor: pointer;
  transition: 1s;
}

.card__otp:hover {
  border: 1px solid $primary !important;
}

.card__otp:hover i,
.card__otp:hover p {
  color: $primary !important;
}

#contentOptionMethod {
  gap: 10px;
}
</style>
