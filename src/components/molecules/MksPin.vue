<template>
  <div ref="otpCont" class="d-flex flex-row">
    <input
      :type="inputType"
      v-model="digits[ind]"
      class="form-control border border-2 rounded-end pin__input"
      :class="{bounce: digits[ind] !== null}"
      v-for="(el, ind) in digits"
      :key="el+ind"
      :autofocus="ind === 0"
      maxlength="1"
      @keydown="handleKeyDown($event, ind)"
    >
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  const props = defineProps({
    default: String,

    digitCount: {
      type: Number,
      required: true,
    },
    inputType: {
      type: String,
      required: false,
      default: 'password'
    }
  });

  const digits: any[] = reactive([])

  if (props.default && props.default.length === props.digitCount) {
    for (let i =0; i < props.digitCount; i++) {
      digits[i] = props.default.charAt(i)
    }
  } else {
    for (let i =0; i < props.digitCount; i++) {
      digits[i] = null;
    }
  }

  const otpCont = ref<any>(null)

  const handleKeyDown = (event: any, index: number) => {
    if (event.key !== "Tab" && 
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
    ) {
      event.preventDefault();
    }
    
    if (event.key === "Backspace") {
      digits[index] = null;
      
      if (index != 0) {
        (otpCont.value.children)[index-1].focus();
      } 

      return;
    }

    if ((new RegExp('^([0-9])$')).test(event.key)) {
      digits[index] = event.key;

      if (index != props.digitCount - 1) {
        (otpCont.value.children)[index+1].focus();
      }
    }

    if (isDigitsFull()) {
      emit('update:pin', digits.join(''))
    }
  }

  const emit = defineEmits(['update:pin']);
  const isDigitsFull = function () {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }
  }

  return true;
}
</script>

<style lang="scss" scoped>
.pin__input {
  width: 50px;
  height: 50px;
  margin: 0 5px;
  text-align: center;
  font-size: 1.7rem;
}

.bounce {
  animation: pulse .3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>
