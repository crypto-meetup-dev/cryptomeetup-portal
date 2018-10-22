<template>
  <div id="app">
    <div class="app-nav">
      <router-link class="nav-item" to="/">World View</router-link>
      <router-link class="nav-item" to="/list">List View</router-link>
    </div>
    <div class="app-footer">
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev">Twitter</a></div>
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev">Telegram</a></div>
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev">Discord</a></div>
      <div class="footer-item"><a href="https://github.com/crypto-meetup-dev">Github</a></div>
      <div class="footer-item">Created by CryptoMeetup Team</div>
      <div class="footer-item">Powered by <a href="https://eos.io/">EOSIO</a></div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: hidden
</style>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$primary: #21BEDA;
$primary-invert: findColorInvert($primary);

$colors: (
  "white": ($white, $black),
  "black": ($black, $white),
  "light": ($light, $light-invert),
  "dark": ($dark, $dark-invert),
  "primary": ($primary, $primary-invert),
  "info": ($info, $info-invert),
  "success": ($success, $success-invert),
  "warning": ($warning, $warning-invert),
  "danger": ($danger, $danger-invert),
);

$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>

<style lang="stylus" scoped>
.app-nav
  position: absolute
  left: 2rem
  top: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: start

.nav-item
  margin-right: 1rem
  color: rgba(255, 255, 255, 0.8)

  &:hover
    color: #FFF

  &.router-link-exact-active
    color: #21BEDA

.app-footer
  color: #FFF
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
  font-size: 0.75rem

  a:hover
    color: #21BEDA
    text-decoration: underline
</style>
