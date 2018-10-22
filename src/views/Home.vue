<template>
  <div class="home">
    <Globe v-model="activeCountry" />
    <div class="globe-control">
      <button class="button is-primary is-small is-rounded is-inverted is-outlined"
        v-show="activeCountry !== null"
        @click="clearGlobeFocus()"
      >
        <b-icon
          icon="arrow-left"
          size="is-small">
        </b-icon>
        &nbsp;Back
      </button>
      <b-select v-model="activeCountry" placeholder="Filter Country or Region" icon="filter" size="is-small" rounded>
        <option v-for="country in countries" :value="country[0]" :key="country[0]">{{country[1]}}</option>
      </b-select>
    </div>
  </div>
</template>

<script>
import Globe from '@/components/Globe.vue';
import * as CountryCode from 'i18n-iso-countries';
import toPairs from 'lodash/toPairs';

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
  methods: {
    clearGlobeFocus() {
      this.activeCountry = null;
    },
  },
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
  display: flex
  flex-direction: row
  justify-content: end

  .button
    margin: 0 1rem
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
