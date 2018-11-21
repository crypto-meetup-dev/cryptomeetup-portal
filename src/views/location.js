/* eslint-disable */
// class Location {
//   constructor (map) {
//     this.map = map
//   }

// }
import mapboxgl from 'mapbox-gl'
import Vue from 'vue'
import { ajax, analysis } from '@/util/ajax'
import MyLocationComp from '@/components/landmark/MapMarkerLocation.vue'
import createLocation from '@/components/landmark/createLocation.vue'
import LocationPopupComp from '@/components/landmark/LocationPopup.vue'
import MapMarkerMeetup from '@/components/landmark/MapMarkerMeetup.vue'

const location = {
  map: null,
  myLocation: null,
  myLocationMarker: null,
  createLocationPopup: null,
  locationArr: [],
  locationPopup: null,
  locationPopupFn: null,
  locationPopupComp: null,
  myLocationNum: null,
  onMapLoaded (map) {
    this.map = map
    this.getMyLocation()
  },
  getMyLocation () {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const coord = [position.coords.longitude, position.coords.latitude]
    //   console.log(coord, 'coord')
    //   this.addMyLocationComp(coord)
    //   this.getLocationArr(coord)
    // })
    // 获取用户坐标
    const coord = [116.478515, 39.889992]
    this.myLocationNum = coord
    this.addMyLocationComp(coord)
    this.getLocationArr(coord)
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
    }).setDOMContent(createLocationComp.$mount().$el).setLngLat(coord).addTo(this.map)
  },
  openCreatePopup(coord) {
    // 打开创建地标的ui
    this.createLocationPopup.remove()
    this.locationPopupComp.$mount().setData(null)
    this.locationPopupFn.setLngLat(coord).addTo(this.map)
  },
  getLocationArr () {
    // 获取所有地标数组
    ajax.get(analysis('/pub/bt/point/distance', {
      latitude: '30.275029',
      longitude: '119.990402',
      distance: 2000,
    })).then(resp => {
      this.locationArr = resp && resp.records
      this.initLocationPopup()
    })
  },
  initLocationPopup () {
    // 初始化所有地标ui
    this.locationPopupComp = new Vue(LocationPopupComp)
    this.locationPopupComp.$mount().$on('createLocation', () => {
      this.createLocationSuccess()
    });
    this.locationPopupFn = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    }).setDOMContent(this.locationPopupComp.$mount().$el);
    this.renderLocation()
  },
  renderLocation () {
    // 渲染所有地标
    const locationDOM = {}
    this.locationArr.length && this.locationArr.forEach((locationItem, i) => {
      locationDOM[`index${i}`] = new Vue({
        ...MapMarkerMeetup,
        propsData: {
          coord: locationItem,
        },
      }).$mount().$on('click', data => {
        this.locationPopupComp.setData(data.infos.length ? data.infos[0] : null);
        this.locationPopupFn.setLngLat([+data.longitude, +data.latitude]);
        this.map.flyTo({ center: [+data.longitude, +data.latitude], zoom: 15 });
      })
      new mapboxgl.Marker(locationDOM[`index${i}`].$el).setLngLat([+locationItem.longitude, +locationItem.latitude]).setPopup(this.locationPopupFn).addTo(this.map);
    })
  },
  createLocationSuccess () {
    // 创建地标成功
    console.log('xxxx', this.locationPopupFn, this.locationPopupFn.remove)
    this.locationPopupFn.remove()
    this.createLocationPopup.setLngLat(this.myLocationNum).addTo(this.map)
  }
}

export default location