<template>
  <div id="app">
    <!--<GlobalProgress v-show="globalProgressVisible" :progress="globalProgressValue" />-->
    <Loading v-show="globalProgressVisible" loadText="Loading ..." />
    <!--<GlobalSpinner v-show="!globalProgressVisible && globalSpinnerVisible" />-->
    <Loading v-show="!globalProgressVisible && globalSpinnerVisible" loadText="Loading ..." />
    <!--<div class="app-nav is-hidden-mobile" v-show="!tokenShow">-->
    <myPortal v-if="portalShow" :portalList="portalList" @closeMyPortal="closeMyPortal" />
    <div class="app-nav is-hidden-mobile">
      <div class="popup-container">
        <button class="user-profile" :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined']"
        v-show="isLoggingIn"
        @click="userProfileShow=!userProfileShow"
        >
          <b-icon icon="account" size="is-small" /><span id="nickname">&nbsp;{{ nicknameExist }}</span>
        </button>

        <button class="popup-opener" :class="['nav-item', 'button', 'is-hidden-mobile', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isLoggingIn }]"
        v-show="!isLoggingIn"
        @click="openOverlay" >
          <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
        </button>
        
      </div>
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined']"
        @click="logout"
        v-if="isLoggingIn"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('logout')}}
      </button>
      <router-link v-if="modulesConfig[contractType].map" class="nav-item" to="/map">{{$t('map')}}</router-link>
      <router-link v-if="modulesConfig[contractType].map" class="nav-item" to="/globe">{{$t('globe')}}</router-link>
      <a class="nav-item" @click="aboutShow=!aboutShow">{{$t('about_view')}}</a>
    </div>
    <div id="popup-overlay" v-show="!isLoggingIn">
        <div id="popup-tablecellWrap" >
            <div id="popup-closer"></div>
            <div id="popup-wrapper">
                <div class="popup-content">
                    <h2 class="popup-title">Login</h2>
                    <h4>Use <span class="mtt-name">Matataki.io</span> Account to Login</h4>
                    <form action="" class="popup-form" @keyup.enter="login({ email: email, password: password, loginSuccessMsg: $t('loginSuccess'), loginFailedMsg: $t('loginFailed') })">
                        <input type="text" name="form-email" class="popup-form-field" placeholder="Email Address"
                            maxlength="50" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required v-model="email">
                        <input type="password" name="form-password" class="popup-form-field" placeholder="Password"
                            maxlength="50" v-model="password">
                        <input type="button" class="popup-form-submit" id="login-btn" :value="$t('login')" @click="login({ email: email, password: password, loginSuccessMsg: $t('loginSuccess'), loginFailedMsg: $t('loginFailed') })">
                    </form>
                </div>
            </div>
        </div>
      </div>
    <Aboutview
      :aboutShow="aboutShow"
      :mobileAboutShow="mobileAboutShow"
      @CloseAboutView="CloseAboutView"
      @CloseMobileAboutView="CloseMobileAboutView"
    />
    <UserProfileview
      v-if="userProfileShow"
      :userProfileShow="userProfileShow"
      :mobileUserProfileShow="mobileUserProfileShow"
      @CloseUserProfileView="CloseUserProfileView"
      @CloseMobileUserProfileView="CloseMobileUserProfileView"
    />
    <div class="app-footer">
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://twitter.com/Cryptomeetupio"><b-icon icon="twitter" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://t.me/Cryptomeetup_Official"><b-icon icon="telegram" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile">{{$t('cmu_creator')}}</div>
      <div class="footer-item is-hidden-mobile">{{$t('powered_by')}} <a target="_blank" href="https://eos.io/">EOSIO</a></div>
      <div class="footer-item" v-if="globalInfo && latestBuyerVisible">{{$t('last_buyer')}}: <b>{{ globalInfo.last }}</b> </div>
      <div class="footer-item" v-if="globalInfo && latestBuyerVisible">{{$t('count_down')}}: <b>{{ globalCountdown }}</b> </div>
      <div class="footer-item" v-if="globalInfo && latestBuyerVisible">
        {{$t('prize_pool')}}: <b>{{ globalInfo.pool | price('CMU') }}</b>
        <b-tooltip
          :label="$t('app_FTextBubble')"
          position="is-top">
          <a href="https://kyubey.network/Token/CMU/exchange" target="_blank"><b-icon class="question-icon" pack="fas" type="is-white" icon="question-circle" size="is-middle" /></a>
        </b-tooltip>
      </div>
      <div class="footer-item is-hidden-mobile">
        <b-select class="is-inverted" v-model="i18nCode" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="ru">русский</option>
          <option value="zh">简体中文</option>
          <option value="zh_tw">繁體中文</option>
        </b-select>
      </div>
      <div class="footer-item is-hidden-mobile">
        <b-select class="is-inverted" v-model="updateContract" placeholder="选择公链" size="is-small" rounded>
          <option value="eos">EOS</option>
          <option value="bos">BOS</option>
        </b-select>
      </div>
    </div>
    <a
      :class="['app-nav-burger', 'is-hidden-tablet', { 'is-active': mobileNavExpanded }]"
      v-show="navBurgerVisible"
    >
      <a @click="mobileNavExpanded = !mobileNavExpanded">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <button :class="['app-map-login', 'nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isLoggingIn }]"
        @click="login"
        v-if="!appLogin"
      >
        {{$t('login')}}
      </button>
    </a>
    <slide-y-up-transition>
      <div>
        <div class="app-nav-expand is-hidden-tablet app-app-nav-expand" v-show="navBurgerVisible && mobileNavExpanded" @click="mobileNavExpanded=false"><!-- Nav Items on mobile -->
          <div class="app-nav-expand-item user-profile is-small"
            v-show="isLoggingIn"
            @click="userProfileShow=!userProfileShow"
          >
            <b-icon icon="account" size="is-small" />&nbsp;{{ nicknameExist }}
          </div>

          <div class="popup-opener app-nav-expand-item" :class="['is-small', { 'is-loading': isLoggingIn }]"
            v-show="!isLoggingIn"
            @click="openOverlay" >
            <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
          </div>
          <div :class="['app-nav-expand-item', 'is-small']"
            @click="logout"
            v-if="isLoggingIn"
          >
            <b-icon icon="account" size="is-small" />&nbsp;{{$t('logout')}}
          </div>
          <router-link v-if="modulesConfig[contractType].map" class="app-nav-expand-item" to="/"><b-icon icon="map" size="is-small" />&nbsp;Map</router-link>
          <router-link v-if="modulesConfig[contractType].map" class="app-nav-expand-item" to="/globe"><b-icon icon="earth" size="is-small" />&nbsp;Globe</router-link>
          <a class="app-nav-expand-item" @click="mobileAboutShow=!mobileAboutShow;"><b-icon class="question-icon" pack="fas" icon="question-circle" size="is-small"></b-icon>
          {{' '+$t('about_view')}}</a>
          <a class="app-nav-expand-item" target="_blank" href="https://twitter.com/Cryptomeetupio"><b-icon icon="twitter" size="is-small" /> Twitter</a>
          <a class="app-nav-expand-item" target="_blank" href="https://t.me/Cryptomeetup_Official"><b-icon icon="telegram" size="is-small" /> Telegram</a>
          <a class="app-nav-expand-item" target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /> Discord</a>
          <a class="app-nav-expand-item" target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /> Medium</a>
          <a class="app-nav-expand-item" target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /> Reddit</a>
          <a class="app-nav-expand-item" target="_blank" href="https://github.com/crypto-meetup-dev/cryptomeetup-portal"><b-icon icon="github-circle" size="is-small" /> GitHub</a>
          <div class="app-nav-expand-item" @click.stop>
            <b-select class="is-inverted" v-model="i18nCode" icon="translate" :placeholder="$t('switch_lang')" size="is-small" rounded expanded>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="ru">русский</option>
              <option value="zh">简体中文</option>
              <option value="zh_tw">繁體中文</option>
            </b-select>
          </div>
        </div>
        <b-modal :active.sync="isInviteDialogActive" has-modal-card>
          <invite-modal></invite-modal>
        </b-modal>
      </div>
    </slide-y-up-transition>
    <keep-alive include="map-view,globe-view"><router-view/></keep-alive>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Global from './Global.js';
