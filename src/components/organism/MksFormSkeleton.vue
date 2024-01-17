<template>
  <el-skeleton animated>
    <template #template>
      <div class="row g-3 mt-4">
        <div class="col-6 py-2" v-for="num in totalField" :key="num">
          <el-skeleton-item class="mb-1" variant="text" style="width: 30%" />
          <el-skeleton-item variant="rect" style="width: 100%; height: 35px" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script lang="ts" setup>
const props = defineProps({
  totalField: {
    type: Number,
    require: false,
    default: 5,
  },
});
</script>
