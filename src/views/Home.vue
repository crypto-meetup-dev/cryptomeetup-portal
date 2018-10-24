<template>
  <div class="home">
    <Globe v-model="activeCountryCode" />
    <div :class="['country-detail', {'is-active': activeCountryCode}]">
      <div class="globe-control">
        <button class="globe-control-item button is-primary
        is-small is-rounded is-inverted is-outlined" @click="initIdentity" v-if="!account">
          <b-icon icon="account" size="is-small" />&nbsp;{{$t('login')}}
        </button>
        <button class="globe-control-item button is-primary
        is-small is-rounded is-inverted is-outlined" @click="forgetIdentity" v-else>
          <b-icon icon="account" size="is-small" />&nbsp;Logout
        </button>
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
      <div class="country-content" v-show="activeCountryCode">
        <section class="section">
          <h1 class="title">Meetups in <b> {{activeCountryCode ? activeCountry[2] : ''}} </b></h1>
          <p>Data is unavailable.</p>
        </section>
        <section class="section content">
          <h1 class="title">Sponsor</h1>
          <p>This country is brought to you by @nyan: This is a long custom message.</p>
          <p>
            <button class="button is-primary is-medium is-rounded is-inverted is-outlined" @click="sponsorCountry(activeCountryCode)">
              <b-icon icon="lifebuoy" size="is-small" />&nbsp;Become the new Sponsor via Scatter Desktop
            </button>
            <button class="button is-primary is-medium is-rounded is-inverted is-outlined"
            @click="sponsorCountryByWallet(activeCountryCode)">
              <b-icon icon="lifebuoy" size="is-small" />&nbsp;Become the new Sponsor via Wallet 钱包 App
            </button>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { transferTokenViaEosjs } from '@/blockchain';
import Globe from '@/components/Globe.vue';
import * as CountryCode from 'i18n-iso-countries';
import toPairs from 'lodash/toPairs';

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
  }),
  watch: {
    activeCountryCode(newC, oldC) {
      console.info(`Select new c: ${newC}, old c is ${oldC}`);
    },
  },
  computed: {
    ...mapState(['referral', 'lands']),
    ...mapGetters(['account']),
    landsInfo() {
      const { lands, countries } = this;
      return countries.map((country, idx) => ({
        country,
        land: lands[idx],
      }));
    },
    countries2Code() {
      return this.countries.map(c => c[1]);
    },
    activeCountry() {
      const { activeCountryCode } = this;
      const c = this.countries.find(it => it[0] === activeCountryCode);
      return c;
    },
    activeLandInfo() {
      return this.landsInfo.find(({ country }) => country === this.activeCountry);
    },
    getLandCodeForContract() {
      return this.countries.indexOf(this.activeCountry);
    },
    getActiveCName() {
      return this.activeCountry[2];
    },
  },
  methods: {
    ...mapActions(['initIdentity', 'forgetIdentity']),
    clearGlobeFocus() {
      this.activeCountryCode = null;
    },
    sponsorCountryByWallet(countryCode) {
      // @todo: 弹窗扫码就是了, 待会实现
    },
    async sponsorCountry(countryCode) {
      console.info(`Buying ${countryCode}`);
      if (!countryCode) {
        return;
      }
      const id = this.getLandCodeForContract;
      const { land } = this.activeLandInfo;
      // Transfer
      let buyingMemo = `buy_land ${id}`;
      if (this.referral) {
        buyingMemo += ' ';
        buyingMemo += this.referral;
      }

      // 多出来的 5% 部分合约会 refund, we are cool
      const price = land.price * 0.0001 * 1.4;

      try {
        await transferTokenViaEosjs({
          from: this.account.name,
          to: 'cryptomeetup',
          quantity: `${price.toFixed(4)} EOS`,
          memo: buyingMemo,
        });
        this.$dialog.alert({
          type: 'is-black',
          title: '成功购买',
          message: '转账已提交到区块链，稍后刷新数据即可看到你的地了。',
          confirmText: 'Cool!',
        });
      } catch (error) {
        console.error(error);
        this.$dialog.alert({
          type: 'is-black',
          title: '购买失败',
          message: `错误信息: ${error.message}`,
          confirmText: 'Cool!',
        });
      }
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


</style>
