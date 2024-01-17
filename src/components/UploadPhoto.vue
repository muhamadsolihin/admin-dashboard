<template>
    <div class="px-3 mt-5 pt-5" v-bind="asAny(getRootProps())" v-if="previewImage == ''">
      <div
        class="upload__image_dropzone d-flex flex-column justify-content-center align-items-center"
        :class="{ drag__active: isDragActive }"
      >
        <div class="d-flex flex-row justify-content-center align-items-center">
          <input v-bind="asAny(getInputProps())" />
          <PictureSvg :color="isDragActive ? colorSvgPicture[0] : colorSvgPicture[1]" />
          <h2 class="mt-3">Unggah foto produk</h2>
        </div>
        <button
          type="button"
          class="btn"
          :class="{
            'btn-primary': isDragActive,
            'btn-secondary': !isDragActive,
          }"
          style="margin-top: 30px"
          @click="asAny(open)"
        >
          Unggah foto
        </button>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-12 d-flex flex-column">
          <p class="fw-bold m-0">Preview foto:</p>
          <div class="d-flex flex-row flex-wrap">
            <div class="my-3 me-3 preview-image">
              <img :src="previewImage" />
            </div>
          </div>
          <div class="d-flex flex-row">
            <p class="mx-2">
              {{ fileName }}
            </p>
            <p
              class="fw-bold text-decoration-underline text-primary m-0 pointer"
              @click="removeFile"
            >
              Hapus foto
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from "vue";
  import { useDropzone } from "vue3-dropzone";
  
  import PictureSvg from "./atoms/PictureSvg.vue";
  
  const props = defineProps({
    productImage: {
      type: Blob,
      require: true,
    },
    previewProductImage: {
      type: String,
      require: true,
    },
  });
  const emit = defineEmits(["update:productImage", 'update:previewProductImage']);
  
  const fileName = ref<string>("");
  const colorSvgPicture = ref<string[]>(["#E60023", "#b7bed3"]);
  
  const image = computed({
    get: () => props.productImage,
    set: (val) => {
      emit("update:productImage", val);
    },
  });
  
  const previewImage = computed({
    get: () => props.previewProductImage,
    set: (val) => {
      emit("update:previewProductImage", val);
    },
  });
  
  const onDrop = (acceptFiles, rejectReasons) => {
    image.value = acceptFiles[0];
    fileName.value = acceptFiles[0].name;
    previewImage.value = URL.createObjectURL(acceptFiles[0]);
  };
  
  const asAny = (fn: any) => fn as any;
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    maxFiles: 1,
    onDrop,
  });
  const removeFile = () => {
    image.value = new Blob();
    fileName.value = "";
    previewImage.value = "";
  };
  </script>
  
  <style lang="scss" scoped>
  .upload__image_dropzone {
    width: 100%;
    height: 300px;
    margin-bottom: 30px;
    border-radius: 10px;
    border: 2px solid #b7bed3;
    border-style: dashed;
    background-color: #f9fafd;
  
    h2 {
      color: #b7bed3;
      margin-left: 10px;
    }
  }
  
  .drag__active {
    border: 2px solid #e60023;
    border-style: dashed !important;
    background-color: #fff1ea;
  
    h2 {
      color: #e60023;
    }
  }
  
  .preview-image {
    position: relative;
    width: 150px;
    height: 150px;
    border: 1px solid #b7bed3;
    border-radius: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }
  }
  </style>
  