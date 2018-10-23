<template>
  <div class="home">
    <Globe v-model="activeCountry" />
    <div :class="['country-detail', {'is-active': activeCountry}]">
      <div class="globe-control">
        <button class="globe-control-item button is-primary is-small is-rounded is-inverted is-outlined"
          v-show="activeCountry !== null"
          @click="clearGlobeFocus()"
        >
          <b-icon icon="arrow-left" size="is-small" />&nbsp;Back
        </button>
        <b-select class="globe-control-item country-select" v-model="activeCountry" placeholder="Filter Country or Region" icon="filter" size="is-small" rounded>
          <option v-for="country in countries" :value="country[0]" :key="country[0]">{{country[2]}}</option>
        </b-select>
      </div>
      <div class="country-content" v-show="activeCountry">
        <section class="section">
          <h1 class="title">Meetups</h1>
          <p>Data is unavailable.</p>
        </section>
        <section class="section content">
          <h1 class="title">Sponsor</h1>
          <p>This country is brought to you by @nyan: This is a long custom message.</p>
          <p>
            <button class="button is-primary is-small is-rounded is-inverted is-outlined" @click="sponsorCountry(activeCountry)">
              <b-icon icon="lifebuoy" size="is-small" />&nbsp;Become Sponsor
            </button>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { transferTokenViaEosjs } from '@/blockchain';
import Globe from '@/components/Globe.vue';
import * as CountryCode from 'i18n-iso-countries';
import toPairs from 'lodash/toPairs';

export default {
  name: 'home',
  components: {
    Globe,
  },
  computed: {
    ...mapState(['referral']),
    ...mapGetters(['account']),
    countries2Code() {
      return this.countries.map(c => c[1]);
    },
    activeCode() {
      const { activeCountry } = this;
      const c = this.countries.find(it => it[0] === activeCountry);
      return c[1];
    },
    getLandCodeForContract() {
      return this.countries2Code.indexOf(this.activeCode);
    },
  },
  data: () => ({
    countries: toPairs(CountryCode.getAlpha3Codes()).map(([alpha3code, alpha2code]) => [
      alpha3code,
      alpha2code,
      CountryCode.getName(alpha2code, 'en'),
    ]),
    activeCountry: null,
  }),
  methods: {
    clearGlobeFocus() {
      this.activeCountry = null;
    },
    async sponsorCountry(countryCode) {
      console.info(`Buying ${countryCode}`);
      if (!countryCode) {
        return;
      }
      const id = this.getLandCodeForContract;
      // Transfer
      const buyingMemo = `buy_land ${id}`;
      if (this.referral) {
        buyingMemo += ' ';
        buyingMemo += this.referral;
      }

      const price = '0.0001 EOS';
      try {
        await transferTokenViaEosjs({
          from: this.account.name,
          to: 'cryptomeetup',
          quantity: price,
          memo: buyingMemo,
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
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
  width: 500px
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
