<template>
  <div id="app">
    <div class="app-nav is-hidden-mobile">
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined', { 'is-loading': isScatterLoggingIn }]"
        @click="loginScatterAsync"
        v-if="isScatterConnected && !scatterAccount"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
      </button>
      <button :class="['nav-item', 'button', 'is-white', 'is-small', 'is-rounded', 'is-outlined']"
        @click="logoutScatterAsync"
        v-if="isScatterConnected && scatterAccount"
      >
        <b-icon icon="account" size="is-small" />&nbsp;{{$t('logout')}} {{scatterAccount.name}}
      </button>
      <router-link class="nav-item" to="/">{{$t('world_view')}}</router-link>
      <!--<router-link class="nav-item" to="/list">List View</router-link>-->
    </div>
    <div class="app-footer is-hidden-mobile">
      <div class="footer-item"><a target="_blank" href="https://twitter.com/EOSCryptomeetup"><b-icon icon="twitter" size="is-small" /></a></div>
      <div class="footer-item"><a target="_blank" href="https://t.me/cryptomeetup_player"><b-icon icon="telegram" size="is-small" /></a></div>
      <div class="footer-item"><a target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /></a></div>
      <div class="footer-item"><a target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /></a></div>
      <div class="footer-item"><a target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /></a></div>
      <div class="footer-item"><a target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item">Created by CryptoMeetup Team</div>
      <div class="footer-item">Powered by <a target="_blank" href="https://eos.io/">EOSIO</a></div>
      <div class="footer-item" v-if="landInfoUpdateAt">Last updated: {{ landInfoUpdateAt | moment('calendar') }} </div>
      <div class="footer-item">
        <b-select class="is-inverted" v-model="$i18n.locale" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">{{$t('English')}}</option>
          <option value="zh">{{$t('Chinese')}}</option>
          <option value="ja">{{$t('Japanese')}}</option>
        </b-select>
      </div>
    </div>
    <a
      :class="['app-nav-burger', 'is-hidden-tablet', { 'is-active': mobileNavExpanded }]"
      v-show="navBurgerVisible"
      @click="mobileNavExpanded = !mobileNavExpanded"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
    <slide-y-up-transition>
      <div class="app-nav-expand is-hidden-tablet" v-show="navBurgerVisible && mobileNavExpanded"><!-- Nav Items on mobile -->
        <a class="app-nav-expand-item" target="_blank" href="https://twitter.com/EOSCryptomeetup"><b-icon icon="twitter" size="is-small" /> Twitter</a>
        <a class="app-nav-expand-item" target="_blank" href="https://t.me/cryptomeetup_player"><b-icon icon="telegram" size="is-small" /> Telegram</a>
        <a class="app-nav-expand-item" target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /> Discord</a>
        <a class="app-nav-expand-item" target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /> Medium</a>
        <a class="app-nav-expand-item" target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /> Reddit</a>
        <a class="app-nav-expand-item" target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /> GitHub</a>
        <div class="app-nav-expand-item">
          <b-select class="is-inverted" v-model="$i18n.locale" icon="translate" :placeholder="$t('switch_lang')" size="is-small" rounded expanded>
            <option value="en">{{$t('English')}}</option>
            <option value="zh">{{$t('Chinese')}}</option>
            <option value="ja">{{$t('Japanese')}}</option>
          </b-select>
        </div>
      </div>
    </slide-y-up-transition>
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  data: () => ({
    mobileNavExpanded: false,
  }),
  methods: {
    ...mapActions(['connectScatterAsync', 'updateLandInfoAsync', 'loginScatterAsync', 'logoutScatterAsync']),
  },
  computed: {
    ...mapState(['landInfoUpdateAt', 'isScatterConnected', 'scatterAccount', 'isScatterLoggingIn']),
    ...mapState('ui', ['navBurgerVisible']),
  },
  mounted() {
    this.connectScatterAsync();
    this.updateLandInfoAsync();
    setInterval(() => {
      this.updateLandInfoAsync();
    }, 30 * 1000);
  },
};
</script>

<style lang="sass">
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

.footer-item
  margin: 0 0.5rem
  font-size: $size-7

.app-nav-burger
  position: absolute
  left: 0
  top: 0
  z-index: 5
  color: #FFF
  +hamburger($app-nav-height)

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
</style>
