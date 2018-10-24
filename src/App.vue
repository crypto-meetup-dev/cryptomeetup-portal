<template>
  <div id="app">
    <div class="app-nav">
      <router-link class="nav-item" to="/">{{$t('world_view')}}</router-link>
      <!--<router-link class="nav-item" to="/list">List View</router-link>-->
    </div>
    <div class="app-footer">
      <div class="footer-item"><a href="https://twitter.com/EOSCryptomeetup">Twitter</a></div>
      <div class="footer-item"><a href="https://t.me/cryptomeetup_group">Telegram</a></div>
      <div class="footer-item"><a href="https://discordapp.com/invite/Ws3ENJf">Discord</a></div>      
      <div class="footer-item"><a href="https://medium.com/@cryptomeetup">Medium</a></div>
      <div class="footer-item"><a href="https://www.reddit.com/user/cryptomeetup">Reddit</a></div> 
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev">Github</a></div>           
      <div class="footer-item">Created by CryptoMeetup Team</div>
      <div class="footer-item">Powered by <a href="https://eos.io/">EOSIO</a></div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions(['initEosTools']),
  },
  created() {
    this.initEosTools();
  },
};
</script>


<style lang="sass">
@import "~bulma";
@import "~buefy/src/scss/buefy";

a:hover
  text-decoration: underline
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

.footer-item
  margin: 0 1rem
  font-size: $size-7
</style>
