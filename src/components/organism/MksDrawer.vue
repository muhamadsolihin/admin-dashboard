<template>
  <el-drawer v-model="drawer" :with-header="false" direction="ltr" size="70%">
    <mks-menu @setTitle="setGroupTitle" @childClicked="menuClicked"></mks-menu>
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import MksMenu from "./MksMenu.vue";

const emit = defineEmits(["setTitle", "update:show"]);
const props = defineProps({
  show: {
    type: Boolean,
    require: true,
  },
});
const drawer = computed({
  get: () => props.show,
  set: (val) => {
    emit("update:show", val);
  },
});

const setGroupTitle = (val: string) => {
  emit("setTitle", val);
};

const menuClicked = (val: boolean) => {
  drawer.value = false;
};
</script>
