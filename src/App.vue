<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <div id="info">
        <strong><a href="https://github.com/crypto-meetup-dev">Twitter</a></strong>
        <strong><a href="https://github.com/crypto-meetup-dev">Telegram</a></strong>
        <strong><a href="https://github.com/crypto-meetup-dev">Discord</a></strong>
        <strong><a href="https://github.com/crypto-meetup-dev">Github</a></strong>
        <span class="bull">&bull;</span> Created by CryptoMeetup Team
        <span class="bull">&bull;</span> Powered by <a href="https://eos.io/">EOSIO</a>
    </div>

    <div id="i18nInfo">
      <span id="year1990" class="item active">English</span>
      <span id="year1995" class="item">Chinese</span>
      <span id="year2000" class="item">Japanese</span>
    </div>

    <div id="title">
        World View | Meetup List | Token | Council | About
    </div>

    <div id="currentInfo">
      <span id="year1990" class="item">Earth</span>
      <span id="year1995" class="item active">Continent</span>
      <span id="year2000" class="item">Country</span>
    </div>
    <router-view/>
  </div>
</template>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983
</style>

<style type="text/css">
  #i18nInfo {
    position: absolute;
    top: 20px;
    width: 270px;
    right: 0px;
    background-color: rgba(0,0,0,0.2);
    border-radius: 3px;
    font: 20px Georgia;
    padding: 10px;
  }
  #info {
    font-size: 11px;
    position: absolute;
    bottom: 5px;
    background-color: rgba(0,0,0,0.8);
    border-radius: 3px;
    right: 10px;
    padding: 10px;
  }
  #currentInfo {
    width: 570px;
    position: absolute;
    left: 20px;
    top: 63px;
    background-color: rgba(0,0,0,0.2);
    border-top: 1px solid rgba(255,255,255,0.4);
    padding: 10px;
  }
  a {
    color: #aaa;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .bull {
    padding: 0 5px;
    color: #555;
  }
  #title {
    position: absolute;
    top: 20px;
    width: 570px;
    left: 20px;
    background-color: rgba(0,0,0,0.2);
    border-radius: 3px;
    font: 20px Georgia;
    padding: 10px;
  }
  .item {
    font: 16px Georgia;
    line-height: 26px;
    height: 30px;
    text-align: center;
    float: left;
    width: 90px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    -webkit-transition: all 0.1s ease-out;
  }
  .item:hover, .item.active {
    font-size: 23px;
    color: #fff;
  }
</style>
