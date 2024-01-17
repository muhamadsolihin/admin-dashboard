<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 100vh; background-color: #f1f5ff; padding: 0 10%"
  >
    <div class="wrapper d-flex flex-column align-items-center m-0">
      <div class="d-flex w-100" style="margin: 60px">
        <div
          class="flex-grow-1 d-flex flex-column justify-content-center align-items-center"
          v-for="item in 3"
          :key="item"
        >
          <div class="progress__stepper" :class="{ success: step > item }">
            <div class="line__stepper"></div>
          </div>
          <div
            class="point__stepper d-flex flex-column align-items-center justify-content-center"
            :class="{ success: step > item }"
          >
            <h1 class="number fw-bold mb-0">{{ item }}</h1>
            <i style="font-size: 50px" class="icon__check text-white bi bi-check"></i>
          </div>
        </div>
      </div>
      <confirmation-code @next="nextStep" v-if="step == 1"></confirmation-code>
      <setting-pin @next="nextStep" v-if="step == 2"></setting-pin>
      <confirmation-pin v-if="step == 3"></confirmation-pin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

import SettingPin from "./components/SettingPin.vue";
import ConfirmationCode from "./components/ConfirmationCode.vue";
import ConfirmationPin from "./components/ConfirmationPin.vue";

const step = ref<number>(1);
const nextStep = () => {
  step.value += 1;
};

const authStore = useAuthStore();
const router = useRouter();
onMounted(() => {
  if (!authStore.phone && !authStore.email) {
    router.push("/registration");
  }
});
</script>

<style lang="scss" scoped>
$default: #c5c5c5;
$green-1: #75cc65;
$primary: #e60023;
$transition: all 500ms ease;

.progress__stepper {
  height: 10px;
  width: 100%;
  background-color: $default;
}

.line__stepper {
  width: 0%;
  height: 10px;
  background-color: $default;
  transition: $transition;
}

.point__stepper {
  width: 47px;
  height: 47px;
  border-radius: 100px;
  background-color: white;
  text-align: center;
  color: $default;
  border: 2px solid $default;
  position: absolute;

  .icon__check {
    position: absolute;
    opacity: 0;
    transform: scale(0);
    width: 50px;
    transition: $transition;
  }

  .number {
    transition: $transition;
  }
}

.progress__stepper.success {
  .line__stepper {
    width: 100%;
    background-color: $primary;
  }
}

.point__stepper.success {
  background-color: $primary;
  border-color: $primary;

  .icon__check {
    opacity: 1;
    transform: scale(1);
  }

  .number {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
