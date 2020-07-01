<template>
  <div id="app">
    <!--<GlobalProgress v-show="globalProgressVisible" :progress="globalProgressValue" />-->
    <Loading v-show="globalProgressVisible" loadText="loading ..." />
    <!--<GlobalSpinner v-show="!globalProgressVisible && globalSpinnerVisible" />-->
    <Loading v-show="!globalProgressVisible && globalSpinnerVisible" loadText="loading ..." />
    <!--<div class="app-nav is-hidden-mobile" v-show="!tokenShow">-->
    <myPortal v-if="portalShow" :portalList="portalList" @closeMyPortal="closeMyPortal" />
    <div class="app-nav is-hidden-mobile">
      <div class="popip-container">
        <button for="login-popup" id="login-popup" :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isLoggingIn }]"
        @click="login"
        v-if="isLoggingIn || appLogin"
        >
          <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
        </button>
      </div>
      <div class="popup">
        <label for="login-popup"></label>
        <div class="inner">
          <div class="title">
            <h6>LOGIN</h6>
            <label for="login-popup">
              <i class="fa fa-times"></i>
            </label>
          </div>
          <div class="content">
            <ul>
              <li>
                <input type="text" placeholder="Username">
              </li>
              <li>
                <input type="password" placeholder="Password">
              </li>
              <li>
                <button type="submit">Login</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined']"
        @click="logout"
        v-if="isScatterConnected && scatterAccount"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('logout')}} {{ account.name}}
      </button>
      <router-link v-if="modulesConfig[contractType].map" class="nav-item" to="/map">{{$t('map')}}</router-link>
      <router-link v-if="modulesConfig[contractType].map" class="nav-item" to="/globe">{{$t('globe')}}</router-link>
      <a v-if="modulesConfig[contractType].token" class="nav-item" @click="tokenShow=!tokenShow">{{$t('token_view')}}</a>
      <a class="nav-item" @click="aboutShow=!aboutShow">{{$t('about_view')}}</a>
      <a v-if="modulesConfig[contractType].map" class="nav-item" @click="taggleMyPortal">{{$t('my_portal_nav')}}</a>
    </div>
    <Tokenview
      v-if="modulesConfig[contractType].token"
      :tokenShow="tokenShow"
      :mobileTokenShow="mobileTokenShow"
      :globalInfo="globalInfo"
      @CloseTokenView="CloseTokenView"
      @CloseMobileTokenView="CloseMobileTokenView"
      @login="login"
    />
    <Aboutview
      :aboutShow="aboutShow"
      :mobileAboutShow="mobileAboutShow"
      @CloseAboutView="CloseAboutView"
      @CloseMobileAboutView="CloseMobileAboutView"
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
          <router-link v-if="modulesConfig[contractType].map" class="app-nav-expand-item" to="/">Map</router-link>
          <router-link v-if="modulesConfig[contractType].map" class="app-nav-expand-item" to="/globe">Globe</router-link>

          <a class="app-nav-expand-item" v-if="modulesConfig[contractType].map" @click="taggleMyPortal">{{$t('my_portal_nav')}}</a>
          <a class="app-nav-expand-item" @click="mobileAboutShow=!mobileAboutShow;"><b-icon class="question-icon" pack="fas" icon="question-circle" size="is-small"></b-icon>
  {{' '+$t('about_view')}}</a>
          <a class="app-nav-expand-item" v-if="modulesConfig[contractType].token" @click="mobileTokenShow=!mobileTokenShow;"><b-icon icon="bank" size="is-small" />{{' '+$t('token_view')}}</a>
          <a class="app-nav-expand-item" target="_blank" href="https://twitter.com/Cryptomeetupio"><b-icon icon="twitter" size="is-small" /> Twitter</a>
          <a class="app-nav-expand-item" target="_blank" href="https://t.me/Cryptomeetup_Official"><b-icon icon="telegram" size="is-small" /> Telegram</a>
          <a class="app-nav-expand-item" target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /> Discord</a>
          <a class="app-nav-expand-item" target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /> Medium</a>
          <a class="app-nav-expand-item" target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /> Reddit</a>
          <a class="app-nav-expand-item" target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /> GitHub</a>
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
import Tokenview from '@/views/Token.vue';
import getApi from '@/util/apis/index.js'
// import GlobalSpinner from '@/components/GlobalSpinner.vue';
import Loading from '@/components/Loading.vue';
// import GlobalProgress from '@/components/GlobalProgress.vue';
import InviteModal from '@/components/InviteModal.vue';
import myPortal from '@/components/landmark//myPortal.vue'

