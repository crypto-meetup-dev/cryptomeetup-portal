// 利用vue单例充当 全站 事件 有必要的话可以把数据也接进来
import Vue from 'vue'

export default new Vue({
  beforeDestroy() {
    this.$off()
  }
})
