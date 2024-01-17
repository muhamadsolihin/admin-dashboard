<template>
  <div class="position-relative">
    <input
      :id="id"
      type="text"
      @blur="blur"
      ref="inputSelect"
      @input="searchData"
      :class="[
        `${error ? 'border-danger' : ''}`,
        'form-input form-control border border-2',
      ]"
      :placeholder="placeholder"
    />

    <!-- begin::helper for dropdown -->
    <div
      class="btn__close"
      @click="clearDropdown"
      v-if="showCloseIcon && !isLoading"
    >
      <i class="bi bi-x-lg"></i>
    </div>

    <div class="spinner__dropdown" v-if="isLoading">
      <span
        class="spinner-border spinner-border-sm text-primary"
        role="status"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Loading...</span>
    </div>

    <div
      class="rounded bg-white dropdown__cust shadow"
      :style="{ opacity: dropdown ? 5 : 0 }"
      v-if="dropdown"
    >
      <div class="d-flex flex-column">
        <div
          class="list"
          @click="selectValue"
          :data-id="(item as any).id"
          :data-name="(item as any).name"
          v-for="(item, index) in data"
          :key="index"
        >
          {{ (item as any).name }}
        </div>
      </div>
    </div>
    <!-- end::helper for dropdown -->
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect } from "vue";

const emit = defineEmits(["update:value", "selected", "search-data", "clear"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "",
  },
  value: {
    type: String,
    required: false,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  items: {
    type: Array,
    required: true,
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const data = ref<any>([]);
const dropdown = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const showCloseIcon = ref<boolean>(false);
const inputSelect = ref<HTMLInputElement | null>();

watchEffect(() => {
  data.value = props.items;

  if (props.value) {
    showCloseIcon.value = true;
    const input = inputSelect.value;
    if (input) input.value = props.value;
  }

  if (data.value.length) {
    dropdown.value = true;
  } else {
    dropdown.value = false;
  }
});

const searchData = () => {
  const valueInput = inputSelect.value?.value;
  if (valueInput?.trim().length) showCloseIcon.value = true;
  else showCloseIcon.value = false;
  emit("update:value", valueInput);
  emit("search-data", valueInput);
};

const selectValue = (event: Event) => {
  const _target = event.target as HTMLDivElement;
  const newVal = {
    id: _target.getAttributeNode("data-id")?.value,
    name: _target.getAttributeNode("data-name")?.value,
  };
  emit("selected", newVal);
  dropdown.value = false;
  inputSelect.value!.value = newVal.name as string;
};

const blur = () => {
  setTimeout(() => {
    dropdown.value = false;
  }, 200);
};

const clearDropdown = () => {
  inputSelect.value!.value = "";
  dropdown.value = false;
  data.value = props.items;
  inputSelect.value?.focus();
  showCloseIcon.value = false;
  emit("clear", "");
  emit("update:value", "");
};
</script>

<style lang="scss" scoped>
.btn__close {
  position: absolute;
  top: 0;
  z-index: 10;
  right: 11px;
  margin-top: 15px;
  cursor: pointer;
}

.spinner__dropdown {
  position: absolute;
  top: 0;
  z-index: 10;
  right: 24px;
  margin-top: 10px;
}

.dropdown__cust {
  position: absolute;
  top: 0;
  margin: 50px 0;
  z-index: 10;
  padding: 10px 0;
  width: 96%;
  max-height: 300px;
  opacity: 0;
  overflow-y: auto;
  transition: all ease-in-out 0.2ms;

  .list {
    padding: 10px 20px;
  }

  .list:hover {
    background-color: #ffb1b8;
    color: white !important;
    cursor: pointer;
  }
}
</style>