import Aboutview from '@/views/About.vue';
import UserProfileview from '@/views/UserProfile.vue'
import Notificationview from '@/views/Notifications.vue'
import Tokenview from '@/views/Token.vue';
import getApi from '@/util/apis/index.js'
// import GlobalSpinner from '@/components/GlobalSpinner.vue';
import Loading from '@/components/Loading.vue';
// import GlobalProgress from '@/components/GlobalProgress.vue';
import InviteModal from '@/components/InviteModal.vue';
import myPortal from '@/components/landmark//myPortal.vue'
import { getCookie, disassemble } from './util/cookies'
import { getUserProfile, getAvatarUrl } from '@/api/login'
import Axios from 'axios';

export default {
  name: 'App',
  components: {
    Loading,
    //  GlobalSpinner,
    //  GlobalProgress,
    Aboutview,
    Tokenview,
    InviteModal,
    myPortal,
    UserProfileview,
    Notificationview
  },
  data: () => ({
    mobileNavExpanded: false,
    tokenShow: false,
    userProfileShow: false,
    notificationShow: false,
    mobileNotificationShow: false,
    aboutShow: false,
    globalCountdown: '00:00:00',
    mobileTokenShow: false,
    mobileUserProfileShow: false,
    mobileAboutShow: false,
    isInviteDialogActive: false,
    appLogin: false,
    i18nCode: '',
    updateContract: '',
    portalShow: false,
    email: '',
    password: ''
  }),
  created() {
    this.modulesConfig[this.contractType].map && this.$router.push('/map')
    this.countdownUpdater = setInterval(() => {
      if (this.globalInfo != null) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (currentTimestamp >= this.globalInfo.ed) {
          this.globalCountdown = 'ENDED';
        } else {
          let remaining = this.globalInfo.ed - currentTimestamp;
          const seconds = `${remaining % 60}`;
          remaining = Math.floor(remaining / 60);
          const minutes = `${remaining % 60}`;
          remaining = Math.floor(remaining / 60);
          const hours = `${remaining}`;
          this.globalCountdown = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        }
      }
    }, 1000);

    Global.$on('onLoadMap', () => {
      this.appLogin = true
    })

    Global.$on('portalList', portalList => {
      this.portalList = portalList
    })

    this.getLangCode()
  },
  methods: {
    ...mapActions(['login', 'logout', 'setLoggedIn', 'setMapObject']),
    CloseNotificationView() {
      this.notificationShow = !this.notificationShow
    },
    CloseUserProfileView() {
      this.userProfileShow = !this.userProfileShow
    },
    CloseAboutView() {
      this.aboutShow = !this.aboutShow;
    },
    CloseMobileAboutView() {
      this.mobileAboutShow = !this.mobileAboutShow;
    },
    CloseMobileUserProfileView() {
      this.mobileAboutShow = !this.mobileUserProfileShow
    },
    CloseMobileNotificationView() {
      this.mobileNotificationShow = !this.mobileNotificationShow
    },
    getLangCode () {
      const language = localStorage.getItem('language') || (navigator.language.toLowerCase() === 'zh-tw' ? 'zh_tw' : navigator.language.split('-')[0])
      this.i18nCode = ['en', 'ja', 'ko', 'ru', 'zh', 'zh_tw'].includes(language) ? language : 'en'
    },
    openOverlay() {
      document.getElementById('popup-overlay').style.cssText = 'opacity: 0; display: table;';
      const elem = document.getElementById('popup-overlay');
      let opacity = 0;
      // eslint-disable-next-line no-use-before-define
      const id = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(id);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      document.getElementById('popup-closer').addEventListener('click', () => {
        document.getElementById('popup-overlay').style.cssText = 'display: none;';
      })
    }
  },
  watch: {
    i18nCode (val) {
      this.$i18n.locale = val
      localStorage.setItem('language', val)
    },
    updateContract (newVal, val) {
      if (val) {
        console.log(this.$route.path)
        if (this.$route.path.indexOf('map') && !this.modulesConfig[newVal].map) {
          this.$router.push('/')
        }
        
        Global.setGlobalContract(newVal)
        setTimeout(() => {
          this.updateContractType(newVal)
        }, 0)
      }
    }
  },
  computed: {
    ...mapState(['modulesConfig', 'contractType', 'landInfoUpdateAt', 'isScatterConnected', 'scatterAccount', 'isLoggingIn', 'balances', 'marketInfo', 'stakedInfo', 'globalInfo', 'dividendInfo', 'myCheckInStatus', 'userProfile', 'userId']),
    ...mapState('ui', ['navBurgerVisible', 'latestBuyerVisible', 'globalSpinnerVisible', 'globalProgressVisible', 'globalProgressValue']),
    nicknameExist() {
      if (this.userProfile) {
        return this.userProfile.nickname
      } 
      return ''
    }
  },
  mounted() {
    const c = getCookie('cryptomeetuptoken')
    if (c) {
      const res = disassemble(c)
      this.setLoggedIn(res)
    }
  },
  beforeDestroy () {
    Global.$off('onLoadMap')
    Global.$off('portalList')
  },
  destroyed() {
    Axios.get(process.env.VUE_APP_CMUAPI + '/user/update/status?id=' + this.userId + '&status=false')
  }
};
</script>
<style lang="sass">
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";
a:hover
  text-decoration: underline
