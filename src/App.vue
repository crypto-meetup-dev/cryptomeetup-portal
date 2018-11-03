<template>
  <div id="app">
    <div class="app-nav is-hidden-mobile" v-show="!tokenShow">
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
      <a @click="tokenShow=!tokenShow">{{$t('token_view')}}</a>
      <a style="margin-left: 1rem" @click="aboutShow=!aboutShow">{{$t('about_view')}}</a>

    </div>
    <div :class="['country-detail', {'is-active': tokenShow}]">
      <div class="globe-control">
        <div style="position: absolute;top: 2rem;left: 5rem;">
          <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="tokenShow"
                  @click="tokenShow=!tokenShow">
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
        </div>
        <div class="country-content payoutComponent" v-show="tokenShow">
          <b-tabs size="is-small" position="is-centered">
            <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
              <div class="payoutpoolTab">
                <img class="CMU_TOKEN" src="./assets/CMU_Token_Logo.png" alt="CMU_Token">
                <div style="padding: 1rem;">
                  <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{5104.7280}} CMU</b></h3>
                  <h3 class="title">{{$t('my_dividend')}}: <b style="color:  #fff">{{dividendInfo.dividend}} CMU</b></h3>
                </div>
              </div>
              <button class="button" @click="claim">{{$t('claim_btn')}}</button>
            </b-tab-item>
            <b-tab-item :label="$t('my_assets_tab')" icon="account">
              <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos}}</b></h3>
                <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu}}</b></h3>
            </b-tab-item>
            <b-tab-item :label="$t('stake_tab')" icon="bank">
              <section class="section">
                <h3 class="title">{{$t('my_staked')}}: <b style="color:  #fff">
                {{(stakedInfo.staked / 10000).toFixed(4).toString()}} CMU</b></h3>
                <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
                {{(globalInfo.total_staked / 10000).toFixed(4).toString()}} CMU</b></h3>
                <button class="button" @click="stake">{{$t('stake_btn')}}</button>
                <button class="button" @click="unstake">{{$t('unstake_btn')}}</button>
              </section>
            </b-tab-item>
            <b-tab-item :label="$t('bancor_trade_tab')" icon="chart-pie">
              <!-- <h3>Trade CMU Token</h3> -->
              <h3 class="title">{{$t('contract_supply')}}: <b style="color:  #fff">{{marketInfo.supply}} </b></h3>
              <h3 class="title">{{$t('contract_balance')}}: <b style="color:  #fff">{{marketInfo.balance}} </b></h3>
              <h3 class="title">{{$t('contract_price')}}: <b style="color:  #fff">{{marketInfo.coin_price}} </b></h3>
              <button class="button" @click="buyCMU">{{$t('buy_btn')}}</button>
              <button class="button" @click="sellCMU">{{$t('sell_btn')}}</button>
            </b-tab-item>
          </b-tabs>

        </div>
      </div>
    </div>
    <div :class="['country-detail', {'is-active': aboutShow}]">
      <div class="globe-control">
        <div style="position: absolute;top: 2rem;left: 5rem;">
          <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="aboutShow"
                  @click="aboutShow=!aboutShow"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
        </div>

      </div>
      <h1  v-show="aboutShow">Waiting to develop</h1>
      </div>
    <div class="app-footer">
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://twitter.com/EOSCryptomeetup"><b-icon icon="twitter" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://t.me/cryptomeetup_player"><b-icon icon="telegram" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile">Created by CryptoMeetup Team</div>
      <div class="footer-item is-hidden-mobile">Powered by <a target="_blank" href="https://eos.io/">EOSIO</a></div>
      <div class="footer-item" v-if="globalInfo">{{$t('last_buyer')}}: <b>{{ globalInfo.last | moment('calendar') }}</b> </div>
      <div class="footer-item" v-if="globalInfo">{{$t('count_down')}}: <b>{{ globalCountdown }}</b> </div>
      <div class="footer-item" v-if="globalInfo">Prize Pool: <b>{{ globalInfo.pool }} EOS </b> </div>
      <div class="footer-item is-hidden-mobile">
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
        <a class="app-nav-expand-item" @click="mobileNavExpanded=false;mobileTokenShow=!mobileTokenShow;"><b-icon icon="bank" size="is-small" />{{' '+$t('token_view')}}</a>
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
    <b-modal :active.sync="mobileTokenShow" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <div class="payoutComponent" style="margin-top:3rem;">
        <b-tabs size="is-small" position="is-centered">
          <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
            <div class="payoutpoolTab">
              <img class="CMU_TOKEN" src="./assets/CMU_Token_Logo.png" alt="CMU_Token">
              <div style="padding: 1rem;">
                <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{0/0}} CMU</b></h3>
                <h3 class="title">{{$t('my_dividend')}}: <b style="color:  #fff">{{balances.total_dividend * stakedInfo.staked / 100}} CMU</b></h3>
              </div>
            </div>
            <button class="button" @click="claim">{{$t('claim_btn')}}</button>
          </b-tab-item>
          <b-tab-item :label="$t('my_assets_tab')" icon="account">
            <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos}}</b></h3>
            <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu}}</b></h3>
          </b-tab-item>
          <b-tab-item :label="$t('stake_tab')" icon="bank">
            <h3 class="title">{{$t('my_staked')}}: <b style="color:  #fff">
            {{(stakedInfo.staked / 10000).toFixed(4).toString()}} CMU</b></h3>
            <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
            {{(stakedInfo.staked / 10000).toFixed(4).toString()}} CMU</b></h3>
            <button class="button" @click="stake">{{$t('stake_btn')}}</button>
            <button class="button" @click="unstake">{{$t('unstake_btn')}}</button>
          </b-tab-item>
          <b-tab-item :label="$t('bancor_trade_tab')" icon="chart-pie">
            <!-- <h3>Trade CMU Token</h3> -->
            <h3 class="title">{{$t('contract_supply')}}: <b style="color:  #fff">{{marketInfo.supply}} </b></h3>
            <h3 class="title">{{$t('contract_balance')}}: <b style="color:  #fff">{{marketInfo.balance}} </b></h3>
            <h3 class="title">{{$t('contract_price')}}: <b style="color:  #fff">{{marketInfo.coin_price}} </b></h3>
            <button class="button" @click="buyCMU">{{$t('buy_btn')}}</button>
            <button class="button" @click="sellCMU">{{$t('sell_btn')}}</button>
          </b-tab-item>
        </b-tabs>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import API from './util/api';

