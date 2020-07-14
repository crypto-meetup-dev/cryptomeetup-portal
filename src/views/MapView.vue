<template>
  <div class="map">
    <EnlargeImg :url="enlargeImgUrl" :isShow="enlargeImgIsShow" @close="enlargeImg" />
    <Loading v-if="!mapLoad" loadText="loading ..." />
    <mapbox
      access-token="Wk5LRwC4fuZwd18puNTd"
      :map-options="{
        style: 'https://api.maptiler.com/maps/3a48940f-119f-4d5e-bf4b-e9b1ff19167b/style.json?key=Wk5LRwC4fuZwd18puNTd',
        zoom: 11,
        center: [22, 39.889992],
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
import Global from '../Global.js';

import RedeemCodeCopyDialog from '@/components/RedeemCodeCopyDialog.vue';
import MapMarkerLocation from '@/components/landmark/MapMarkerLocation.vue';
import MapMarkerMeetup from '@/components/landmark/MapMarkerMeetup.vue';
import Loading from '@/components/Loading.vue';
import LocationPopup from '@/components/landmark/LocationPopup.vue';
import createLocation from '@/components/landmark/createLocation.vue';
import EnlargeImg from '@/components/landmark/enlargeImg.vue'
import location from './location.js'
import { mapState, mapActions } from 'vuex'
import { setLocalStorage, removeLocalStorage } from '@/util/storeUtil.js'
import { getCookie, disassemble } from '../util/cookies'
import { getAvatarUrl } from '../api/login';
import Axios from 'axios';

// const geoData = require('./customgeo.json')
const geoData = require('./customgeo.json')

export default {
  name: 'map-view',
  data() {
    return {
      mapLoad: false,
      showPopup: false,
      isMyPortal: false,
      isOpencreatePopup: false,
      enlargeImgIsShow: false,
      enlargeImgUrl: ''
    };
  },
  components: {
    Mapbox,
    Loading,
    EnlargeImg,
  },
  computed: {
    ...mapState(['mapObject', 'isLoggingIn', 'userId'])
  },
  watch: {
    portalInfoList(val) {
      val && Global.setPortalInfoList(val)
    }
  },
  created() {
  
  },
  mounted() {
    this.jumped = false;
    if (this.isLoggingIn) {
      console.log(document.getElementsByClassName('mapboxgl-marker-anchor-center')[0])
    }
  },
  methods: {
    ...mapActions(['setMapObject']),
    enlargeImg () {
      this.enlargeImgIsShow = false
      this.enlargeImgUrl = ''
    },
    updateLocation (fly) {
      location.updateLocation(fly)
      let coord = []
      navigator.geolocation.getCurrentPosition((position) => {
        coord = [position.coords.longitude, position.coords.latitude];
        if (this.isLoggingIn) Axios.get(process.env.VUE_APP_CMUAPI + `/user/update/position?id=${this.userId}&lng=${coord[0]}&lat=${coord[1]}`)
      })
      return coord
    },
    onMapInit(map) {
      // 初始化地图
      // map.resize();
    },
    onMapLoaded(map) {
      // 地图加载成功
      const c = getCookie('cryptomeetuptoken')
      const res = disassemble(c)
      if (c) {
        location.onMapLoaded(map, msg => {
          this.$toast.open({
            message: msg,
            type: 'is-danger',
            duration: 3000,
            queue: false,
          });
        }, url => {
          this.enlargeImgUrl = url
          this.enlargeImgIsShow = true
        }, res.id)

        Axios.get(process.env.VUE_APP_CMUAPI + '/friends?id=' + res.id).then(response => {
          response.data.forEach(element => {
            Axios.get(process.env.VUE_APP_CMUAPI + '/user/position?id=' + element.userId).then(position => {
              map.loadImage(process.env.VUE_APP_CMUAPI + '/user/avatar?id=' + element.userId, (error, image) => {
                const itemId = 'id' + element.userId
                const avatar = 'avatar' + element.userId
                if (error) throw error;
                map.addImage(avatar, image);
                map.addSource(itemId, {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: position.data
                        }
                      }
                    ]
                  }
                });
                map.addLayer({
                  id: itemId,
                  type: 'symbol',
                  source: itemId,
                  layout: {
                    'icon-image': avatar,
                    'icon-size': 0.08
                  }
                });
              });
            })
          });
        })
      }

      // this.map = map;
      this.mapLoad = true;
      Global.$emit('onLoadMap')

      map.addSource('countries', {
        type: 'geojson',
        data: geoData
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      map.addLayer({
        id: 'state-fills',
        type: 'fill',
        source: 'countries',
        layout: {},
        paint: {
          'fill-color': '#000',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0,
            0
          ]
        }
      });

      map.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'countries',
        layout: {},
        paint: {
          'line-color': '#FFD83F',
          'line-width': 2,
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0
          ]

        }
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      let hoveredStateId = null;

      map.on('mousemove', 'state-fills', (e, i) => {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState(
              { source: 'countries', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: 'countries', id: hoveredStateId },
            { hover: true }
          );
        }
      });

      map.on('mouseleave', 'state-fills', () => {
        if (hoveredStateId) {
          map.setFeatureState(
            { source: 'countries', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });


      Axios.get(process.env.VUE_APP_CMUAPI + '/user/position?id=' + res.id).then(async result => {
        map.loadImage(
          process.env.VUE_APP_CMUAPI + '/user/avatar?id=' + res.id,
          (error, image) => {
            if (error) throw error;
            map.addImage('user', image);
            map.addSource('point', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: result.data
                    }
                  }
                ]
              }
            });
            map.addLayer({
              id: 'user',
              type: 'symbol',
              source: 'point',
              layout: {
                'icon-image': 'user',
                'icon-size': 0.08
              }
            });
          }
        );
      }).catch(e => console.log(e))

      if ('geolocation' in navigator) {
        this.locationUpdateTimer = setInterval(() => this.updateLocation(true), 5000);
        this.updateLocation(false);
      }
    }
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
