<template>
  <button
    :class="`btn btn-${color} ${size != '' ? 'btn-' + size : ''}`"
    :disabled="disabled || loading"
  >
    <slot v-if="!loading"></slot>
    <div class="d-flex flex-row align-items-center" v-else>
      <img class="ms-auto" src="@/assets/images/icons/loading2.svg" alt="icon" style="width: 30px" />
      <p class="mb-0 me-auto">Proses...</p>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    require: false,
    default: "primary",
  },
  size: {
    type: String,
    require: false,
  },
  loading: {
    type: Boolean,
    require: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    require: false,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.btn {
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
}
</style>
