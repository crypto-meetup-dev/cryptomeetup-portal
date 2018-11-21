<template>
  <div>
    <div :class="['country-detail', {'is-active': tokenShow}]">
      <div class="globe-control">
        <div style="position: absolute;top: 2rem;left: 5rem;">
          <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="tokenShow"
                  @click="CloseTokenView">
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
        </div>
        <div class="country-content payoutComponent" v-show="tokenShow" v-if="globalInfo && dividendInfo">
          <b-tabs size="is-small" position="is-centered">
            <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
              <div class="payoutpoolTab">
                <img class="CMU_TOKEN" src="../assets/CMU_Token_Logo.png" alt="CMU_Token">
                <div style="padding: 0.5rem;">
                  <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{ globalInfo.pool * 3.5 | price('CMU') }}</b></h3>
                  <h3 class="title">{{$t('my_dividend')}}: <b style="color:  #fff">{{ dividendInfo.pool_profit | price('CMU') }}</b></h3>
                </div>
              </div>
              <div style="display:flex;align-items:center;">
                <button style="margin-right:10px" class="button" @click="claim">{{$t('claim_btn')}}</button>
                <b-tooltip label="$t('token_FTextBubble')"
                    position="is-right" :multilined="true" size="is-large">
                    <b-icon class="question-icon" pack="fas" type="is-white" icon="question-circle" size="is-middle"></b-icon>
                </b-tooltip>
              </div>
            </b-tab-item>
            <b-tab-item v-if="scatterAccount" :label="$t('my_assets_tab')" icon="account">
              <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos}}</b></h3>
                <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu}}</b></h3>
            </b-tab-item>
            <b-tab-item :label="$t('stake_tab')" icon="bank">
              <section class="section">
                <h3 class="title" v-if="scatterAccount">{{$t('my_staked')}}: <b style="color:  #fff">
                {{stakedInfo.staked | price('CMU')}}</b></h3>
                <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
                {{globalInfo.total_staked | price('CMU')}}</b></h3>
                <button class="button" @click="stake" :disabled="!scatterAccount">{{$t('stake_btn')}}</button>
                <button class="button" @click="unstake" :disabled="!scatterAccount">{{$t('unstake_btn')}}</button>
                <button class="button" @click="loginScatterAsync" v-if="!scatterAccount">{{$t('login')}}</button>
              </section>
            </b-tab-item>
            <b-tab-item :label="$t('bancor_trade_tab')" icon="chart-pie">
              <!-- <h3>Trade CMU Token</h3> -->
              <h3 class="title">{{$t('contract_supply')}}: <b style="color:  #fff">{{marketInfo.supply}} </b></h3>
              <h3 class="title">{{$t('contract_balance')}}: <b style="color:  #fff">{{marketInfo.balance}} </b></h3>
              <h3 class="title">{{$t('contract_price')}}: <b style="color:  #fff">{{marketInfo.coin_price}} </b></h3>
              <button class="button" @click="buyCMU" :disabled="!scatterAccount">{{$t('buy_btn')}}</button>
              <button class="button" @click="sellCMU" :disabled="!scatterAccount">{{$t('sell_btn')}}</button>
              <button class="button" @click="loginScatterAsync" v-if="!scatterAccount">{{$t('login')}}</button>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
    <!-- mobile -->
    <b-modal :active.sync="mobileTokenShow" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;" v-if="globalInfo && dividendInfo">
      <div class="payoutComponent" style="margin-top:3rem;">
        <b-tabs size="is-small" position="is-centered">
          <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
            <div class="payoutpoolTab">
              <img class="CMU_TOKEN" src="../assets/CMU_Token_Logo.png" alt="CMU_Token">
              <div style="padding: 0.5rem;">
                <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{ globalInfo.pool * 3.5 | price('CMU') }}</b></h3>
                <h3 class="title" v-if="scatterAccount">{{$t('my_dividend')}}: <b style="color:  #fff">{{ dividendInfo.pool_profit | price('CMU')}}</b></h3>
              </div>
            </div>
            <div style="display:flex;align-items:center;">
            <button class="button" @click="claim">{{$t('claim_btn')}}</button>
              <b-tooltip label="You can claim your dividend if your Dividend balance larger than zero."
                  position="is-right" :multilined="true" size="is-small">
                  <b-icon class="question-icon" pack="fas" type="is-white" icon="question-circle" size="is-middle"></b-icon>
              </b-tooltip>
            </div>
          </b-tab-item>
          <b-tab-item :label="$t('my_assets_tab')" v-if="scatterAccount" icon="account">
            <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos}}</b></h3>
            <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu}}</b></h3>
          </b-tab-item>
          <b-tab-item :label="$t('stake_tab')" icon="bank">
            <h3 class="title" v-if="scatterAccount">{{$t('my_staked')}}: <b style="color:  #fff">
            {{stakedInfo.staked | price('CMU')}}</b></h3>
            <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
            {{globalInfo.total_staked | price('CMU')}}</b></h3>
            <button class="button" @click="stake" :disabled="!scatterAccount">{{$t('stake_btn')}}</button>
            <button class="button" @click="unstake" :disabled="!scatterAccount">{{$t('unstake_btn')}}</button>
            <button class="button" @click="loginScatterAsync" v-if="!scatterAccount">{{$t('login')}}</button>
          </b-tab-item>
          <b-tab-item :label="$t('bancor_trade_tab')" icon="chart-pie">
            <!-- <h3>Trade CMU Token</h3> -->
            <h3 class="title">{{$t('contract_supply')}}: <b style="color:  #fff">{{marketInfo.supply}} </b></h3>
            <h3 class="title">{{$t('contract_balance')}}: <b style="color:  #fff">{{marketInfo.balance}} </b></h3>
            <h3 class="title">{{$t('contract_price')}}: <b style="color:  #fff">{{marketInfo.coin_price}} </b></h3>
            <button class="button" @click="buyCMU" :disabled="!scatterAccount">{{$t('buy_btn')}}</button>
            <button class="button" @click="sellCMU" :disabled="!scatterAccount">{{$t('sell_btn')}}</button>
            <button class="button" @click="loginScatterAsync" v-if="!scatterAccount">{{$t('login')}}</button>
          </b-tab-item>
        </b-tabs>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    tokenShow: {
      type: Boolean,
      default: false,
    },
    mobileTokenShow: {
      type: Boolean,
      default: false,
    },
    globalInfo: {
      type: Object,
      default: null,
    },
    dividendInfo: {
      type: Object,
      default: null,
    },
    scatterAccount: {
      type: Object,
      default: null,
    },
    balances: {
      type: Object,
      default: null,
    },
    marketInfo: {
      type: Object,
      default: null,
    },
    stakedInfo: {
      type: Object,
      default: null,
    }
  },
  methods: {
    CloseTokenView() {
      this.$emit('CloseTokenView', null);
    },
    claim() {
      this.$emit('claim', null);
    },
    stake() {
      this.$emit('stake', null);
    },
    unstake() {
      this.$emit('unstake', null);
    },
    loginScatterAsync() {
      this.$emit('loginScatterAsync', null);
    },
    buyCMU() {
      this.$emit('buyCMU', null);
    },
    sellCMU() {
      this.$emit('sellCMU', null);
    },
  },
  watch: {
    mobileTokenShow(showing) {
      if (showing === false) {
        this.$emit('CloseMobileTokenView', null);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

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

.payoutComponent
  .title
    font-size: 1rem;
.payoutpoolTab
  display: flex;
  flex-direction: row;
  align-items: center;
.CMU_TOKEN
  width: 6rem;

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

</style>
