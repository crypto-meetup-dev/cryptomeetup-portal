<template>
  <div class="home">
    <!--暂无找到Globe加载完成的回调,利用css层级关系 Globe加载完成覆盖掉Loading-->
    <Loading loadText="loading ..." :zIndex="0" />
    <Globe 
      v-model="activeCountryCode" 
      :countryPrice="countriesPriceMap"
      :thermodynamicChart="thermodynamicChart"
    />
    <div :class="['country-detail', {'is-active': activeCountryCode}]">
      <div class="globe-control">
        <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
          v-show="activeCountryCode !== null"
          @click="clearGlobeFocus()"
        >
          <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
        </button>
        <div class="mobile-back-button globe-control-item is-hidden-tablet"
          v-show="activeCountryCode !== null"
          @click="clearGlobeFocus()"
        >
          <b-icon icon="arrow-left" />
        </div>
        <b-select class="country-select globe-control-item is-inverted" v-model="activeCountryCode" :placeholder="$t('filter_country_or_region')" icon="filter" size="is-small" rounded>
          <option v-for="code in allCountriesCodes" :value="code" :key="code">{{getCountryName(code)}}</option>
        </b-select>
      </div>
      <div class="country-content" v-if="activeCountryCode">
        <section class="section">
          <section class="section content" v-if="activeCountryCode && landInfo[activeCountryCode]">
            <h1 class="title">{{$t('sponsor')}}</h1>
            <p>{{$t('yuoBuy').replace('{owner}', landInfo[activeCountryCode].owner)}}</p>
            <p><a @click="popupPaymentModal()">{{$t('priceNum').replace('{price}', $API.getNextPrice(landInfo[activeCountryCode]).div(10000).toDecimal(4) + ` ${contractType.toUpperCase()}`)}}</a></p>
          </section>
          <h1 class="title">{{$t('countryNameActivity').replace('{countryName}', getCountryName(activeCountryCode))}}</h1>
          <template>
            <p>{{$t('noActivity')}}</p>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import * as CountryCode from 'i18n-iso-countries';
import { mapState } from 'vuex';
import * as config from '@/config';
import Land from '@/util/land';
import Globe from '@/components/Globe.vue';
import Loading from '@/components/Loading.vue';

CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/zh.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/ko.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/ja.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/ru.json'));
// 繁体中文
CountryCode.registerLocale(require('../i18n/Country_zh_tw.json'));

export default {
  name: 'globe-view',
  components: {
    Globe,
    Loading,
  },
  data() {
    return {
      allCountriesCodes: Object.keys(CountryCode.getAlpha3Codes()),
      countriesPriceMap: {},
      activeCountryCode: null,
      payByPhone: false,
      thermodynamicChart: false,
    };
  },
  created() {
    this.updateCountryPriceMap();
  },
  mounted() {
    this.$store.commit('ui/setLatestBuyerVisible', true);
  },
  beforeDestroy() {
    this.$store.commit('ui/setLatestBuyerVisible', false);
  },
  computed: {
    ...mapState(['landInfo', 'contractType']),
  },
  methods: {
    clearGlobeFocus() {
      this.activeCountryCode = null;
    },
    toggleThermodynamicChart () {
      if (this.thermodynamicChart) {
        this.thermodynamicChart = false
      } else {
        this.thermodynamicChart = true
      }
    },
    getCountryName(countryCode) {
      const locale = CountryCode.langs().includes(this.$i18n.locale) ? this.$i18n.locale : 'en';
      return CountryCode.getName(countryCode, locale);
    },
    popupPaymentModal() {
      const referrer = localStorage.getItem(config.referrerStorageKey);
      const landId = Land.countryCodeToLandId(this.activeCountryCode);
      const memo = ['buy_land', String(landId)];
      if (referrer) {
        memo.push(referrer);
      }
    },
    updateCountryPriceMap(landInfo2) {
      const landInfo = landInfo2 || this.landInfo;
      const priceMap = {};
      if (landInfo) {
        Object
          .values(landInfo)
          .forEach((land) => {
            priceMap[land.code] = land.price;
          });
      }
      this.countriesPriceMap = priceMap;
    },
  },
  watch: {
    landInfo(landInfo) {
      this.updateCountryPriceMap(landInfo);
    },
    activeCountryCode(code) {
      this.$store.commit('ui/setNavBurgerVisible', code === null);
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

  +mobile
    width: 100%

.country-content
  flex: 1
  margin: 2rem
  overflow: auto

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

.toggle-thermodynamic-chart
  position: absolute
  top: 80px
  padding: 4px 8px
  border-radius: 16px
  border: 1px solid #fff
  cursor: pointer
  z-index: 1
  right: 30px
</style>
