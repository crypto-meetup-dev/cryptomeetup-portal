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
          <b-tooltip label="Please Open Scatter Desktop, unlock and refresh."
            :active="!account">
            <button class="button is-primary is-medium is-rounded is-inverted is-outlined"
            @click="sponsorCountry(activeCountryCode)" :disabled="!account">
              <i class="iconfont icon-scatter" />&nbsp;Pay via Scatter Desktop
            </button>
        </b-tooltip>
            <button v-if="!payByPhone" class="button is-primary is-medium is-rounded is-inverted is-outlined"
            @click="payByPhone = !payByPhone">
              <i class="iconfont icon-barcode" /> &nbsp;Pay via Scan QRCode in Wallet App
            </button>
            <div class="scan-qr" v-else>
              <h2 class="subtitle"> Scan QRCode below <br> to Pay {{  activeLandInfo.nextPrice }}</h2>
              <p> You can pay by Math Wallet or Token Pocket now.</p>
              <qrcode  :value="simpleWalletTransferRequest" :options="{ size: 200 }"></qrcode>
            </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { transferTokenViaEosjs } from "@/blockchain";
import Globe from "@/components/Globe.vue";
import qrcode from "@xkeshi/vue-qrcode";
import SimpleWallet from "@/libs/SimpleWallet";
import * as CountryCode from "i18n-iso-countries";
import toPairs from "lodash/toPairs";

const walletHelper = new SimpleWallet("Crypto Meetups");
const parseLandPrice = ({ price }) => (price * 0.0001 * 1.4).toFixed(4);

export default {
  name: "home",
  components: {
    Globe,
    qrcode
  },
  data: () => ({
    countries: toPairs(CountryCode.getAlpha3Codes()).map(
      ([alpha3code, alpha2code]) => [
        alpha3code,
        alpha2code,
        CountryCode.getName(alpha2code, "en")
      ]
    ),
    activeCountryCode: null,
    payByPhone: false
  }),
  watch: {
    activeCountryCode(newC, oldC) {
      console.info(`Select new c: ${newC}, old c is ${oldC}`);
    }
  },
  computed: {
    ...mapState(["referral", "lands"]),
    ...mapGetters(["account"]),
    landsInfo() {
      const { lands, countries } = this;
      return countries.map((country, idx) => ({
        country,
        land: lands[idx]
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
      const { land } = this.landsInfo.find(
        ({ country }) => country === this.activeCountry
      );
      const nextPrice = `${parseLandPrice(land)} EOS`;
      return { ...land, nextPrice };
    },
    getLandCodeForContract() {
      return this.countries.indexOf(this.activeCountry);
    },
    getActiveCName() {
      return this.activeCountry[2];
    },
    simpleWalletTransferRequest() {
      const { nextPrice } = this.activeLandInfo;
      const amount = Number(nextPrice.split(" ")[0]);
      const id = this.getLandCodeForContract;
      // Transfer
      let buyingMemo = `buy_land ${id}`;
      if (this.referral) {
        buyingMemo += " ";
        buyingMemo += this.referral;
      }
      // 10分钟内有效
      const expired = Math.floor(new Date().getTime() / 1000 + 10 * 60);
      const load = {
        to: "cryptomeetup",
        amount,
        contract: "eosio.token",
        symbol: "EOS",
        precision: 4,
        dappData: buyingMemo,
        desc: "Crypto Meetups - Buy Land",
        expired
      };
      return JSON.stringify(walletHelper.transfer(load));
    }
  },
  methods: {
    ...mapActions(["initIdentity", "forgetIdentity"]),
    clearGlobeFocus() {
      this.activeCountryCode = null;
    },
    sponsorCountryByWallet(payload) {
      const { simpleWalletTransferRequest } = this;
      this.$modal.open({
        parent: this,
        component: ScanQR,
        props: { payload: simpleWalletTransferRequest },
        hasModalCard: true
      });
    },
    async sponsorCountryByScatter(payload) {
      if (this.account === null) {
        this.$dialog.alert({
          type: "is-black",
          title: "请先打开 Scatter 桌面版并解锁",
          message:
            "为了你的账户安全，请使用 Scatter 桌面版进行交易，下载地址 get-scatter.com",
          confirmText: "Cool!"
        });
        return false;
      }
      try {
        await transferTokenViaEosjs(payload);
        this.$dialog.alert({
          type: "is-black",
          title: "成功购买",
          message: "转账已提交到区块链，稍后刷新数据即可看到你的地了。",
          confirmText: "Cool!"
        });
      } catch (error) {
        console.error(error);
        this.$dialog.alert({
          type: "is-black",
          title: "购买失败",
          message: `错误信息: ${error.message}`,
          confirmText: "Cool!"
        });
      }
    },
    async sponsorCountry(countryCode, way = "scatter") {
      console.info(`Buying ${countryCode}`);
      if (!countryCode) {
        return;
      }

      const id = this.getLandCodeForContract;
      const land = this.activeLandInfo;
      // Transfer
      let buyingMemo = `buy_land ${id}`;
      if (this.referral) {
        buyingMemo += " ";
        buyingMemo += this.referral;
      }

      // 多出来的 5% 部分合约会 refund, we are cool
      const { nextPrice } = land;
      const payload = {
        from: this.account.name,
        to: "cryptomeetup",
        quantity: nextPrice,
        memo: buyingMemo
      };
      switch (way) {
        case "scatter":
          return this.sponsorCountryByScatter(payload);
        case "wallet":
          return this.sponsorCountryByWallet();
      }
    }
  }
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
