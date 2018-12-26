<template>
  <div>
    <div class="my-portal" v-show="!portalItemShow">
      <div class="close" @click="closeMyPortal"><img src="../../assets/icons/close.png" /></div>
      <div class="title">{{$t('my_portal_title')}}</div>
      <div class="no-portal" v-if="!list.length">{{$t('my_portal_no_time')}}</div>
      <ul v-if="list.length">
        <li v-for="(item, index) in list" :key="index" @click="itemPortal(item)">
          <p>{{item.title}}</p>
          <div class="img">
            <img :src="item.images && getImgUrl(item.images)" alt="" />
          </div>
          <p>{{[null, $t('state_review'), $t('state_owned'), $t('state_unopened'), $t('state_occupied')][item.status]}}</p>
        </li>
      </ul>
    </div>
    <div class="portal-item" v-show="portalItemShow">
      <div class="close" @click="closeItemPortal"><img src="../../assets/icons/close.png" /></div>
      <div v-if="title" class="text">{{$t('my_portal_name')}}: {{title}}</div>
      <div v-if="des" class="text">{{$t('my_portal_des')}}: {{des}}</div>
      <div v-if="pic" class="text">{{$t('my_portal_price')}}: {{pic}}</div>
      <div v-if="images" class="img">
        <img :src="images" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { getLocalStorage } from '@/util/storeUtil.js'
import Global from '@/Global.js'

export default {
  name: 'MyPortal',
  props: ['portalList'],
  computed: {
    list () {
      console.log(this.portalList, 'portalList')
      return !this.portalList.length ? [] : this.portalList.filter(item => +item.userId === +getLocalStorage('userId'))
    }
  },
  data () {
    return {
      portalItemShow: false,
      title: '',
      images: '',
      status: 0,
      pic: '',
      des: '',
    }
  },
  methods: {
    closeMyPortal() {
      this.$emit('closeMyPortal')
    },
    itemPortal (item) {
      if (Global.portalInfoList && Global.portalInfoList.length) {
        const portal = Global.portalInfoList.find(x => +x.id === +item.dappId)
        this.pic = portal ? `${(portal.price / 10000 * 1.35).toDecimal(4)} EOS` : ''
      } else {
        this.pic = ''
      }
      this.title = item.title
      this.images = this.getImgUrl(item.images)
      this.status = item.status
      this.des = item.des
      this.portalItemShow = true
    },
    closeItemPortal () {
      this.portalItemShow = false
    },
    getImgUrl (images) {
      return `https://cryptomeetup-img.oss-cn-shanghai.aliyuncs.com/${JSON.parse(images)[0].path}`
    }
  },
};
</script>
<style lang="sass" scoped>
  .portal-item
    position: absolute
    top: 80px
    padding: 20px 20px 20px 20px
    border: 1px solid #48443B
    border-radius: 6px
    background-color: #191301
    width: 200px
    z-index: 2
    left: 50%
    margin-left: -40px

    .img
      height: 160px
      width: 160px
      display: flex
      align-items: center
      justify-content: center
      margin: 0 auto

      img
        display: block
        max-width: 160px
        max-height: 160px

    .text
      margin-bottom: 10px
      font-size: 14px
      color: #fff

  .my-portal
    position: absolute
    top: 80px
    left: 20px
    right: 20px
    bottom: 80px
    border: 1px solid #48443B
    border-radius: 6px
    background-color: #191301
    padding: 60px 20px 10px 20px
    z-index: 2

    .title
      padding: 10px
      font-size: 20px
      color: #fff
      text-align: center
      margin-bottom: 10px
      position: absolute
      top: 10px

    ul
      padding-left: 10px
      width: 100%
      height: 100%
      overflow-y: scroll

    li
      width: 200px
      height: 200px
      text-align: center
      border-radius: 4px
      background-color: #D9D9D9
      list-style: none
      display: inline-block
      margin: 10px 10px 10px 0
      cursor: pointer
      vertical-align: top

      p
        line-height: 40px
        color: #999

      .img
        height: 100px
        width: 100px
        display: flex
        align-items: center
        justify-content: center
        margin: 0 auto

        img
          display: block
          max-width: 100px
          max-height: 100px

    @media screen and (max-width: 600px)
      li
        display: block
        margin: 0 auto 20px auto

  ul::-webkit-scrollbar
    width: 6px
    background-color: transparent

  ul::-webkit-scrollbar-track
    background-color: transparent

  ul::-webkit-scrollbar-thumb
    background-color: #fff
    border-radius: 3px

  .close
    position: absolute
    right: 20px
    top: 20px
    cursor: pointer
    width: 24px
    height: 24px

    img
      display: block
      width: 24px
      height: 24px

  .no-portal
    text-align: center
    font-size: 12px
    padding: 50px 0
</style>
