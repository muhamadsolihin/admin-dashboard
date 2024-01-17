<template>
  <div>
    <div class="d-flex justify-content-between">
      <input
        type="password"
        :value="modelValue1"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue1"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
        autofocus
      />
      <input
        type="password"
        :value="modelValue2"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue2"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
      />
      <input
        type="password"
        :value="modelValue3"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue3"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
      />
      <input
        type="password"
        :value="modelValue4"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue4"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
      />
      <input
        type="password"
        :value="modelValue5"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue5"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
      />
      <input
        type="password"
        :value="modelValue6"
        maxlength="1"
        @keyup.stop="nextFocusInputNumber"
        @input="handleModelValue6"
        :class="{
          'border-danger': errorStatus,
          'bg-danger-light': errorStatus,
        }"
        class="form-control border border-2 rounded-end pin__input"
      />
    </div>
    <!-- <p class="text-danger text-center mt-3" v-if="errorMessage.length > 0">
      {{ errorMessage }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: [
    "update:modelValue1",
    "update:modelValue2",
    "update:modelValue3",
    "update:modelValue4",
    "update:modelValue5",
    "update:modelValue6",
  ],
  props: {
    modelValue1: {
      type: String,
      require: true,
    },
    modelValue2: {
      type: String,
      require: true,
    },
    modelValue3: {
      type: String,
      require: true,
    },
    modelValue4: {
      type: String,
      require: true,
    },
    modelValue5: {
      type: String,
      require: true,
    },
    modelValue6: {
      type: String,
      require: true,
    },
    errorStatus: {
      type: String,
      require: false,
      default: "",
    },
  },
  setup(props, { emit }) {
    const nextFocusInputNumber = (event: any) => {
      if (event.key != "Backspace" && event.target.nextSibling != null) {
        event.target.nextSibling.focus();
      }

      if (event.key == "Backspace" && event.target.previousSibling != null) {
        event.target.value = "";
        event.target.previousSibling.focus();
      }
    };

    const handleModelValue1 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue1", _target.value);
    };

    const handleModelValue2 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue2", _target.value);
    };

    const handleModelValue3 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue3", _target.value);
    };

    const handleModelValue4 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue4", _target.value);
    };

    const handleModelValue5 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue5", _target.value);
    };

    const handleModelValue6 = (event: Event) => {
      const _target = event.target as HTMLInputElement;
      emit("update:modelValue6", _target.value);
    };

    return {
      nextFocusInputNumber,
      handleModelValue1,
      handleModelValue2,
      handleModelValue3,
      handleModelValue4,
      handleModelValue5,
      handleModelValue6,
    };
  },
});
</script>

<style lang="scss" scoped>
.pin__input {
  width: 50px;
  height: 50px;
  margin: 0 5px;
  text-align: center;
  font-size: 1.7rem;
}
</style>
