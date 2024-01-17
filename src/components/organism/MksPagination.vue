<template>
  <div class="d-flex justify-content-end mt-3">
    <mks-button
      size="sm"
      color="secondary"
      :disabled="disablePrev"
      @click="$emit('prev', true)"
    >
      SEBELUMNYA
    </mks-button>
    <mks-button
      size="sm"
      color="secondary"
      class="ms-3"
      :disabled="disableNext"
      @click="$emit('next', true)"
    >
      SELANJUTNYA
    </mks-button>
  </div>
</template>

<script setup lang="ts">
import MksButton from "@/components/atoms/MksButton.vue";

const props = defineProps({
  disableNext: {
    type: Boolean,
    require: false,
    default: false,
  },
  disablePrev: {
    type: Boolean,
    require: false,
    default: false,
  },
});
const emits = defineEmits(["prev", "next"]);
</script>
