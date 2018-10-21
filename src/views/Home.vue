<template>
  <div class="home">
    <Globe v-model="activeCountry" />
    <div class="globe-control">
      <b-select v-model="activeCountry" placeholder="Filter Country" icon="filter" size="is-small" rounded>
        <option v-for="country in countries" :value="country[0]" :key="country[0]">{{country[1]}}</option>
      </b-select>
    </div>
  </div>
</template>

<script>
import Globe from '@/components/Globe.vue';
import * as CountryCode from 'i18n-iso-countries';
import toPairs from 'lodash/toPairs';

CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));
// console.log(CountryCode.getNames('en'));

export default {
  name: 'home',
  components: {
    Globe,
  },
  data: () => ({
    countries: toPairs(CountryCode.getAlpha3Codes())
      .map(([alpha3code, alpha2code]) => [alpha3code, CountryCode.getName(alpha2code, 'en')]),
    activeCountry: null,
  }),
};
</script>

<style lang="stylus" scoped>
.home
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%

.globe-control
  position: absolute
  right: 2rem
  top: 2rem
  z-index: 1
</style>

<style lang="stylus">
.globe-control
  .select select
    background: rgba(0, 0, 0, 0.7)
    border-color: transparent
    color: #FFF

  .select:not(.is-multiple):not(.is-loading):hover::after
    border-color: #FFF
</style>
