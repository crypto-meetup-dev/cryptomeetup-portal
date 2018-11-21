<template>
  <div class="map">
    <Loading v-if="!mapLoad" loadText="loading ..." />
    <mapbox
      access-token="null"
      :map-options="{
        style: 'https://maps.tilehosting.com/c/adbc36eb-6765-4278-8c1a-b14fa25d0ae2/styles/basic-dark/style.json?key=eT7rAVG6glnuTf9iWHbK',
        zoom: 11,
        center: [116.478515, 39.889992],
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
import { ajax, analysis } from '@/util/ajax'

import RedeemCodeCopyDialog from '@/components/RedeemCodeCopyDialog.vue';
import MapMarkerLocation from '@/components/MapMarkerLocation.vue';
import MapMarkerMeetup from '@/components/MapMarkerMeetup.vue';
import Loading from '@/components/Loading.vue';
import LocationPopup from '@/components/LocationPopup.vue';

export default {
  name: 'map-view',
  data() {
    return {
      mapLoad: false,
      showPopup: false,
    };
  },
  components: {
    Mapbox,
    Loading,
  },
  created() {
    // 这两到时候都应该删除的
    this.meetupLocation = [116.478515, 39.889992];
    this.getLocation();
  },
  mounted() {
    this.jumped = false;
  },
  methods: {
    onMapInit(map) {
      // 初始化地图
      map.resize();
    },
    onMapLoaded(map) {
      // 地图加载成功
      this.map = map;
      this.mapLoad = true;
      // 渲染地标
      this.locationArr && this.initLocationPopup();

      // this.popupComponent.$on('redeemCodeGenerated', (code) => {
      //   this.$modal.open({
      //     parent: this,
      //     component: RedeemCodeCopyDialog,
      //     hasModalCard: true,
      //     props: {
      //       code,
      //     },
      //   });
      // });

      if ('geolocation' in navigator) {
        this.locationUpdateTimer = setInterval(() => this.updateLocation(), 5000);
        this.updateLocation();
      }
    },
    createLocation (name, popupComponent, locationComponent, location) {
      /*
        name 一个名字 比如 地标 还是展会活动等
        popupComponent 弹出层的组件
        locationComponent 地图上闪烁点组件
        location 坐标数组
        transferData 给弹出层传递值的函数 需要 return 一段数据
      */
      this[name] = new Vue(popupComponent).$mount().$on('createLocation', data => {
        this[name].setData(data);
        this.getLocation();
      });
      this[`${name}popup`] = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setDOMContent(this[name].$mount().$el);

      const locationDOM = {};
      location.forEach((item, i) => {
        locationDOM[`index${i}`] = new Vue({
          ...locationComponent,
          propsData: {
            coord: item,
          },
        }).$mount().$on('click', (data) => {
          this[name].setData(data.infos.length ? data.infos[0] : null);
          this[`${name}popup`].setLngLat([+data.longitude, +data.latitude]);
          this.map.flyTo({ center: [+data.longitude, +data.latitude], zoom: 15 });
        });
        new mapboxgl.Marker(locationDOM[`index${i}`].$el).setLngLat([+item.longitude, +item.latitude]).setPopup(this[`${name}popup`]).addTo(this.map);
      })
    },
    initLocationPopup() {
      this.createLocation('locationName', LocationPopup, MapMarkerMeetup, this.locationArr)
    },
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
      // 计算活动于用户的位置
      this.popupComponent.setCanCheckIn(distance <= 1000);
    },
    updateLocation(fly = false) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coord = [position.coords.longitude, position.coords.latitude];
        this.updateCheckInAvailability(coord);
        if (fly) {
          this.map.flyTo({ center: coord, zoom: 13 });
          this.jumped = true;
          this.getLocation(coord);
        } else if (!this.jumped) {
          // Jump
          this.map.jumpTo({ center: coord });
          this.jumped = true;
        }
        this.updateMyLocation();

        if (!this.locationArr) {
          this.getLocation(coord);
        }
      });
    },
    updateMyLocation(coord) {
      // 更新用户本人的地理位置
      // if (!this.marker) {
      //   this.marker = new mapboxgl.Marker(new Vue(MapMarkerLocation).$mount().$el);
      //   this.marker.setLngLat(coord).addTo(this.map);
      // } else {
      //   this.marker.setLngLat(coord);
      // }
    },
    getLocation() {
      // 重新根据经纬度去请求附近地标
      ajax.get(analysis('/pub/bt/point/distance', {
        latitude: '30.275029',
        longitude: '119.990402',
        distance: 2000,
      })).then(resp => {
        this.locationArr = [...resp.records, { latitude: 30.275029, longitude: 119.990402, infos: [] }]
        this.map && this.initLocationPopup();
      })
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
