<template>
  <div class="wrapper" @mouseleave="clearColor">
    <i
      :data-id="`${uniqueDataId}1`"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      @click="getValueOfStar"
      :style="{ fontSize: `${size}em`, cursor: 'pointer' }"
      :class="[`${value >= 1 ? 'active' : ''}`, 'bi bi-star-fill']"
    ></i>
    <i
      :data-id="`${uniqueDataId}2`"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      @click="getValueOfStar"
      :style="{ fontSize: `${size}em`, cursor: 'pointer' }"
      :class="[`${value >= 2 ? 'active' : ''}`, 'bi bi-star-fill']"
    ></i>
    <i
      :data-id="`${uniqueDataId}3`"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      @click="getValueOfStar"
      :style="{ fontSize: `${size}em`, cursor: 'pointer' }"
      :class="[`${value >= 3 ? 'active' : ''}`, 'bi bi-star-fill']"
    ></i>
    <i
      :data-id="`${uniqueDataId}4`"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      @click="getValueOfStar"
      :style="{ fontSize: `${size}em`, cursor: 'pointer' }"
      :class="[`${value >= 4 ? 'active' : ''}`, 'bi bi-star-fill']"
    ></i>
    <i
      :data-id="`${uniqueDataId}5`"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      @click="getValueOfStar"
      :style="{ fontSize: `${size}em`, cursor: 'pointer' }"
      :class="[`${value >= 5 ? 'active' : ''}`, 'bi bi-star-fill']"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, watch } from "vue";

const emit = defineEmits(["handle-click"]);
const props = defineProps({
  size: {
    type: String,
    required: false,
    default: "1",
  },
  value: {
    type: Number,
    required: false,
    default: 0,
  },
  hover: {
    type: Boolean,
    required: false,
    default: false,
  },
  uniqueDataId: {
    type: Number,
    required: false,
    default: 0,
  },
});

watch(
  () => props.value,
  (newVal) => newVal
);

const getValueOfStar = (event: Event) => {
  const _target = event.target as HTMLElement;
  const dataId = _target.getAttribute("data-id");
  emit("handle-click", dataId);
};

const handleMouseover = (event: Event) => {
  if (props.hover) {
    const _target = event.target as HTMLElement;
    const el = document.querySelectorAll(".bi-star-fill");
    const dataId = _target.getAttribute("data-id");
    const arrayUniqueIdStar = [
      `${props.uniqueDataId}1`,
      `${props.uniqueDataId}2`,
      `${props.uniqueDataId}3`,
      `${props.uniqueDataId}4`,
      `${props.uniqueDataId}5`,
    ];

    for (let index = 0; index < el.length; index++) {
      const availableDataId = (el[index] as HTMLElement).getAttribute(
        "data-id"
      );

      if (arrayUniqueIdStar.includes(`${availableDataId}`)) {
        if (dataId && availableDataId) {
          if (parseInt(availableDataId) <= parseInt(dataId)) {
            (el[index] as HTMLElement).classList.add("active");
          } else {
            (el[index] as HTMLElement).classList.remove("active");
          }
        }
      }
    }
  }
};

const handleMouseleave = (event: Event) => {
  if (window.innerWidth < 768) {
    clearColor();
  }

  if (props.hover) {
    const _target = event.target as HTMLElement;
    _target.classList.remove("active");
  }

  if (props.hover && props.value) {
    const el = document.querySelectorAll(".bi-star-fill");
    const arrayUniqueIdStar = [
      `${props.uniqueDataId}1`,
      `${props.uniqueDataId}2`,
      `${props.uniqueDataId}3`,
      `${props.uniqueDataId}4`,
      `${props.uniqueDataId}5`,
    ];

    for (let index = 0; index < el.length; index++) {
      const dataId = (el[index] as HTMLElement).getAttribute("data-id");

      if (dataId && arrayUniqueIdStar.includes(`${dataId}`)) {
        const numberDataId = new Number(
          props.uniqueDataId + parseInt(dataId.slice(dataId.length - 1))
        );
        const numberRatingValue = new Number(props.uniqueDataId + props.value);
        if (numberDataId <= numberRatingValue) {
          (el[index] as HTMLElement).classList.add("active");
        } else {
          (el[index] as HTMLElement).classList.remove("active");
        }
      }
    }
  }
};

const clearColor = () => {
  if (props.hover && !props.value) {
    const el = document.querySelectorAll(".bi-star-fill");
    const arrayUniqueIdStar = [
      `${props.uniqueDataId}1`,
      `${props.uniqueDataId}2`,
      `${props.uniqueDataId}3`,
      `${props.uniqueDataId}4`,
      `${props.uniqueDataId}5`,
    ];

    for (let index = 0; index < el.length; index++) {
      const dataId = (el[index] as HTMLElement).getAttribute("data-id");
      if (arrayUniqueIdStar.includes(`${dataId}`)) {
        (el[index] as HTMLElement).classList.remove("active");
      }
    }
  }
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  flex-direction: row;
  width: 140px;
  gap: 3px;
}

.bi-star-fill {
  color: #adafb1;
}

.bi-star-fill.active {
  color: #ffdc4a;
}
</style>
