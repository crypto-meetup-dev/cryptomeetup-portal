<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Pay {{ currentTransactionData.quantity }} for Buying Land</p>
        </header>
        <section class="modal-card-body">
            <div class="columns">
                <div class="column">
                    <i class="iconfont icon-scatter logo"></i>
                    <p>Scatter Desktop allows convenient transactions securely. <br> If you don't have one, check out: <a href="https://support.newdex.io/hc/en-us/articles/360016322611-How-to-Use-Scatter-Desktop-" target="_blank">《How to use Scatter》</a></p>
                    <p class="error" v-if="!isScatterConnected"> Unable to detect Scatter, Please Open Scatter Desktop, unlock & refresh this page to pay. </p>
                    <button class="button is-medium is-rounded is-outlined"
                        @click="initIdentity" v-else-if="!account">
                        <i class="iconfont icon-scatter" /> &nbsp;Login with Scatter to Continue</button>
                    <button class="button is-medium is-rounded is-outlined" v-else
                        @click="sponsorCountryByScatter" :disabled="!account">
                        <i class="iconfont icon-scatter" /> &nbsp;Pay with Scatter</button>
                </div>
                <div class="column">
                    <h1 class="title">Pay with wallet apps</h1>
                    <p>For Math Mallet, Token Pocket, MEET.ONE user, you can pay by scanning <i class="iconfont icon-barcode" /> QR Code below. </p>
                    <div class="qrcode">
                        <qrcode :value="walletTransferData" :options="{ size: 256 }"></qrcode>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-primary" @click="closeAndUpdate()">I have paid by Wallet Apps</button>
        </footer>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import SimpleWallet from '@/libs/SimpleWallet';
import { transferTokenViaEosjs } from '@/blockchain';
import qrcode from '@xkeshi/vue-qrcode';

const walletHelper = new SimpleWallet('Crypto Meetups');
const parseLandPrice = ({ price }) => (price * 0.0001 * 1.4).toFixed(4);

export default {
  name: 'Payment',
  props: ['currentTransactionData'],
  components: {
    qrcode,
  },
  data: () => ({}),
  computed: {
    ...mapState(['referral', 'isScatterConnected']),
    ...mapGetters(['account']),
    walletTransferData() {
      const data = this.currentTransactionData;
      const { quantity, memo } = data;
      const amount = Number(quantity.split(' ')[0]);

      // 10分钟内有效
      const expired = Math.floor(new Date().getTime() / 1000 + 10 * 60);
      const load = {
        to: 'cryptomeetup',
        amount,
        contract: 'eosio.token',
        symbol: 'EOS',
        precision: 4,
        dappData: memo,
        desc: 'Crypto Meetups - Buy Land',
        expired,
      };
      return JSON.stringify(walletHelper.transfer(load));
    },
  },
  methods: {
    ...mapActions(['initIdentity', 'fetchDatas']),
    closeAndUpdate() {
      this.fetchDatas();
      this.$dialog.alert({
        type: 'is-black',
        title: '恭喜你成功转账',
        message: '30秒内自动刷新数据，即可确认你是否为新地主。一切以区块链上交易记录为准，购买地皮失败则退款。',
        confirmText: '好的',
      });
      this.$parent.close();
    },
    async sponsorCountryByScatter() {
    console.info(this.currentTransactionData)
      try {
        await transferTokenViaEosjs(this.currentTransactionData);
        this.$dialog.alert({
          type: 'is-black',
          title: '成功购买',
          message: '转账已提交到区块链，30秒后自动刷新数据，即可确认是否购买成功。',
          confirmText: 'Cool!',
        });
        this.$parent.close();
        return true;
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

<style scoped>
.modal-card {
    color: #111;
}
.modal-card-body {
    text-align: center
}
.icon-scatter {
    color: rgb(123, 207, 249);
}

.icon-scatter.logo {
    font-size: 9rem;
}
.button.is-outlined:hover, .button.is-outlined:focus {
    color: #222
}
h1.title {
    color: #000;
}
.error {
    color: red;
}
</style>
