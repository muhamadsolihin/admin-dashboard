<template>
  <div class="toolbar px-5 d-flex flex-row align-items-center">
    <img
      class="me-3 pointer d-md-none"
      src="@/assets/images/icons/menu/hamburger.svg"
      alt="icon"
      @click="$emit('changeDrawer')"
    />
    <h1 class="me-auto mb-0 text-uppercase">{{ title }}</h1>
    <div class="ms-auto" v-if="authStore.loadingProfile">
      <el-skeleton animated>
        <template #template>
          <div class="d-flex flex-row align-items-center">
            <el-skeleton-item variant="circle" style="width: 25px; height: 25px" />
            <el-skeleton-item class="ms-2 d-none d-md-flex" variant="text" style="width: 150px" />
          </div>
        </template>
      </el-skeleton>
    </div>
    <el-dropdown v-if="!authStore.loadingProfile">
      <div class="d-flex flex-row align-items-center">
        <el-avatar class="dummy-avatar" v-if="!authStore.userProfile.image">{{
          userInitials
        }}</el-avatar>
        <el-avatar :src="authStore.userProfile.image" v-else />
        <span class="ms-2 fw-semibold d-none d-md-flex">{{ authStore.userProfile.outlet_owner_name }}</span>
        <img class="ms-2" src="@/assets/images/icons/chevron-down.svg" alt="icon" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$router.push('/balance/current')">
            <div class="d-flex flex-row align-items-center w-100 border-bottom py-2">
              <img src="@/assets/images/icons/money.svg" alt="icon" />
              <p class="mb-0 ms-2 fw-500">Rp {{ formatCurrency(authStore.userProfile.balance_xendit) }}</p>
            </div>
          </el-dropdown-item>
          <el-dropdown-item>Informasi Bisnis</el-dropdown-item>
          <el-dropdown-item>Informasi Akun</el-dropdown-item>
          <el-dropdown-item class="text-primary">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { formatCurrency } from "@/helper";

const props = defineProps({
  title: {
    type: String,
    require: true,
  },
});
const emit = defineEmits(["changeDrawer"]);

const authStore = useAuthStore();

const userInitials = computed(() => {
  const nameArr: string[] = authStore.userProfile.outlet_owner_name?.split(" ") || ['A', 'A']; // split name into an array of words
  let initials: string = "";
  for (let i = 0; i < 2; i++) {
    initials += nameArr[i][0].toUpperCase(); // append first letter of each word
  }
  return initials;
});
</script>

<style lang="scss" scoped>
.dummy-avatar {
  background-color: var(--el-color-primary);
}
</style>
