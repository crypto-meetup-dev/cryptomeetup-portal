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
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import Mapbox from 'mapbox-gl-vue';
import geolib from 'geolib';

import RedeemCodeCopyDialog from '@/components/RedeemCodeCopyDialog.vue';
import MapMarkerLocation from '@/components/MapMarkerLocation.vue';
import MapMarkerMeetup from '@/components/MapMarkerMeetup.vue';
import MapPopup from '@/components/MapPopup.vue';

export default {
  name: 'map-view',
  components: {
    Mapbox,
  },
  methods: {
    updateCheckInAvailability(lonLat) {
      if (!lonLat) {
        return;
      }
      if (!this.popupComponent) {
        return;
      }
      const distance = geolib.getDistance(
        { latitude: this.meetupLocation[1], longitude: this.meetupLocation[0] },
        { latitude: lonLat[1], longitude: lonLat[0] },
      );
      this.popupComponent.setCanCheckIn(distance <= 1000);
    },
    onMapInit(map) {
      map.resize();
    },
    onMapLoaded(map) {
      this.map = map;

      this.popupComponent = new Vue({
        ...MapPopup,
        propsData: {
          title: '中国 DAPP 开发者大会',
          location: '北京朝阳区北京帝景豪廷酒店',
          date: '2018-11-09 ~ 11-10',
          link: 'https://www.bagevent.com/event/1871915',
        },
      });
      this.popupComponent.$on('redeemCodeGenerated', (code) => {
        this.$modal.open({
          parent: this,
          component: RedeemCodeCopyDialog,
          hasModalCard: true,
          props: {
            code,
          },
        });
      });

      const popup = new mapboxgl
        .Popup({ offset: 25, closeButton: false })
        .setDOMContent(this.popupComponent.$mount().$el);

      const markerComponent = new Vue(MapMarkerMeetup)
        .$mount()
        .$on('click', () => {
          map.flyTo({ center: this.meetupLocation, zoom: 15 });
        });
      new mapboxgl.Marker(markerComponent.$el)
        .setLngLat(this.meetupLocation)
        .setPopup(popup)
        .addTo(this.map);

      if ('geolocation' in navigator) {
        this.locationUpdateTimer = setInterval(() => this.updateLocation(), 5000);
        this.updateLocation();
      }
    },
    updateLocation(fly = false) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coord = [position.coords.longitude, position.coords.latitude];
        this.updateCheckInAvailability(coord);
        if (fly) {
          this.map.flyTo({ center: coord, zoom: 13 });
          this.jumped = true;
        } else if (!this.jumped) {
          // Jump
          this.map.jumpTo({ center: coord });
          this.jumped = true;
        }
        if (!this.marker) {
          this.marker = new mapboxgl.Marker(new Vue(MapMarkerLocation).$mount().$el);
          this.marker.setLngLat(coord).addTo(this.map);
        } else {
          this.marker.setLngLat(coord);
        }
      });
    },
  },
  created() {
    this.meetupLocation = [116.478515, 39.889992];
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
      color: #222
</style>
