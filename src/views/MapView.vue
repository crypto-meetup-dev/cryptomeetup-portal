<template>
  <div class="map">
    <mapbox
      access-token="null"
      :map-options="{
        style: 'https://maps.tilehosting.com/c/adbc36eb-6765-4278-8c1a-b14fa25d0ae2/styles/basic-dark/style.json?key=eT7rAVG6glnuTf9iWHbK',
        center: [139.69171, 35.6895],  // Tokyo
        zoom: 11,
      }"
      @map-load="onMapLoaded"
      @map-init="onMapInit"
    />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import Mapbox from 'mapbox-gl-vue';

export default {
  name: 'map-view',
  components: {
    Mapbox,
  },
  methods: {
    onMapInit(map) {
      map.resize();
    },
    onMapLoaded(map) {
      this.map = map;
      if ('geolocation' in navigator) {
        this.locationUpdateTimer = setInterval(() => this.updateLocation(), 5000);
        this.updateLocation(true);
      }
    },
    updateLocation(jump = false) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coord = [position.coords.longitude, position.coords.latitude];
        if (jump) {
          this.map.jumpTo({ center: coord });
        }
        if (!this.marker) {
          const el = document.createElement('div');
          el.className = 'marker';
          this.marker = new mapboxgl.Marker(el);
          this.marker.setLngLat(coord).addTo(this.map);
        } else {
          this.marker.setLngLat(coord);
        }
      });
    },
  },
  destroyed() {
    if (this.locationUpdateTimer) {
      clearInterval(this.locationUpdateTimer);
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

  /deep/
    #map
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%

    .marker
      width: 30px
      height: 30px
      position: relative

      &::before, &::after
        content: ''
        width: 100%
        height: 100%
        border-radius: 50%
        background-color: #FFC30D
        box-shadow: 0 0 10px #FFC30D
        opacity: 0.6
        position: absolute
        top: 0
        left: 0
        animation: sk-bounce 2.0s infinite ease-in-out

      &::after
        animation-delay: -1.0s

      @keyframes sk-bounce
        0%, 100%
          transform: scale(0.0)
        50%
          transform: scale(1.0)
</style>