.is-inverted > .select
  & select
    background: rgba(#000, 0.7)
    border-color: transparent
    color: #FFF
    &:hover
      border-color: rgba(#FFF, 0.4)
  &:not(.is-multiple):not(.is-loading):hover::after
    border-color: #FFF
.select select option
  color: #FFF
.modal-card
  box-shadow: 0 0 30px $primary
</style>

<style lang="sass" scoped>
#app
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: hidden
.app-nav
  position: absolute
  left: 2rem
  top: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: flex-start
.nav-item
  margin-right: 1rem
  color: rgba(#FFF, 0.8)
  user-select: none
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  &:hover
    color: #FFF
  &.router-link-exact-active
    color: $primary
.app-footer
  position: absolute
  left: 2rem
  right: 2rem
  bottom: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  a:hover
    text-decoration: none
.footer-item
  margin: 0 0.5rem
  font-size: $size-7
.app-nav-burger
  position: relative
  left: 0
  top: 0
  z-index: 5
  color: #FFF
  +hamburger($app-nav-height)
  cursor:auto
  a
    display: block
    color: #FFF
    width: 3rem
    height: 3rem
    cursor: pointer
.app-nav-expand
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 4
  background: rgba(#000, 0.9)
  padding-top: $app-nav-height
  &-item
    display: block
    width: 100%
    padding: 1rem
    border-top: 1px solid rgba(#FFF, 0.2)
    color: #FFF
    font-size: $size-7
    &:hover
      text-decoration: none
      background: rgba(#FFF, 0.1)
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
.mobile-back-button
  width: $app-nav-height
  height: $app-nav-height
  margin: 0
  display: flex
  justify-content: center
  align-items: center
.country-select
  +mobile
    margin: 0 0.5rem 0 0
    width: calc(100vw - #{$app-nav-height} - 0.5rem)
  .back-button
     position: absolute !important
     top: 2px  !important
     left: 10px  !important
.badgeList
  margin: 1rem 0
.app-map-login
    position: absolute
    left: 5rem
    top: .6rem

.user-profile
  max-width: 128px;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: nowrap;

#nickname
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  white-space: normal; 
</style>
<style>

html {
  overflow-x: hidden;
  overflow-y: hidden;
}

/* core */

#popup-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 30;
}

#popup-tablecellWrap {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

#popup-closer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 35;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

#popup-wrapper {
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;
    z-index: 40;
}

/* content */

.mtt-name {
  color: #6c4be0;
}

.popup-content {
    border-radius: 20px;
    box-sizing: border-box;
    padding: 40px;
    background-color: #000;
    width: 380px;
}

.popup-form {
  margin-top: 1rem;
}

.popup-form-field {
    display: block;
    font-family: Arial, Arial, Helvetica, sans-serif;
    background-color: black;
    color: rgba(255, 216, 63, 1.000);
    font-size: 15px;
    line-height: 120%;
    height: 42px;
    width: 227px;
    border: none;
    box-sizing: border-box;
    padding: 17px 11px;
    margin: 0 auto 10px;
    border-bottom: 2px solid rgba(255, 216, 63, 1.000);
}

.popup-form-field:focus {
    outline: none;
}

.popup-form-submit {
    display: block;
    background-color: #1c2025;
    border: none;
    font-family: Arial, Arial, Helvetica, sans-serif;
    color: #fff;
    font-size: 23px;
    text-transform: uppercase;
    width: 228px;
    height: 60px;
    z-index: 5;
    box-sizing: border-box;
    cursor: pointer;
    margin: 1.5rem auto 0;
    border-radius: 10px;
}

.popup-form-submit:hover {
    background-color: #000;
    color: #fff;
    border: 3px solid rgba(255, 216, 63, 1.000);
}

.popup-form-submit:focus {
  outline: none;
}

.popup-title {
  font-family: Arial, Arial, Helvetica, sans-serif;
  color: #fff;
  font-size: 40px;
  line-height: 125%;
  letter-spacing: 1.3px;
  margin: 1rem 0 1rem 0;
}
.mapboxgl-marker-anchor-center {
  display: none
}
</style>
