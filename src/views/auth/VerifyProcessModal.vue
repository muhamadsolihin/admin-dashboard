<template>
    <el-dialog v-model="showModal" width="335px">
      <div class="d-flex flex-column">
        <h3 class="text-primary mb-0 text-center" style="line-height: 25px">
          Data diri sedang diverifikasi
        </h3>
        <img
          src="@/assets/images/illustration/verif_process.png"
          alt="illustration verif"
          style="width: 85%; margin: 10px auto"
        />
        <p class="mb-0 text-center mx-3" style="word-break: break-word;">
          Data diri Anda sedang diverifikasi. Kami akan memberitahukan hasilnya segera.
        </p>
      </div>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      require: true,
    },
  });
  const emit = defineEmits(['update:show']);
  
  const showModal = computed({
    get: () => {
      return props.show;
    },
    set: () => {
      emit('update:show', false);
    },
  });
  </script>
  