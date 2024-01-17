<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <mks-sidebar @setTitle="setTitle"></mks-sidebar>
    <mks-drawer v-model:show="drawer" @setTitle="setTitle"></mks-drawer>
    <el-container>
      <el-header
        style="
          padding: 0;
          text-align: right;
          font-size: 12px;
          background-color: white;
          border-bottom: 1px solid #e6ecf5;
        "
      >
        <mks-header :title="title" @changeDrawer="changeDrawer"></mks-header>
      </el-header>
      <el-main class="p-5">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

import MksSidebar from "@/components/organism/MksSidebar.vue";
import MksDrawer from "@/components/organism/MksDrawer.vue";
import MksHeader from "@/components/organism/MksHeader.vue";

const title = ref<string>("");
const drawer = ref<boolean>(false);

const setTitle = (val: string) => {
  title.value = val;
};

const changeDrawer = () => {
  drawer.value = !drawer.value;
};

const authStore = useAuthStore();

onMounted(() => {
  authStore.getUserMe();
});
</script>
<script lang="ts">
export default {
  name: "AppDashboardLayout",
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 7.25em;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
