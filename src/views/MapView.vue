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
    <button class="position-button mapboxgl-ctrl-icon" @click="updateLocation(true)">
      <b-icon icon="crosshairs-gps" size="is-small" />
    </button>
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

      const el = document.createElement('div');
      el.className = 'marker-meetup';
      const marker = new mapboxgl.Marker(el);
      marker.setLngLat([116.478515, 39.889992]).addTo(this.map);

      if ('geolocation' in navigator) {
        this.locationUpdateTimer = setInterval(() => this.updateLocation(), 5000);
        this.updateLocation();
      }
    },
    updateLocation(fly = false) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coord = [position.coords.longitude, position.coords.latitude];
        if (fly) {
          this.map.flyTo({ center: coord, zoom: 13 });
          this.jumped = true;
        } else if (!this.jumped) {
          // Jump
          this.map.jumpTo({ center: coord });
          this.jumped = true;
        }
        if (!this.marker) {
          const el = document.createElement('div');
          el.className = 'marker-self';
          this.marker = new mapboxgl.Marker(el);
          this.marker.setLngLat(coord).addTo(this.map);
        } else {
          this.marker.setLngLat(coord);
        }
      });
    },
  },
  mounted() {
    this.jumped = false;
  },
  destroyed() {
    if (this.locationUpdateTimer) {
      clearInterval(this.locationUpdateTimer);
    }
  },
};
</script>

<style lang="sass" scoped>
.position-button
  position: absolute
  z-index: 1
  left: 10px
  bottom: 10px
  border-radius: 4px
  outline: none

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

    .marker-self
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

    .marker-meetup,
    .marker-meetup::before
      position: relative
      box-sizing: border-box

    .marker-meetup
      color: #4EFFF3

    .marker-meetup::before
      content: ''
      display: inline-block
      float: none
      background-color: currentColor
      border: 0 solid currentColor

    .marker-meetup
      width: 32px
      height: 32px

    .marker-meetup::before
      width: 32px
      height: 32px
      background: transparent
      border-width: 4px
      border-radius: 100%
      opacity: 0
      animation: ball-scale-ripple 1s 0s infinite cubic-bezier(.21, .53, .56, .8)

    @keyframes ball-scale-ripple
      0%
        opacity: 1
        transform: scale(.1)
      70%
        opacity: .65
        transform: scale(1)
      100%
        opacity: 0
</style>