function padTimeZero(str) {
  const t = `00${str}`;
  return t.slice(t.length - 2, t.length);
}

export default {
  name: 'App',
  data: () => ({
    mobileNavExpanded: false,
    tokenShow: false,
    aboutShow: false,
    globalCountdown: '00:00:00',
    mobileTokenShow: false,
  }),
  created() {
    this.countdownUpdater = setInterval(() => {
      if (this.globalInfo != null) {
        const currentTimestamp = ~~(Date.now() / 1000);
        if (currentTimestamp >= this.globalInfo.ed) {
          this.globalCountdown = 'ENDED';
        } else {
          let remaining = this.globalInfo.ed - currentTimestamp;
          const seconds = remaining % 60;
          remaining = ~~(remaining / 60);
          const minutes = remaining % 60;
          remaining = ~~(remaining / 60);
          const hours = remaining;
          this.globalCountdown = `${padTimeZero(hours)}:${padTimeZero(minutes)}:${padTimeZero(seconds)}`;
        }
      }
    }, 1000);
  },
  methods: {
    ...mapActions(['connectScatterAsync', 'updateLandInfoAsync', 'loginScatterAsync', 'logoutScatterAsync', 'updateMarketInfoAsync', 'getGlobalInfo']),
    async stake() {
      const amount = prompt('你要抵押多少CMU？ （输入如： 1.0000 CMU， 保留后四位小数点）');
      try {
        const result = await API.stakeCMUAsync({
          from: this.scatterAccount.name,
          to: 'cryptomeetup',
          memo: 'stake',
          amount,
        });
        this.$dialog.alert({
          type: 'is-black',
          title: 'CMU 代币抵押成功',
          message: '稍后留意 My Staked',
          confirmText: '好的',
        });
      } catch (error) {
        alert(error.message);
      }
    },
    async unstake() {
      alert('撤销抵押会将全部抵押CMU撤销，在72小时后才能领回抵押的CMU');
      try {
        // const result = await API.
      } catch (error) {

      }
    },
    async claim() {
      try {
        const contract = await store.store.scatter.contract("cryptomeetup")
        await contract.claim(
            store.store.account.name,
            {
              authorization: [`${store.store.account.name}@${store.store.account.authority}`]
            }
        )
        this.$notify.success({
          title: "提取成功",
          message: "请耐心等待"
        });
      } catch (error) {
        this.$notify.error({
          title: "提取失败",
          message: error.message
        });
      }
    },
    async buyCMU() {
      const amount = prompt('你要购买多少EOS等值的CMU？ （输入如： 1.0000 EOS， 保留后四位小数点）');
      try {
        const result = await API.transferTokenAsync({
          from: this.scatterAccount.name,
          to: 'cryptomeetup',
          memo: 'buy',
          amount,
        });
        this.$dialog.alert({
          type: 'is-black',
          title: 'CMU 代币购买成功',
          message: '稍后留意 CMU 余额变动',
          confirmText: '好的',
        });
      } catch (error) {
        alert(error.message);
      }
    },
    async sellCMU() {
      const amount = prompt('你要卖出多少CMU？ （输入如： 1.0000 CMU，保留后四位小数点');
      try {
        const result = await API.transferTokenAsync({
          from: this.scatterAccount.name,
          to: 'cryptomeetup',
          tokenContract: 'dacincubator',
          memo: 'sell',
          amount,
        });
        this.$dialog.alert({
          type: 'is-black',
          title: 'CMU 成功卖出',
          message: '稍后留意 EOS 余额变动',
          confirmText: '好的',
        });
      } catch (error) {
        alert(error.message);
      }
    },
  },
  computed: {
    ...mapState(['landInfoUpdateAt', 'isScatterConnected', 'scatterAccount', 'isScatterLoggingIn', 'balances', 'marketInfo', 'stakedInfo', 'globalInfo', 'dividendInfo']),
    ...mapState('ui', ['navBurgerVisible']),
  },
  mounted() {
    this.connectScatterAsync();
    this.updateLandInfoAsync();
    this.updateMarketInfoAsync();
    this.getGlobalInfo();
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
.payoutComponent
  .title
    font-size: 1rem;
.payoutpoolTab
  display: flex;
  flex-direction: row;
  align-items: center;
.CMU_TOKEN
  width: 8rem;
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

.country-content
  flex: 1
  margin: 2rem
  overflow: auto
  margin-top: 4rem

  .section
    padding-left: 0
    padding-right: 0
    padding-top: 0

  +mobile
    margin: 1rem

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

</style>
