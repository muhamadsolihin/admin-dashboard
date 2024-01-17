<template>
    <el-dialog v-model="showModal" width="335px">
      <div class="d-flex flex-column">
        <h3 class="text-primary mb-0 text-center" style="line-height: 25px">
          Selamat Datang<br />di Makasi POS
        </h3>
        <img
          src="@/assets/images/illustration/fill_identity.png"
          alt="illustration cs"
          style="width: 85%; margin: 10px auto"
        />
        <p class="mb-0 text-center mx-3" style="word-break: break-word;">
          Lengkapi data diri Anda untuk nikmati fitur pesanan online, pembayaran
          QRIS, catat transaksi tanpa batas dan keuntungan lainnya.
        </p>
        
        <button type="button" class="btn btn-sm btn-primary mt-4" @click="$router.push('/my-profile/personal-information')">
          Lengkapi Identitas Anda
        </button>
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
  