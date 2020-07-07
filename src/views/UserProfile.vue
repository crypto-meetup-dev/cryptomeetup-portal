<template>
  <div>
    <div :class="['country-detail', {'is-active': userProfileShow}]">
      <div class="globe-control">
        <div style="position: absolute;top: 2rem;left: 5rem;">
          <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="userProfileShow"
                  @click="CloseUserProfileView"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
        </div>
      </div>
      <h1  v-show="userProfileShow" class="pc-about-h1">
        <div class="content pc-content">
          <img class="avatar" :src="url + this.userProfile.avatar" />
          <div class="status-line">
            <offline @detected-condition="handleConnectivityChange">
                <div slot="online" class="status">
                  <div class="green-circle"></div>
                  <div class="online-status">{{$t('online')}}</div>
                </div>
                <div slot="offline" class="status">
                  <div class="red-circle"></div>
                  <div class="offline-status">{{$t('offline')}}</div>
                  <div class="last-seen"></div>
                </div>
              </offline>
          </div>
          <div class="name">{{ this.userProfile.nickname }}</div>
          <div class="introduction">{{ this.userProfile.introduction }}</div>
          <a class="matataki-link" :href=" 'https://matataki.io/user/' + this.userProfile.id">
            <img class="matataki-logo" src="../../public/matataki-white.svg" />
          </a>
        </div>
      </h1>
    </div>
    <!-- mobile -->
    <b-modal :active.sync="mobileUserProfile" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div class="about-box">
        <h1  v-show="mobileUserProfile">
          <div class="content">
            
          </div>
        </h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import offline from 'v-offline';

const pathConfig = require('../config/env.json')

export default {
  components: {
    offline
  },
  props: {
    userProfileShow: {
      type: Boolean,
      default: false,
    },
    mobileUserProfileShow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      mobileUserProfile: false,
      url: pathConfig.MTTKIMGCDN
    }
  },
  created () {
    this.mobileUserProfile = this.mobileUserProfileShow
  },
  methods: {
    CloseUserProfileView() {
      this.$emit('CloseUserProfileView', null);
    },
    handleConnectivityChange(status) {
    }
  },
  watch: {
    mobileUserProfileShow(showing) {
      // if (showing === false) {
      //   this.$emit('CloseMobileAboutView', null);
      // }
      this.mobileAbout = showing
      if (!showing) {
        this.$emit('CloseMobileUserProfileView', null);
      }
    },
  },
  computed: {
    ...mapState(['userProfile'])
  },
  mounted() {
    console.log(this)
  },
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

.about-box
  padding-right: 20px

.country-detail
  position: absolute
  left: 0
  top: 0
  height: 100%
  z-index: 2
  pointer-events: none
  transition: background .5s ease-out
  width: 550px
  display: flex
  flex-direction: column

  &.is-active
    pointer-events: auto
    background: rgba(#000, 0.8)

  +mobile
    width: 100%

.globe-control
  margin: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: flex-end
  align-items: center

  &-item
    margin-left: 1rem
    pointer-events: auto

  +mobile
    height: $app-nav-height
    margin: 0

.status-line
  margin-top: 1.5rem
  align-content: center
  align-items: center
  text-align: center
  justify-content: center
  font-weight: 500
  color: black

.status
  padding: 0.8rem
  background-color: white
  width: fit-content
  height: auto
  border-radius: 1rem
  display: flex;
  align-items: center;
  margin: 0 auto;

.online-status 
  position: relative
  display: inline-block
  padding-right: 1rem

.green-circle
  display: inline-block
  position: relative
  width: 1.1rem
  height: 1.1rem
  margin-left: 1rem
  margin-right: 1rem
  border-radius: 50%
  background-color: #269D36

.offline-status
  position: relative
  display: inline-block
  padding-right: 1rem

.red-circle
  position: absolute
  width: 1rem
  height: 1rem
  left: 40%
  margin-top: 3px;
  border-radius: 50%
  background-color: #D83434

.content
  margin-top: 5rem
  padding-right: 20px
  justify-content: center
  align-items: center
  text-align: center

.avatar 
  width: 200px
  height: 200px
  border-radius: 100px


.name 
  margin-top: 1.5rem
  font-size: 2rem
  font-weight: 500 

.introduction
  font-size: 1.2rem
  margin-top: 1.5rem

.matataki-logo
  width: 50px
  margin-top: 3rem
  
.pc-content
  padding-left: 20px
  padding-right: 20px

.pc-about-h1
  overflow-y: scroll
  padding-bottom: 40px

.pc-about-h1::-webkit-scrollbar
  width: 6px
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-track
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-thumb
  background-color: #fff
  border-radius: 3px
</style>
