<template>
  <div
    :class="`d-inline-flex flex-row align-items-center badge rounded-pill text-bg-${color}`"
  >
    <span><slot></slot></span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    require: true,
    default: 'primary'
  }
})
</script>
