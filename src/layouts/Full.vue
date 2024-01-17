<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "AppCleanLayout",
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
}
</style>
