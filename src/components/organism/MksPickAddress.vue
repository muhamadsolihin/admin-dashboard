<template>
  <div class="row">
    <div class="col-12 col-md-6 col-lg-6 col-xl-6">
      <div class="input-group mb-3 mt-3">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input
          type="text"
          name="search-address"
          ref="addressRef"
          v-model="searchAddress"
          class="form-control border border-2 rounded-end"
          placeholder="Cari alamat..."
        />
      </div>
    </div>
    <div class="col-12">
      <mks-maps
        class="mt-3"
        :latitude="props.latitude"
        :longitude="props.longitude"
        @coordinateChanges="changeCoordinate"
      ></mks-maps>
      <div class="w-full d-flex flex-row justify-content-end" v-if="!address">
        <mks-button
          :loading="loadingAddress"
          color="info"
          class="mt-3 ms-3"
          style="width: 120px"
          @click="setAddress"
          >Pilih Titik</mks-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

import { Coordinate } from "@/types/auth/Coordinate.interface";

import MksButton from "../atoms/MksButton.vue";
import MksMaps from "../molecules/MksMaps.vue";

const props = defineProps({
  latitude: {
    type: Number,
    default: 0,
    require: true,
  },
  longitude: {
    type: Number,
    default: 0,
    require: true,
  },
  address: {
    type: String,
    default: "",
    require: true,
  },
});
const emit = defineEmits([
  "update:latitude",
  "update:longitude",
  "update:address",
  "setPickedCoordinate",
]);

const pickedPos = ref<Coordinate>({} as Coordinate);
const searchAddress = ref<string>("");
const loadingAddress = ref<boolean>(false);

const addressRef = ref();
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_SERVICE_KEY,
  libraries: ["places"],
  language: "id",
});

const addr = computed({
  get: () => {
    return props.address;
  },
  set: (val) => {
    emit("update:address", val);
  },
});

function setAddress() {
  loadingAddress.value = true;
  reverseGeo(pickedPos.value).finally(() => {
    loadingAddress.value = false;
  });
}

async function reverseGeo(latlng: Coordinate) {
  await loader.load();
  const geocoder = new google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({ location: latlng });

    if (results && results[0]) {
      addr.value = results[0].formatted_address;
    }
  } catch (e) {
    console.log(e);
  }
}

function changeCoordinate(event: Coordinate) {
  addr.value = "";
  pickedPos.value = event;
  emit("setPickedCoordinate", pickedPos.value);
}

onMounted(async () => {
  await loader.load();
  const autocomplete = new window.google.maps.places.Autocomplete(addressRef.value, {
    types: ["address"],
    fields: ["geometry", "formatted_address"],
  });

  autocomplete?.addListener("place_changed", () => {
    emit("update:latitude", autocomplete.getPlace().geometry?.location?.lat() || 0);
    emit("update:longitude", autocomplete.getPlace().geometry?.location?.lng() || 0);

    pickedPos.value = {
      lat: autocomplete.getPlace().geometry?.location?.lat() || 0,
      lng: autocomplete.getPlace().geometry?.location?.lng() || 0,
    };

    addr.value = autocomplete.getPlace()?.formatted_address || "";

    emit("setPickedCoordinate", pickedPos.value);
  });
});
</script>
