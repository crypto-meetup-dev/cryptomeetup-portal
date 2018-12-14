/* eslint-disable */
<template>
  <div class="location-popup-component">
    <div class="title" v-if="locationData">
      <h2>{{title}}</h2>
      <div class="status">
        <!--[null, '1审核中', '2已拥有', '3无领主', '4已占领']-->
        {{[null, $t('state_review'), $t('state_owned'), $t('state_unopened'), $t('state_occupied')][status]}}
      </div>
    </div>
    <div v-if="locationData">
      <div class="describe" v-if="creator">
        <div>{{$t('my_portal_creator')}}: {{creator}}</div>
      </div>
      <div class="describe" v-if="owner">
        <div>{{$t('my_portal_owner')}}: {{owner}}</div>
      </div>
      <div class="describe" v-if="pic">
        <div>{{$t('my_portal_price')}}: {{pic}}</div>
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
      <img class="preview-image" @click="zoomImages" v-if="(locationData && images) || previewImage" alt="" :src="(locationData && this.getImgUrl(images)) || previewImage" />
      <img v-if="isLoad" class="load" src="../../assets/icons/load.png" />
      <input v-if="!locationData && !isLoad" @change="fileImage" type="file" value="" />
      <div v-if="!locationData"><i v-if="!isLoad" /><span v-if="!isLoad">{{$t('upload_photo')}}</span></div>
    </div>
    <button 
      v-if="!locationData" 
      class="submit" 
      @click="submit"
    >
      {{$t('confirm_update')}}
    </button>
    <button 
      class="submit"  
      v-if="showButton()"
      @click="update"
    >{{$t('update_btn')}}</button>
    <button 
      class="submit"
      @click="buy"
      v-if="isShowBuyPortal()"
    >{{$t('buy_portal')}}</button>
  </div>
</template>

<script>
import { ajax } from '@/util/ajax'
import API from '@/util/api'
import Global from '@/Global.js';
import { getLocalStorage } from '@/util/storeUtil.js'

export default {
  name: 'LocationPopup',
  data() {
    return {
      previewImage: '',
      createName: '',
      createDescribe: '',
      createNickName: '',
      previewImagePath: '',
      updates: false,
      id: '',
      dappId: '',
      locationData: null,
      status: '',
      images: '',
      title: '',
      latitude: 0,
      longitude: 0,
      isLoad: false,
      dappPortal: null,
      pic: '',
      owner: '',
      creator: '',
    };
  },
  methods: {
    showButton () {
      return this.locationData && +this.status === 1 && +getLocalStorage('userId') === +this.userId
    },
    getImgUrl (images) {
      return `https://cryptomeetup-img.oss-cn-shanghai.aliyuncs.com/${JSON.parse(images)[0].path}`
    },
    isShowBuyPortal () {
      if (!Global.portalInfoList.length || this.dappId + '' === 'null' || this.dappId + '' === 'undefined') {
        return false
      }
      const portal = Global.portalInfoList.find(item => +item.id === +this.dappId)

      return portal && this.locationData && +this.status !== 1
    },
    zoomImages () {
      let url = ''
      if (this.locationData && this.images && this.getImgUrl(this.images)) {
        url = this.getImgUrl(this.images)
      } else if (this.previewImage) {
        url = this.previewImage
      }
      this.$emit('openImg', url);
    },
    update () {
      this.updates = true
      this.locationData = null
    },
    fileImage(e) {
      this.isLoad = true
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
        this.isLoad = false
        if (resp.status === 200) {
          this.previewImagePath = resp.data.data
          this.previewImage = `https://cryptomeetup-img.oss-cn-shanghai.aliyuncs.com/${resp.data.data}`
        } else {
          this.$toast.open({
            message: resp.data.msg,
            type: 'is-danger',
            duration: 3000,
            queue: false,
          })
        }
      }).catch(error => {
        this.isLoad = false
        this.$toast.open({
          message: this.$t('server_error_alert'),
          type: 'is-danger',
          duration: 3000,
          queue: false,
        })
      })
    },
    submit() {
      // this.updates true 为更新 false为创建
      if (!this.createName || !this.previewImagePath) {
        this.$toast.open({
          message: this.$t('fill_information_alert'),
          type: 'is-danger',
          duration: 3000,
          queue: false,
        })
        return false
      }
      
      const param = new FormData()
      param.append('title', this.createName)
      param.append('des', this.createDescribe)
      if (!this.updates) {
        param.append('latitude', this.latitude)
        param.append('longitude', this.longitude)
      } else {
        param.append('id', this.id)
      }
      param.append('images', JSON.stringify([{
        url: this.previewImage,
        path: this.previewImagePath,
      }]))

      ajax.post(`/bt/customer/point/${this.updates ? 'update' : 'create'}`, param, {headers: {
        Authorization: getLocalStorage('Authorization'),
        userId: getLocalStorage('userId'),
        'Content-Type': null
      }}).then(resp => {
        this.$toast.open({
          message: `${this.updates ? this.$t('update_prefix') : this.$t('create_prefix')} ${this.$t('landmark_success_suffix')}`,
          type: 'is-success',
          duration: 3000,
          queue: false,
        });
        this.$emit('createLocation', resp.data.data);
        this.previewImagePath = ''
        this.previewImage = ''
        this.locationData = null
        this.createName = ''
        this.createDescribe = ''
      }).catch(error => {
        this.$toast.open({
          message: this.$t('server_error_alert'),
          type: 'is-danger',
          duration: 3000,
          queue: false,
        })
      })
    },
    setData(data, longitude, latitude) {
      this.locationData = data
      setTimeout(() => {
        this.latitude = latitude
        this.longitude = longitude
        this.createNickName = getLocalStorage('name')
        if (data) {
          this.userId = data.userId
          this.title = data.title
          this.dappId = data.dappId
          this.status = data.status
          this.images = data.images
          this.getDappPortal()
        }
      }, 299)
    },
    getDappPortal () {
      this.dappPortal = Global.portalInfoList.find(item => +item.id === +this.dappId)
      
      this.pic = this.dappPortal ? `${this.dappPortal.price.div(10000).mul(1.35).toDecimal(4)} EOS` : ''
      this.owner = this.dappPortal ? this.dappPortal.owner : ''
      this.creator = this.dappPortal ? this.dappPortal.creator : ''
    },
    async buy () {
      if (!this.dappPortal) {
        this.$toast.open({
          message: this.$t('buy_portal_error'),
          type: 'is-danger',
          duration: 3000,
          queue: false,
        })
        return false
      }
      
      try {
        await API.transferEOSAsync({
          from: Global.scatterAccount.name,
          to: 'cryptomeetup',
          amount: this.dappPortal.price.mul(1.35),
          memo: `buy_portal ${this.dappPortal.id}`
        });
        
        this.$toast.open({
          message: this.$t('buy_portal_success'),
          type: 'is-success',
          duration: 3000,
          queue: false,
        });
      } catch (error) {
        const msg = error.message === undefined ? JSON.parse(error).error.details[0].message : error.message

        this.$toast.open({
          message: msg,
          type: 'is-danger',
          duration: 3000,
          queue: false,
        })
      }
    }
  }
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
      width: 48px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

  .describe
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

  .img .preview-image
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

  .load
    width: 20px
    height: 20px
    animation: spin 1.5s linear infinite
    
  
  @keyframes spin
    from
      transform: rotate(0deg)
    to
      transform: rotate(360deg)
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
