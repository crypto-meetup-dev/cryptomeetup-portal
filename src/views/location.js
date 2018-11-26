/* eslint-disable */

import mapboxgl from 'mapbox-gl'
import Vue from 'vue'
import { ajax, analysis } from '@/util/ajax'
import { getLocalStorage } from '@/util/storeUtil.js'
import MyLocationComp from '@/components/landmark/MapMarkerLocation.vue'
import createLocation from '@/components/landmark/createLocation.vue'
import LocationPopupComp from '@/components/landmark/LocationPopup.vue'
import i18n from '@/i18n'

const amap = new AMap.Map('container', {
  resizeEnable: true
})

const location = {
  map: null,
  myLocation: null,
  myLocationMarker: null,
  createLocationPopup: null,
  locationArr: null,
  locationPopup: null,
  locationPopupFn: null,
  locationPopupComp: null,
  myLocationNum: null,
  animationRespA: 0,
  animationRespB: 0,
  animationRespC: 0,
  isGetMylocation: false,
  isGetData: false,
  onMapLoaded(map, error, openImg) {
    this.map = map
    this.errorCallback = error
    this.openImg = openImg
    this.getMyLocation()
    this.interval()
  },
  getLocation (callbacl) {
    // this.myLocationNum = [116.468515, 39.989992]
    // callbacl(this.myLocationNum)
    const slef = this
    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 100000,          //超过10秒后停止定位，默认：5s
        buttonPosition: 'RB',    //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
      });

      amap.addControl(geolocation);
      geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
          const coord = [result.position.lng, result.position.lat]
          slef.myLocationNum = coord
          callbacl(coord)
        } else {
          slef.errorCallback(result.message)
        }
      });
    });
  },
  getMyLocation () {
    this.getLocation(coord => {
      this.map.flyTo({ center: coord, zoom: 13 })
      this.addMyLocationComp(coord)
      this.isGetMylocation = true
      this.isGetData && this.getLocationArr(coord)
    })
  },
  addMyLocationComp (coord) {
    // 添加我的位置的icon
    this.myLocationMarker = new mapboxgl.Marker(new Vue(MyLocationComp).$mount().$el)
    this.myLocationMarker.setLngLat(coord).addTo(this.map)
    this.addCreatePupup(coord)
  },
  addCreatePupup(coord) {
    // 创建地标的按钮
    const createLocationComp = new Vue(createLocation).$mount().$on('openCreatePopup', () => {
      // 点击创建
      this.openCreatePopup(coord)
    })
    // 吧创建地标的按钮 append到地图上
    this.createLocationPopup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'create-location-popup'
    }).setDOMContent(createLocationComp.$mount().$el)

    // 添加展示地标以及创建地标popup
    this.locationPopupComp = new Vue({ ...LocationPopupComp, i18n})
    this.locationPopupComp.$mount().$on('createLocation', () => {
      this.createLocationSuccess()
    });
    this.locationPopupComp.$mount().$on('openImg', url => {
      this.openImg(url)
    });
    this.locationPopupFn = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setDOMContent(this.locationPopupComp.$mount().$el);
  },
  openCreatePopup(coord) {
    // 打开创建地标的ui
    this.createLocationPopup.remove()
    this.locationPopupComp.$mount().setData(null, this.myLocationNum[0], this.myLocationNum[1])
    this.locationPopupFn.setLngLat(coord).addTo(this.map)
  },
  formatData (data) {
    const features = []
    data.length && data.forEach(item => {
      if (+item.infos[0].status === 1) {
        if (item.infos[0].userId === getLocalStorage('userId')) {
          features.push({
            type: 'Feature',
            properties: item,
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude]
            }
          })
        }
      } else {
        features.push({
          type: 'Feature',
          properties: item,
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude]
          }
        })
      }
    })
    this.locationArr = {
      type: 'FeatureCollection',
      features,
    }
    this.renderLocation()
  },
  getLocationArr () {
    // 获取所有地标数组
    ajax.get(analysis('/pub/bt/point/distance', {
      latitude: this.myLocationNum[1],
      longitude: this.myLocationNum[0],
      distance: 20000000,
      limit: 1000
    }), {headers: {
      Authorization: getLocalStorage('Authorization'),
      Authorization: getLocalStorage('userId')
    }}).then(resp => {
      resp.data.data.records && this.formatData(resp.data.data.records)
    })
  },
  renderLocation () {
    this.map.addSource('earthquakes', {
      type: 'geojson',
      data: this.locationArr,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    })

    this.map.addLayer({
      id: "clusters",
      type: "circle",
      source: "earthquakes",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#8d7da3", 100, "#3a3146", 750, "#213b13"],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
      }
    })

    this.map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "earthquakes",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 18,
      }
    })

    this.map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "earthquakes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "transparent", // transparent
        "circle-radius": 8,
        "circle-stroke-width": 3,
        "circle-stroke-color": "transparent"
      }
    })

    this.map.on('click', 'clusters', e => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
      const clusterId = features[0].properties.cluster_id
      this.map.getSource('earthquakes').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return
        }
        this.map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        })
      })
    })

    this.map.on('click', 'unclustered-point', e => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] })
      const data = JSON.parse(features[0].properties.infos)
      this.openLocationPopup(features[0].properties)
    })

    this.map.on('mouseenter', 'clusters', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    })

    this.map.on('mouseleave', 'clusters', () => {
      this.map.getCanvas().style.cursor = '';
    })

    this.animation()
  },
  animation () {
    if (!(this.animationRespB % 10)) {
      this.animationRespC < 10 ? this.animationRespC++ : this.animationRespC = 3
      this.map.setPaintProperty("unclustered-point", 'circle-radius', this.animationRespC)

      if (this.animationRespC === 10) {
        this.map.setPaintProperty("unclustered-point", 'circle-stroke-color', 'transparent')
      } else if (this.animationRespC > 5) {
        this.map.setPaintProperty("unclustered-point", 'circle-stroke-color', '#4EFFF3')
      }
    }

    window.requestAnimationFrame(() => {
      this.animationRespB += 1
      this.animation()
    })
  },
  openLocationPopup(features) {
    const data = JSON.parse(features.infos)
    this.locationPopupComp.$mount().setData(data[0], features.latitude, features.longitude)
    this.locationPopupFn.setLngLat([features.longitude, features.latitude]);
    this.locationPopupFn.addTo(this.map)
  },
  createLocationSuccess () {
    // 创建地标成功
    this.locationPopupFn.remove()
    this.createLocationPopup.setLngLat(this.myLocationNum).addTo(this.map)
  },
  interval () {
    setInterval(() => {
      if (!this.locationPopupFn || !this.createLocationPopup) {
        return false
      }
      if (!this.locationPopupFn.isOpen() && !this.createLocationPopup.isOpen() && getLocalStorage('name')) {
        this.createLocationPopup.setLngLat(this.myLocationNum).addTo(this.map)
      }
    }, 2000)
  },
  opencreatePopup () {
    this.createLocationPopup && this.createLocationPopup.setLngLat(this.myLocationNum).addTo(this.map)
  },
  getData () {
    this.isGetData = true
    this.isGetMylocation && this.getLocationArr(this.myLocationNum)
  },
  updateLocation () {
    if (this.map) {
      this.getLocation(coord => {
        this.map.flyTo({ center: coord, zoom: 13 })
        this.myLocationMarker.setLngLat(coord).addTo(this.map)
        this.createLocationPopup.setLngLat(coord).addTo(this.map)
      })
    }
  }
}

export default location