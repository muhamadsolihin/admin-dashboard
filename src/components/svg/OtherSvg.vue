<template>
  <svg
    width="18"
    height="4"
    viewBox="0 0 18 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 2.00008C4 3.10457 3.10457 4.00008 2 4.00008C0.895426 4.00008 0 3.10457 0 2.00008C0 0.89559 0.895426 8.2016e-05 2 8.2016e-05C3.10457 8.2016e-05 4 0.89559 4 2.00008Z"
      :fill="color"
    />
    <path
      d="M11 2.00008C11 3.10457 10.1046 4.00008 9 4.00008C7.89543 4.00008 7 3.10457 7 2.00008C7 0.89559 7.89543 8.2016e-05 9 8.2016e-05C10.1046 8.2016e-05 11 0.89559 11 2.00008Z"
      :fill="color"
    />
    <path
      d="M16 4C17.1046 4 18 3.10449 18 2C18 0.895508 17.1046 0 16 0C14.8954 0 14 0.895508 14 2C14 3.10449 14.8954 4 16 4Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      require: false,
      default: "#E60023",
    },
  },
  setup() {
    //
  },
});
</script>
