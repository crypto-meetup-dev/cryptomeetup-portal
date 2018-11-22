<template>
  <div class="location-popup-component">
    <div class="title" v-if="locationData">
      <h2>{{locationData.title}}</h2>
      <div class="status">
        <b-icon :icon="[null, 'clock-outlin', 'success'][locationData.status]" size="is-small" />
        {{[null, $t('state_review'), $t('state_owned'), $t('state_unopened'), $t('state_occupied')][locationData.status]}}
      </div>
    </div>
    <div v-if="locationData">
      <div class="describe">
        <span><i /></span>
        <div>{{locationData.des}}</div>
      </div>
      <div class="describe">
        <span><i /></span>
        <div>{{locationData.nickName}}</div>
      </div>
    </div>
    <div v-else>
      <div class="input-box">
        <input type="text" v-model="createName" :placeholder="$t('input_title')" />
        <i class="star-five" />
      </div>
      <div class="input-box">
        <input type="text" v-model="createDescribe" :placeholder="$t('input_description')" />
      </div>
      <div class="input-box">
        <input type="text" v-model="createNickName" :placeholder="$t('input_nickname')"  />
        <i class="star-five" />
      </div>
    </div>
    <div class="img">
      <img v-if="(locationData && locationData.images) || previewImage" alt="" :src="(locationData && locationData.images && JSON.parse(locationData.images)[0].url) || previewImage" />
      <input v-if="!locationData" @change="fileImage" type="file" value="" />
      <div v-if="!locationData"><i /><span>{{$t('upload_photo')}}</span></div>
    </div>
    <button class="submit" @click="submit"> {{$t('confirm_updateo')}}</button>
  </div>
</template>

<script>
import { ajax } from '@/util/ajax'
import { getLocalStorage } from '@/util/storeUtil.js'

export default {
  name: 'LocationPopup',
  data() {
    return {
      previewImage: '',
      createName: '',
      createDescribe: '',
      createNickName: getLocalStorage('name'),
      locationData: null,
      previewImagePath: '',
    };
  },
  computed: {

  },
  methods: {
    fileImage(e) {
      const file = e.target.files[0];
      const param = new FormData()
      param.append('file', file, file.name)
      const config = {
        headers: {
          'Content-Type':'multipart/form-data',
          Authorization: getLocalStorage('Authorization'),
          userId: getLocalStorage('userId')
        }
      }

      ajax.post('/bt/customer/file/upload', param, config).then(resp => {
        this.previewImagePath = resp.data.data
        this.previewImage = `http://cryptomeetup-img.oss-cn-shanghai.aliyuncs.com/${resp.data.data}`
      })
    },
    submit() {
      if (!this.createName || !this.createDescribe || !this.previewImagePath) {
        return false
      }
      
      const param = new FormData()
      param.append('title', this.createName)
      param.append('des', this.createDescribe)
      param.append('latitude', '30.276188')
      param.append('longitude', '119.97285')
      param.append('images', JSON.stringify([{
        url: this.previewImage,
        path: this.previewImagePath,
      }]))

      ajax.post('/bt/customer/point/create', param, {headers: {
        Authorization: getLocalStorage('Authorization'),
        userId: getLocalStorage('userId')
      }}).then(resp => {
        this.$toast.open({
          message: '创建地标成功!',
          type: 'is-success',
          duration: 3000,
          queue: false,
        });
        this.$emit('createLocation', resp.data.data);
      })
    },
    setData(data) {
      this.locationData = data;
    },
  },
};
</script>
<style lang="sass" scoped>
  .location-popup-component
    width: 220px
    padding: 0 10px 10px 10px

  .title
    margin-bottom: 10px
    color: #ffffff

    h2
      font-size: 22px
      display: inline-block
      width: 120px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

    .status
      font-size: 8px
      line-height: 18px
      float: right
      position: relative
      top: 12px
      padding: 1px 6px
      border-radius: 7px
      background: #00BEFF

  .describe
    padding-left: 20px
    position: relative
    margin-bottom: 5px
    color: #ffffff
    font-size: 12px

  .describe span
    position: absolute
    display: inline-blcok
    width: 20px
    left: 0px
    top: 0px

  .describe div
    width: 100%

  .img
    margin-top: 16px
    height: 66px
    width: 200px
    position: relative
    display: flex
    align-items: center
    justify-content: center

  .img img
    display: block
    max-width: 200px
    max-height: 66px
    position: relative
    z-index: 2

  .img div
    position: absolute
    top: 0px
    left: 0px
    width: 200px
    height: 66px
    z-index: 1
    border: 2px dashed #141515
    text-align: center
    color: #141515
    padding-top: 14px

  .img div i
    display: block
    width: 2px
    height: 16px
    background: #141515
    position: relative
    left: 97px

  .img div i:before
    display: block
    content: ''
    width: 16px
    height: 2px
    background: #141515
    left: -7px;
    top: 7px;
    position: absolute

  .img input
    position: absolute
    top: 0px
    left: 0px
    width: 200px
    height: 66px
    z-index: 3
    opacity: 0

  .input-box
    height: 28px
    background: #141515
    border-radius: 4px
    overflow: hidden
    margin-bottom: 6px
    position: relative

  .input-box input
    width: 100%
    height: 28px
    line-height: 28px
    font-size: 12px
    outline: none
    background: none
    border: none
    color: #ffffff
    padding-left: 10px
    box-shadow: none

    &::placeholder
      color: #787880

  .submit
    display: block
    height: 25px
    background: #00BEFF
    color: #ffffff
    line-height: 25px
    text-align: center
    border-radius: 4px
    margin-top: 16px
    width: 100%
    outline: none
    border: none
    cursor: pointer

  .star-five
    width: 0
    height: 0
    color: #00BEFF
    position: absolute
    top: 11px
    right: 10px
    display: block
    border-left: 5px solid transparent
    border-right: 5px solid transparent
    border-bottom: 3.5px solid #00BEFF
    transform: rotate(35deg)
    -webkit-transform: rotate(35deg)

  .star-five:before
    width: 0
    height: 0
    border-left: 1.5px solid transparent
    border-right: 1.5px solid transparent
    border-bottom: 4px solid #00BEFF
    position: absolute
    top: -2.25px
    left: -3.25px
    color: white
    display: block
    content: ""
    transform: rotate(35deg)
    -webkit-transform: rotate(-35deg)

  .star-five:after
    width: 0
    height: 0
    display: block
    position: absolute
    color: #00BEFF
    top: 0px
    left: -5.25px
    border-left: 5px solid transparent
    border-right: 5px solid transparent
    border-bottom: 3.5px solid #00BEFF
    content: ""
    transform: rotate(-70deg)
    -webkit-transform: rotate(-70deg)
</style>

<style lang="sass">
  .mapboxgl-popup-content
    background: #2C2E34

  .mapboxgl-popup-anchor-top-right,
  .mapboxgl-popup-anchor-top,
  .mapboxgl-popup-anchor-top-left
    .mapboxgl-popup-tip
      border-bottom-color: #2C2E34

  .mapboxgl-popup-anchor-bottom-right,
  .mapboxgl-popup-anchor-bottom-left,
  .mapboxgl-popup-anchor-bottom
    .mapboxgl-popup-tip
      border-top-color: #2C2E34

  .status span
    vertical-align: top
</style>
