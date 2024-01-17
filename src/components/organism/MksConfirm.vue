<template>
  <el-dialog :width="width || dialogWidth">
    <div>
      <div
        class="d-flex flex-column align-items-center text-center justify-content-center px-2"
      >
        <p class="text-message">
          {{ message }}
        </p>
      </div>
      <div class="d-flex flex-wrap justify-content-center mt-5">
        <mks-button
          @click="$emit('cancel', true)"
          size="lg"
          type="button"
          :loading="loading"
          color="secondary"
        >
          Batal
        </mks-button>
        <mks-button
          @click="$emit('confirm', true)"
          class="ms-3"
          type="submit"
          size="lg"
          :loading="loading"
          color="primary"
          >Ya
        </mks-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MksButton from "@/components/atoms/MksButton.vue";

const props = defineProps({
  message: {
    type: String,
    require: true,
    prop : String,
  },
  loading: {
    type: Boolean,
    require: true,
    default: false,
  },
  width: {
    type: String,
    require: false,
  },
});

const screenWidth = computed(() => screen.width);
const dialogWidth = computed(() => (screenWidth.value > 768 ? "30%" : "80%"));
</script>

<style lang="scss" scoped>
.text-message {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  text-align: center;
  line-height: 30px;
  color: #000000;
}
</style>
