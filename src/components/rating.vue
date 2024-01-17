<template>
  <div class="wrapper__rating" @mouseleave="clearColor">
    <i v-if="star == 1">
        <img value="1" src="@/assets/images/icons/icon-star.svg"/>
        </i>
    <!-- <img src="@/assets/images/icons/icon-star.svg"
      data-id="1"
      :class="[`${value >= 1 ? 'active' : ''}`, 'bi bi-star-fill']"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      :style="{ fontSize: `${size}em` }"
    />
    <img src="@/assets/images/icons/icon-star.svg"
      data-id="2"
      :class="[`${value >= 2 ? 'active' : ''}`, 'text-primary']"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      :style="{ fontSize: `${size}em` }"
    />
    <i
      data-id="3"
      :class="[`${value >= 3 ? 'active' : ''}`, 'bi bi-star-fill']"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      :style="{ fontSize: `${size}em` }"
    ></i>
    <i
      data-id="4"
      :class="[`${value >= 4 ? 'active' : ''}`, 'bi bi-star-fill']"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      :style="{ fontSize: `${size}em` }"
    ></i>
    <i
      data-id="5"
      :class="[`${value >= 5 ? 'active' : ''}`, 'bi bi-star-fill']"
      @mouseover="handleMouseover"
      @mouseleave="handleMouseleave"
      :style="{ fontSize: `${size}em` }"
    ></i> -->
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, watch } from 'vue';

const props = defineProps({
  size: {
    type: String,
    required: false,
    default: '1',
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
});

const handleMouseover = (event: Event) => {
  if (props.hover) {
    const _target = event.target as HTMLElement;
    const el = document.querySelectorAll('.bi-star-fill');
    const dataId = _target.getAttribute('data-id');

    for (let index = 0; index < el.length; index++) {
      const availableDataId = (el[index] as HTMLElement).getAttribute(
        'data-id'
      );
      if (dataId && availableDataId) {
        (el[index] as HTMLElement).style.color = '#FFDC4A';
        if (parseInt(availableDataId) > parseInt(dataId)) {
          (el[index] as HTMLElement).style.color = '#adafb1';
          break;
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
    _target.style.color = '#adafb1';
  }
};

const clearColor = () => {
  if (props.hover) {
    const el = document.querySelectorAll('.bi-star-fill');

    for (let index = 0; index < el.length; index++) {
      (el[index] as HTMLElement).style.color = '#adafb1';
    }
  }
};

</script>

<style lang="scss">
.wrapper__rating {
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
