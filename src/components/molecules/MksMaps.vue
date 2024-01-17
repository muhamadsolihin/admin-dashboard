<template>
  <div id="maps" style="width: 100%; height: 350px">
    <img src="@/assets/images/icons/marker.png" />
    <div ref="mapDiv" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import {
  ref,
  onMounted,
  computed,
  watch,
  onUnmounted,
  reactive,
} from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { Coordinate } from "@/types/auth/Coordinate.interface";

const mapDiv = ref();
const pickedPos = ref<Coordinate>({} as Coordinate);
const map = ref();

const props = defineProps({
  latitude: {
    type: Number,
    require: true,
  },
  longitude: {
    type: Number,
    require: true,
  },
});

const emit = defineEmits(['coordinateChanges']);

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_SERVICE_KEY,
  libraries: ['places'],
  language: 'id',
});

const currPos = computed(
  () =>
    ({
      lat: props.latitude,
      lng: props.longitude,
    } as Coordinate)
);

watch(
  () => props.latitude,
  () => {
    generateMaps(currPos.value);
  }
);

function generateMaps(position: Coordinate) {
  map.value = new window.google.maps.Map(mapDiv.value, {
    center: position,
    zoom: 19,
    disableDefaultUI: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map.value?.addListener('center_changed', function(this: any) {
    pickedPos.value = {
      lat: this.getCenter().lat(),
      lng: this.getCenter().lng(),
    };
    emit('coordinateChanges', pickedPos.value);
  });
}

let watcher: number | null = null;
onMounted(async () => {
  await loader.load();
});

onUnmounted(() => {
  if (watcher) navigator.geolocation.clearWatch(watcher);
});
</script>

<style lang="scss" scoped>
#maps {
  position: relative;
  img {
    position: absolute;
    /*center the marker*/
    top: 50%;
    left: 50%;
    z-index: 1;
    /*fix offset when needed*/
    margin-left: -20px;
    margin-top: -41px;
    /*size of the image*/
    height: 40px;
    width: 40px;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>
