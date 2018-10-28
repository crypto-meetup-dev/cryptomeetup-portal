<template>
  <div id="app">
    <div class="app-nav">
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
    <div class="app-footer">
      <div class="footer-item"><a href="https://twitter.com/EOSCryptomeetup"><b-icon icon="twitter" size="is-small" /></a></div>
      <div class="footer-item"><a href="https://t.me/cryptomeetup_player"><b-icon icon="telegram" size="is-small" /></a></div>
      <div class="footer-item"><a href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /></a></div>
      <div class="footer-item"><a href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /></a></div>
      <div class="footer-item"><a href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /></a></div>
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item">Created by CryptoMeetup Team</div>
      <div class="footer-item">Powered by <a href="https://eos.io/">EOSIO</a></div>
      <div class="footer-item" v-if="landInfoUpdateAt">Last updated: {{ landInfoUpdateAt | moment('calendar') }} </div>
      <div class="footer-item">
        <b-select class="is-inverted" v-model="$i18n.locale" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">{{$t('English')}}</option>
          <option value="zh">{{$t('Chinese')}}</option>
          <option value="ja">{{$t('Japanese')}}</option>
        </b-select>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions(['connectScatterAsync', 'updateLandInfoAsync', 'loginScatterAsync', 'logoutScatterAsync']),
  },
  computed: {
    ...mapState(['landInfoUpdateAt', 'isScatterConnected', 'scatterAccount', 'isScatterLoggingIn']),
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
</style>
