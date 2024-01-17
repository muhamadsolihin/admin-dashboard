<template>
  <div class="d-flex flex-column title-subtitle">
    <p class="text-header">
      {{ title }}
    </p>
    <p class="subtitle w-100">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    require: true,
  },
  subtitle: {
    type: String,
    require: false,
  },
});
</script>

<style lang="scss" scoped>
.text-header {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;

  line-height: 30px;
  color: #0f0f0f;
}

.subtitle {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  margin-top: -1em;
  line-height: 21px;
  color: #878d9f;
}
</style>
