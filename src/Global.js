// 利用vue单例充当 全站 事件 有必要的话可以把数据也接进来
import Vue from 'vue'

// 关于Portal用的数据
const globalPortal = {
  scatterAccount: null,
  portalInfoList: [],
}

const globalContract = {
  contractType: 'eos'
}

export default new Vue({
  data () {
    return {
      ...globalPortal,
      ...globalContract
    }
  },
  methods: {
    setScatterAccount(scatterAccount) {
      this.scatterAccount = scatterAccount
    },
    setPortalInfoList(portalInfoList) {
      this.portalInfoList = portalInfoList
    },
    setGlobalContract(contractType) {
      this.contractType = contractType
    }
  },
  beforeDestroy() {
    this.$off()
  }
})
