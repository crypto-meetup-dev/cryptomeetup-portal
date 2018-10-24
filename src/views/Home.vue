<template>
  <div class="home">
    <Globe v-model="activeCountryCode" />
    <div :class="['country-detail', {'is-active': activeCountryCode}]">
      <div class="globe-control">
        <div class="if-connected" v-if="isScatterConnected">
          <button class="globe-control-item button is-primary
          is-small is-rounded is-inverted is-outlined" @click="initIdentity" v-if="!account">
            <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
          </button>
          <button class="globe-control-item button is-primary
          is-small is-rounded is-inverted is-outlined" @click="forgetIdentity" v-else>
            <b-icon icon="account" size="is-small" />&nbsp;Logout
          </button>
        </div>
        <button class="globe-control-item button is-primary is-small is-rounded is-inverted is-outlined"
          v-show="activeCountryCode !== null"
          @click="clearGlobeFocus()"
        >
          <b-icon icon="arrow-left" size="is-small" />&nbsp;Back
        </button>
        <b-select class="globe-control-item country-select" v-model="activeCountryCode" :placeholder="$t('filter_country_or_region')" icon="filter" size="is-small" rounded>
          <option v-for="country in countries" :value="country[0]" :key="country[0]">{{country[2]}}</option>
        </b-select>
        <b-select class="globe-control-item country-select" v-model="$i18n.locale" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">{{$t('ENGLISH')}}</option>
          <option value="zh">{{$t('CHINESE')}}</option>
          <option disabled="disabled">{{$t('JAPANESE')}}</option>
        </b-select>
      </div>
      <div class="country-content" v-if="activeCountryCode">
        <section class="section">
          <h1 class="title">Meetups in <b> {{activeCountryCode ? activeCountry[2] : ''}} </b></h1>
          <div v-if="!activeLandInfo"> <p>Data is unavailable.</p> </div>
          <div v-else>
            <p >Current Landlord: {{ activeLandInfo.owner }}</p>
            <p >Current Price for Sale: {{ activeLandInfo.nextPrice }}</p>
          </div>
        </section>
        <section class="section content" v-if="activeCountryCode">
          <h1 class="title">Sponsor</h1>
          <p>This country is brought to you by @{{activeLandInfo.owner}}: This is a beta in testing.</p>
          <h2 class="subtitle">To be a sponsor</h2>
            <button class="button is-primary is-medium is-rounded is-inverted is-outlined"
            @click="popupPaymentModal()">
              Pay {{ activeLandInfo.nextPrice }}
            </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { transferTokenViaEosjs } from '@/blockchain';
import Globe from '@/components/Globe.vue';
import Payment from '@/components/Payment.vue';
import * as CountryCode from 'i18n-iso-countries';
import toPairs from 'lodash/toPairs';

const parseLandPrice = ({ price }) => (price * 0.0001 * 1.4).toFixed(4);

export default {
  name: 'home',
  components: {
    Globe,
  },
  data: () => ({
    countries: toPairs(CountryCode.getAlpha3Codes()).map(([alpha3code, alpha2code]) => [
      alpha3code,
      alpha2code,
      CountryCode.getName(alpha2code, 'en'),
    ]),
    activeCountryCode: null,
    payByPhone: false,
  }),
  computed: {
    ...mapState(['referral', 'lands', 'isScatterConnected']),
    ...mapGetters(['account']),
    landsInfo() {
      const { lands, countries } = this;
      return countries.map((country, idx) => ({
        country,
        land: lands[idx],
      }));
    },
    activeCountry() {
      const { activeCountryCode } = this;
      const c = this.countries.find(it => it[0] === activeCountryCode);
      return c;
    },
    activeLandInfo() {
      const { land, country } = this.landsInfo.find(({ country }) => country[0] === this.activeCountryCode);
      const nextPrice = `${parseLandPrice(land)} EOS`;
      const [alpha3code, alpha2code, name] = country;
      return {
        ...land,
        nextPrice,
        countryDetail: { alpha3code, alpha2code, name },
      };
    },
    getLandCodeForContract() {
      return this.countries.indexOf(this.activeCountry);
    },
    currentTransactionData() {
      const { activeLandInfo } = this;
      const from = this.account ? this.account.name : null;
      const { nextPrice } = activeLandInfo;
      const id = this.getLandCodeForContract;
      // Generate Memo for transaction
      let buyingMemo = `buy_land ${id}`;
      if (this.referral) {
        buyingMemo += ' ';
        buyingMemo += this.referral;
      }
      // Return transactionData for transfer
      return {
        from,
        to: 'cryptomeetup',
        quantity: nextPrice,
        memo: buyingMemo,
      };
    },
  },
  methods: {
    ...mapActions(['initIdentity', 'forgetIdentity']),
    clearGlobeFocus() {
      this.activeCountryCode = null;
    },
    popupPaymentModal() {
      this.$modal.open({
        parent: this,
        component: Payment,
        hasModalCard: true,
        props: { currentTransactionData: this.currentTransactionData },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.home
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%

.country-detail
  position: absolute
  right: 0
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

.country-content
  flex: 1
  margin: 2rem
  overflow: auto

  .section
    padding-left: 0
    padding-right: 0

.globe-control
  margin: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: flex-end

  /deep/
    .select select
      background: rgba(#000, 0.7)
      border-color: transparent
      color: #FFF

    .select:not(.is-multiple):not(.is-loading):hover::after
      border-color: #FFF

  &-item
    margin-left: 1rem
    pointer-events: auto

.button.is-primary.is-inverted.is-outlined:hover, .button.is-primary.is-inverted.is-outlined:focus
    color: #222

</style>
