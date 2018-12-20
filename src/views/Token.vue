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
        <div class="country-content payoutComponent" v-show="tokenShow" v-if="dividendInfo && globalInfo">
          <b-tabs size="is-small" position="is-centered">
            <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
              <div class="payoutpoolTab">
                <img class="CMU_TOKEN" src="../assets/CMU_Token_Logo.png" alt="CMU_Token">
                <div style="padding: 0.5rem;">
                  <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{totalDividend(globalInfo.total_staked, globalInfo.earnings_per_share)}}</b></h3>
                  <h3 v-if="scatterAccount" class="title">{{$t('my_dividend')}}: <b style="color:  #fff">{{myDividend(globalInfo.earnings_per_share, stakedInfo.staked, stakedInfo.payout)}}</b></h3>
                  <h3 v-if="dividendInfo" class="title">{{$t('jackpot_income')}}: <b style="color:  #fff">{{dividendInfo.game_profit ? `${dividendInfo.game_profit.div(10000).toDecimal(4)} EOS` : '0.0000 EOS'}}</b></h3>                  
                  <h3 v-if="dividendInfo" class="title">{{$t('share_income')}}: <b style="color:  #fff">{{dividendInfo.ref_profit ? `${dividendInfo.ref_profit.div(10000).toDecimal(4)} CMU` : '0.0000 CMU'}}</b></h3>
                  <h3 v-if="dividendInfo" class="title">{{$t('create_portal_income')}}: <b style="color:  #fff">{{dividendInfo.fee_profit ? `${dividendInfo.fee_profit.div(10000).toDecimal(4)} CMU` : '0.0000 CMU'}}</b></h3>
                </div>
              </div>
              <div style="display:flex;align-items:center;">
                <button style="margin-right:10px" class="button" @click="claim">{{$t('claim_btn')}}</button>
                <b-tooltip v-model="$i18n.locale" :label="$t('token_FTextBubble')"
                    position="is-right" :multilined="true" size="is-large">
                    <b-icon class="question-icon" pack="fas" type="is-white" icon="question-circle" size="is-middle"></b-icon>
                </b-tooltip>
              </div>
            </b-tab-item>
            <b-tab-item v-if="scatterAccount" :label="$t('my_assets_tab')" icon="account">
              <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos || '0 EOS'}}</b></h3>
              <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu || '0 CMU'}}</b></h3>
            </b-tab-item>
            <b-tab-item :label="$t('stake_tab')" icon="bank">
              <section class="section">
                <h3 class="title" v-if="scatterAccount">{{$t('my_staked')}}: <b style="color:  #fff">
                  {{stakedInfo.staked}}</b></h3>
                <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
                  {{globalInfo.total_staked}}</b></h3>
                <h3 class="title" v-if="scatterAccount">{{$t('my_refund')}}: <b style="color:  #fff">
                  {{stakedInfo.refund}}</b></h3>
                <h3 v-if="scatterAccount" class="title">{{$t('current_vote')}}: <b style="color:  #fff">
                  {{stakedInfo.to || '--'}}</b></h3>
                <h3 v-if="scatterAccount" class="title">{{$t('vote_address')}}: <input v-model="voteName" class="vote" /></h3>
                <button class="button" @click="stake" :disabled="!scatterAccount">{{$t('stake_btn')}}</button>
                <button class="button" @click="unstake" :disabled="!scatterAccount">{{$t('unstake_btn')}}</button>
                <button class="button" @click="refund" :disabled="!scatterAccount">{{$t('refund_btn')}}</button>
                <button class="button" @click="vote" :disabled="!scatterAccount">{{$t('vote_btn')}}</button>
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
    <div class="mobile">
      <b-modal :active.sync="mobileTokenShow" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;" v-if="dividendInfo && globalInfo">
        <div class="payoutComponent" style="margin-top:3rem;">
          <b-tabs size="is-small" position="is-centered">
            <b-tab-item :label="$t('payout_pool_tab')" icon="chart-line">
              <div class="payoutpoolTab">
                <img class="CMU_TOKEN" src="../assets/CMU_Token_Logo.png" alt="CMU_Token">
                <div style="padding: 0.5rem;">
                  <h3 class="title">{{$t('total_dividend')}}: <b style="color:  #fff">{{totalDividend(globalInfo.total_staked, globalInfo.earnings_per_share)}}</b></h3>
                  <h3 class="title" v-if="scatterAccount">{{$t('my_dividend')}}: <b style="color:  #fff">{{myDividend(globalInfo.earnings_per_share, stakedInfo.staked, stakedInfo.payout)}}</b></h3>
                  <h3 v-if="dividendInfo" class="title">{{$t('jackpot_income')}}: <b style="color:  #fff">{{dividendInfo.game_profit ? `${dividendInfo.game_profit.div(10000).toDecimal(4)} EOS` : '0.0000 EOS'}}</b></h3>                  
                  <h3 v-if="dividendInfo" class="title">{{$t('share_income')}}: <b style="color:  #fff">{{dividendInfo.ref_profit ? `${dividendInfo.ref_profit.div(10000).toDecimal(4)} CMU` : '0.0000 CMU'}}</b></h3>
                  <h3 v-if="dividendInfo" class="title">{{$t('create_portal_income')}}: <b style="color:  #fff">{{dividendInfo.fee_profit ? `${dividendInfo.fee_profit.div(10000).toDecimal(4)} CMU` : '0.0000 CMU'}}</b></h3>
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
              <h3 class="title">{{$t('my_EOS')}}: <b style="color:  #fff">{{balances.eos || '0 EOS'}}</b></h3>
              <h3 class="title">{{$t('my_CMU')}}: <b style="color:  #fff">{{balances.cmu || '0 CMU'}}</b></h3>
            </b-tab-item>
            <b-tab-item :label="$t('stake_tab')" icon="bank">
              <h3 class="title" v-if="scatterAccount">{{$t('my_staked')}}: <b style="color:  #fff">
                {{stakedInfo.staked}}</b></h3>
              <h3 class="title">{{$t('total_staked')}}: <b style="color:  #fff">
                {{globalInfo.total_staked}}</b></h3>
              <h3 class="title" v-if="scatterAccount">{{$t('my_refund')}}: <b style="color:  #fff">
                {{stakedInfo.refund}}</b></h3>
              <h3 v-if="scatterAccount" class="title">{{$t('current_vote')}}: <b style="color:  #fff">
                {{stakedInfo.to || '--'}}</b></h3>
              <h3 v-if="scatterAccount" class="title">{{$t('vote_address')}}: <input v-model="voteName" class="vote" /></h3>
              <button class="button" @click="stake" :disabled="!scatterAccount">{{$t('stake_btn')}}</button>
              <button class="button" @click="unstake" :disabled="!scatterAccount">{{$t('unstake_btn')}}</button>
              <button class="button" @click="refund" :disabled="!scatterAccount">{{$t('refund_btn')}}</button>
              <button class="button" @click="vote" :disabled="!scatterAccount">{{$t('vote_btn')}}</button>
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
  data () {
    return {
      voteName: ''
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
    refund() {
      this.$emit('refund', null);
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
    vote () {
      this.$emit('vote', this.voteName, () => {
        this.voteName = ''
      });
    },
    totalDividend (totalStaked, earningsPerShare) {
      const totalDividend = parseFloat(totalStaked) * (parseInt(earningsPerShare.substr(2).match(/.{1,2}/g).reverse().join(''), 16).div(4294967296) || 0)
      return totalDividend.toDecimal(8) ? totalDividend.toDecimal(8) + ' CMU' : '0.00000000 CMU'
    },
    myDividend (earningsPerShare, staked, payout) {
      // 我已领取的分红 payout
      const totalDividend = parseFloat(staked) * (parseInt(earningsPerShare.substr(2).match(/.{1,2}/g).reverse().join(''), 16).div(4294967296) || 0) - (parseInt(payout) / 10000)
      return totalDividend.toDecimal(8) ? totalDividend.toDecimal(8) + ' CMU' : '0.00000000 CMU'
    }
  },
  watch: {
    mobileTokenShow(showing) {
      if (showing === false) {
        this.$emit('CloseMobileTokenView', null);
      }
    },
    dividendInfo (dividendInfo) {
      console.log(dividendInfo, 'dividendInfo')
    } 
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

.vote
  background-color: #242424;
  border: 1px solid #dbdbdb;
  color: #fff
  height: 28px
  padding: 0 10px
  border-radius: 3px
  outline: none
</style>
<style lang="sass">
.mobile .modal .modal-content
  position: absolute
  top: 0px
</style>
