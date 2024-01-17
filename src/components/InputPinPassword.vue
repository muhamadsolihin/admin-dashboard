<template>
    <div class="input__wrapper">
      <input
        :type="showPin ? 'text' : 'password'"
        :value="value"
        @input="updateValue"
        :class="{ 'border-danger': error }"
        class="form-input form-control form-control-solid border border-2 w-100"
      />
      <i
        v-if="!showPin"
        class="bi bi-eye eye__icon"
        :class="{ 'text-danger': error }"
        style="font-size: 2rem"
        @click="show"
      ></i>
      <i
        class="bi bi-eye-slash eye__slash_icon"
        :class="{ 'text-danger': error }"
        style="font-size: 2rem"
        @click="hide"
        v-else
      ></i>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    emits: ["update:value"],
    props: {
      value: {
        type: String,
        require: true,
      },
      error: {
        type: String,
        require: false,
        default: "",
      },
    },
    setup(props, { emit }) {
      const showPin = ref<boolean>(false);
      const _target = document.querySelector("input") as HTMLInputElement;
  
      const show = () => {
        showPin.value = true;
        _target.setAttribute("text", "text");
      };
  
      const hide = () => {
        showPin.value = false;
        _target.setAttribute("text", "password");
      };
  
      const updateValue = (event: Event) => {
        emit("update:value", (event.target as HTMLInputElement).value);
      };
  
      return { showPin, show, hide, updateValue };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .input__wrapper {
    position: relative;
  }
  
  i {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  </style>
  