<template>
  <el-dialog :width="dialogWidth" title="Lampiran" @close="closeDialog">
    <div class="w-100 d-flex flex-column">
      <div class="on-review rounded">
        <img
          class="rounded"
          v-if="
            selectedReview.onReview.includes('.jpg') ||
            selectedReview.onReview.includes('.jpeg') ||
            selectedReview.onReview.includes('.png')
          "
          :src="selectedReview.onReview"
          style="height: 100%"
          loading="lazy"
        />
        <video
          v-else
          autoplay
          controls
          onload="none"
          class="rounded"
          ref="videoPlay"
          style="width: 100%; height: 100%; object-fit: cover"
          controlslist="nofullscreen nodownload noremoteplayback noplaybackrate foobar"
        >
          <source :src="selectedReview.onReview" />
        </video>
      </div>
      <div class="items-review">
        <template :key="index" v-for="(item, index) in selectedReview.files">
          <img
            :src="item.url"
            loading="lazy"
            style="width: 50px; height: 50px"
            @click="selectOnReview(item.url)"
            v-if="
              item.url.includes('.jpg') ||
              item.url.includes('.jpeg') ||
              item.url.includes('.png')
            "
            :class="[
              `${item.url == selectedReview.onReview ? 'border-primary' : ''}`,
              'rounded border border-2 pointer',
            ]"
          />
          <div
            v-else
            :class="[
              `${item.url == selectedReview.onReview ? 'border-primary' : ''}`,
              'wrapper__video rounded border border-2 pointer',
            ]"
            @click="selectOnReview(item.url)"
            style="width: 50px; height: 50px"
          >
            <video
              onload="none"
              class="rounded"
              style="width: 100%; height: 100%; object-fit: cover"
            >
              <source :src="item.url" />
            </video>
            <img
              class="play"
              loading="lazy"
              src="@/assets/images/icons/button-play.png"
            />
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const emit = defineEmits(["update:selected-review"]);
const props = defineProps({
  selectedReview: {
    type: Object,
    required: true,
  },
});

const screenWidth = computed(() => screen.width);
const dialogWidth = computed(() => (screenWidth.value > 768 ? "30%" : "80%"));

const selectOnReview = (file: string) => {
  emit("update:selected-review", {
    files: props.selectedReview.files,
    onReview: file,
  });
};

const videoPlay = ref<HTMLVideoElement | null>(null);
const closeDialog = () => {
  if (videoPlay.value) {
    videoPlay.value.pause();
    videoPlay.value.currentTime = 0;
  }
};
</script>
