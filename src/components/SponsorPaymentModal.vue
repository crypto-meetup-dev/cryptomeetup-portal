<template>
  <div class="modal-card autowidth">
    <header class="modal-card-head">
      <p class="modal-card-title">{{$t('countryName').replace('{countryName}', countryName)}}</p>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column">
          <p>{{$t('newCountryName').replace('{countryName}', countryName).replace('{price}', transaction.amount.div(10000).toDecimal(4) + ` ${contractType.toUpperCase()}`)}}</p>
        </div>
      </div>
      <div class="columns">
        <div class="column content is-hidden-mobile">
          <h4>{{$t('countryNameScatter')}}</h4>
          <p>{{$t('scatterDesktop')}}</p>
          <b-notification type="is-danger" has-icon :closable="false" v-if="!isScatterConnected">
            <p>{{$t('noScatter')}}</p>
            <p>{{$t('wnlockScatter')}}</p>
            <p v-html="i18nLink($t('useScatter'))"></p>
          </b-notification>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterLoggingIn }]"
            @click="loginScatterAsync"  :disabled="isScatterLoggingIn"
            v-if="isScatterConnected && !scatterAccount"
          >
            {{$t('loginScatter')}}
          </button>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterPaying }]"
            @click="payWithScatterAsync"
            v-if="scatterAccount" :disabled="isScatterPaying"
          >
            {{$t('scatterPay')}}
          </button>
        </div>
        <div class="column content is-hidden-mobile">
          <h4>{{$t('scatterAppPay')}}</h4>
            <p v-html="i18nLink($t('supportPay'))"></p>
            <QrCode :value="walletTransferData" :options="{ size: 200 }" />
        </div>

        <div class="column content is-hidden-tablet">
          <h4>{{$t('scatterAppPay')}}</h4>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterPaying }]"
            @click="payWithScatterAsync" v-show="scatterAccount"
            :disabled="!scatterAccount">
            {{$t('appPay')}}
          </button>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterLoggingIn }]"
            @click="loginScatterAsync" v-if="isScatterConnected && !scatterAccount"
            :disabled="isScatterLoggingIn">
            {{$t('loginPay')}}
          </button>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-rounded is-hidden-mobile is-primary" @click="paidWithWalletApp()">{{$t('appPayOk')}}</button>
      <button class="button is-rounded is-white is-outlined" type="button" @click="$parent.close()">{{$t('payClose')}}</button>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SimpleWallet from '@/libs/SimpleWallet';
// import API from '@/util/api';
import getApi from '@/util/apis/index.js'
import QrCode from '@xkeshi/vue-qrcode';

const walletHelper = new SimpleWallet('Crypto Meetups');

export default {
  name: 'SponsorPaymentModal',
  props: ['countryName', 'transaction'],
  components: {
    QrCode,
  },
  data: () => ({
    isScatterPaying: false
  }),
  computed: {
    ...mapState(['isScatterConnected', 'scatterAccount', 'isScatterLoggingIn', 'contractType']),
    walletTransferData() {
      const payload = {
        to: this.transaction.to,
        amount: (this.transaction.amount / 10000).toDecimal(4),
        contract: 'eosio.token',
        symbol: this.contractType.toUpperCase(),
        precision: 4,
        dappData: this.transaction.memo,
        desc: 'Crypto Meetup - Become Country Sponsor',
        expired: Math.floor(Date.now() / 1000 + 10 * 60),
      };
      console.log(walletHelper.transfer(payload))
      return JSON.stringify(walletHelper.transfer(payload));
    },
  },
  created () {
    console.log(this.i18nLink(this.$t('useScatter')))
  },
  methods: {
    ...mapActions(['loginScatterAsync', 'updateLandInfoAsync']),
    paidWithWalletApp() {
      this.updateLandInfoAsync();
      this.$toast.open({
        message: this.$t('buy_land_withApp_success'),
        type: 'is-black',
        duration: 5000,
        queue: false,
      });
      this.$parent.close();
    },
    i18nLink (msg) {
      const linkInfo = []
      let html = ''
      const textInfo = msg.replace(/\[([^\]]+)\]\(([^)]+)\)/g, ($key1, $key2, $key3) => {
        linkInfo.push({ url: $key3, text: $key2 })
        return '-division-'
      }).split('-division-')
      for (let i = 0; i < textInfo.length; i += 1) {
        html += textInfo[i]
        html += linkInfo[i] ? `<a href="${linkInfo[i].url}" target="_blank">${linkInfo[i].text}</a>` : ''
      }
      return html
    },
    async payWithScatterAsync() {
      this.isScatterPaying = true;
      try {
        await getApi(this.contractType).api.transferEOSAsync({
          from: this.scatterAccount.name,
          symbol: this.contractType.toUpperCase(),
          ...this.transaction,
        });
        this.updateLandInfoAsync();
        this.$dialog.alert({
          type: 'is-black',
          title: this.$t('buy_land_success_alert'),
          message:
            this.$t('buy_land_success_msg'),
          confirmText: this.$t('buy_land_success_comfm'),
        });
        this.$parent.close();
        this.isScatterPaying = false;
        return true;
      } catch (error) {
        console.error(error);

        let msg;
        if (error.message === undefined) {
          msg = JSON.parse(error).error.details[0].message;
        } else {
          msg = error.message;
        }

        this.$toast.open({
          message: `Transfer failed: ${msg}`,
          type: 'is-danger',
          duration: 3000,
          queue: false,
        });
      }
      this.isScatterPaying = false;
      return null;
    },
  },
};
</script>
<style scoped>
.autowidth {
  width: auto;
}
</style>
