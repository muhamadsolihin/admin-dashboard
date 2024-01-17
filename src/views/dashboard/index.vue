<template>
  <div class="d-flex flex-row justify-content-between w-50">
    <mks-button type="submit" color="primary">
      Submit
    </mks-button>
    <mks-button type="submit" color="success" size="lg">
      <div class="d-flex flex-row align-items-center">
        <span class="me-2">Tambah</span><img src="@/assets/images/icons/plus.svg" alt="icon">
      </div>
    </mks-button>
    <mks-button type="button" color="secondary" size="sm">
      Test
    </mks-button>
    <mks-button type="button" color="danger">
      Delete
    </mks-button>
  </div>
  <div class="mt-5">    
  <mks-badge color="primary">Primary</mks-badge>
  <mks-badge color="secondary">Secondary</mks-badge>
  <mks-badge color="success">Success</mks-badge>
  <mks-badge color="danger">Tidak aktif</mks-badge>
  <mks-badge color="warning">Warning</mks-badge>
  <mks-badge color="info">Info</mks-badge>
  <mks-badge color="light">Light</mks-badge>
  </div>
</template>

<script setup lang="ts">
import MksButton from '@/components/atoms/MksButton.vue'
import MksBadge from '@/components/atoms/MksBadge.vue'
</script>

<style lang="scss" scoped>
</style>
