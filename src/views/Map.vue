<template>
  <div class="map">
    <l-map :zoom="zoom" :center="center">
      <l-tile-layer :url="url" />
      <l-marker :lat-lng="marker" v-if="marker" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { L } from 'leaflet';


export default {
  name: 'map-view',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 13,
      center: L.latLng(31.22, 121.458),
      marker: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
      // url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    };
  },
  mounted() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = L.latLng(position.coords.latitude, position.coords.longitude);
        this.marker = this.center;
      });
    }
  },
};
</script>

<style lang="sass" scoped>
.map
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 0
</style>
