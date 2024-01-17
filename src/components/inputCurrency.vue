<template>
    <input
      type="text"
      :name="name"
      autocomplete="off"
      v-model="formatCurrency"
      @blur="inputBlurred"
      @focus="isInputActive = true"
      class=" form-input form-control form-control-solid bg-transparent "
      style="border: none !important"
      :class="{
        'text-start': isInputActive,
        'text-end': !isInputActive,
      }"
      :disabled="disabled"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  // import { Field } from "vee-validate";
  
  export default defineComponent({
    emits: ["update:value", "blur"],
    props: {
      name: {
        type: String,
        require: false,
        default: "price",
      },
      value: {
        type: String,
        require: true,
      },
      disabled: {
        type: Boolean,
        require: false,
        default: false,
      },
    },
    components: {},
    setup(props, { emit }) {
      const isInputActive = ref<boolean>(false);
      const writerProps = ref(props.value);
  
      const formatCurrency = computed({
        get: () => {
          if (isInputActive.value) {
            return props.value;
          } else {
            /* eslint-disable */
            // console.log(
            //   "get",
            //   props.value?.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")
            // );
            return (
              "Rp " +
              props.value?.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.")
            );
          }
        },
  
        set: (value) => {
          value = value?.replace(/[^\d\.]/g, "");
          let newValue = parseFloat(value as any);
          if (isNaN(newValue)) {
            newValue = 0;
          }
          writerProps.value = newValue.toString();
          emit("update:value", newValue.toString());
        },
      });
  
      const inputBlurred = () => {
        isInputActive.value = false;
        emit("blur");
      };
  
      return { isInputActive, formatCurrency, inputBlurred };
    },
  });
  </script>

<style lang="scss" scoped>
.form-input{
  font-size: 1.5rem;
}
.form-control:focus{
  border: none !important;
  border-color: transparent;
}
@media screen and (max-width: 768px){
  .form-input{
    font-size: 1em;
  }
}
</style>
  