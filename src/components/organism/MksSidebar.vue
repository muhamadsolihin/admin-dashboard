<template>
  <el-aside class="sidebar d-none d-md-block" width="248px" height="100vh">
    <mks-menu @setTitle="setGroupTitle"></mks-menu>
  </el-aside>
</template>

<script lang="ts" setup>
import MksMenu from "./MksMenu.vue";

const emit = defineEmits(["setTitle"]);

const setGroupTitle = (val: string) => {
  emit("setTitle", val);
};
</script>

<style lang="scss" scoped>
.sidebar {
  min-height: 100vh;
  border-right: 1px solid #e6ecf5;
  margin: 0 10px;
}
</style>