export default {
  name: 'App',
  components: {
    Loading,
    //  GlobalSpinner,
    //  GlobalProgress,
    Aboutview,
    Tokenview,
    InviteModal,
    myPortal
  },
  data: () => ({
    mobileNavExpanded: false,
    tokenShow: false,
    aboutShow: false,
    globalCountdown: '00:00:00',
    mobileTokenShow: false,
    mobileAboutShow: false,
    isInviteDialogActive: false,
    appLogin: false,
    i18nCode: '',
    updateContract: '',
    portalShow: false,
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
    ...mapActions(['login', 'logout']),
    CloseAboutView() {
      this.aboutShow = !this.aboutShow;
    },
    CloseTokenView() {
      this.tokenShow = !this.tokenShow;
    },
    CloseMobileAboutView() {
      this.mobileAboutShow = !this.mobileAboutShow;
    },
    CloseMobileTokenView() {
      this.mobileTokenShow = !this.mobileTokenShow;
    },
    changeInviteStatus() {
      this.isInviteDialogActive = true;
    },
    taggleMyPortal () {
      this.portalShow = !this.portalShow
    },
    closeMyPortal () {
      this.portalShow = false
    },
    getLangCode () {
      const language = localStorage.getItem('language') || (navigator.language.toLowerCase() === 'zh-tw' ? 'zh_tw' : navigator.language.split('-')[0])
      this.i18nCode = ['en', 'ja', 'ko', 'ru', 'zh', 'zh_tw'].includes(language) ? language : 'en'
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
    ...mapState(['modulesConfig', 'contractType', 'landInfoUpdateAt', 'isScatterConnected', 'scatterAccount', 'isLoggingIn', 'balances', 'marketInfo', 'stakedInfo', 'globalInfo', 'dividendInfo', 'myCheckInStatus']),
    ...mapState('ui', ['navBurgerVisible', 'latestBuyerVisible', 'globalSpinnerVisible', 'globalProgressVisible', 'globalProgressValue']),
  },
  mounted() {
  },
  beforeDestroy () {
    Global.$off('onLoadMap')
    Global.$off('portalList')
  },
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
</style>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #e3f6f5;
}

.popup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.popup-container .button {
  height: 40px;
  line-height: 40px;
  background: #272643;
  padding: 0 30px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
}
.popup-container .popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: 400ms all;
}
.popup-container .popup > label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.popup-container .popup .inner {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  min-width: 300px;
  box-sizing: border-box;
  transition: 400ms all;
  z-index: 10;
  max-height: 100%;
  overflow: auto;
  border-radius: 10px;
}
.popup-container .popup .inner .title {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  position: sticky;
  top: 0;
  background: #fff;
}
.popup-container .popup .inner .title h6 {
  font-size: 15px;
  font-weight: 500;
}
.popup-container .popup .inner .title label {
  font-size: 14px;
  color: #999;
  cursor: pointer;
}
.popup-container .popup .inner .title label:hover {
  color: #222;
}
.popup-container .popup .inner .content {
  padding: 5px 15px 15px;
}
.popup-container .popup .inner .content ul li {
  margin-bottom: 15px;
}
.popup-container .popup .inner .content ul li:last-child {
  margin-bottom: 0;
}
.popup-container .popup .inner .content ul li input {
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  font-size: 12px;
}
.popup-container .popup .inner .content ul li input:focus {
  outline: 0;
  border-color: #272643;
}
.popup-container .popup .inner .content ul li button {
  width: 100%;
  height: 30px;
  border-radius: 25px;
  border: none;
  background: #272643;
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
}
.popup-container .popup .inner .content p {
  font-size: 13px;
  line-height: 130%;
  margin-bottom: 15px;
}
.popup-container .popup .inner .content p:last-child {
  margin-bottom: 0;
}
.popup-container .popup .inner .content .close-btn {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}
.popup-container .popup .inner .content .close-btn label {
  background: rgba(0, 0, 0, 0.05);
  display: block;
  line-height: 30px;
  text-align: center;
  font-size: 13px;
  color: #444;
  border-radius: 3px;
  cursor: pointer;
}
.popup-container .popup .inner .content .close-btn label:hover {
  background: rgba(0, 0, 0, 0.1);
}
.popup-container > input {
  position: absolute;
  left: -9999px;
  opacity: 0;
}
.popup-container > input:checked + .popup {
  opacity: 1;
  visibility: visible;
}
.popup-container > input:checked + .popup .inner {
  top: 50%;
}

</style>
