<template>
  <div class="input-group form-control form-control-filter">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as any).value)"
      class="form-control form-control-sm ms-auto"
      :placeholder="placeholder"
      @keyup.enter="onEnter"
    />
    <span
      class="d-flex align-items-center mx-2 pointer"
      v-if="modelValue.trim().length"
      @click="onClear"
    >
      <img src="@/assets/images/icons/close-1.svg" />
    </span>
    <span class="d-flex align-items-center"
      ><img src="@/assets/images/icons/search.svg" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["update:modelValue", "enter", "clear"]);
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: "Cari...",
  },
});

const onEnter = () => {
  emit("enter");
};

const onClear = () => {
  emit("clear");
};
</script>
