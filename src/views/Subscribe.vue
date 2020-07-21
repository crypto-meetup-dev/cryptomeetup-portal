<template>
  <div>
    <div :class="['country-detail', {'is-active': subscribeShow}]">
      <div class="globe-control">
        <div style="width: 100%; position: absolute;top: 2rem; left: 0;">
          <button id="back" class="globe-control-item button is-white is-small is-rounded is-outlined"
                  v-show="subscribeShow"
                  @click="CloseSubscribeView"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
          <button id="mine-subscription" class="globe-control-item button is-white is-small is-rounded is-outlined"
            @click="openMineSubscribe"  
          >      
            <b-icon icon="bookmark" size="is-small" />&nbsp;我的订阅
          </button>
          <button id="create-subscription" class="globe-control-item button is-white is-small is-rounded is-outlined"
            @click="openSubscribe"  
          >      
            <b-icon icon="bookmark-plus-outline" size="is-small" />&nbsp;{{$t('createSubscription')}}
          </button>
        </div>
      </div>
      <h1 v-show="subscribeShow" class="pc-about-h1">
        <div class="content pc-content">
          <div v-show="subscribecreateShow" id="subscribe-overlay">
            <div v-show="subscribecreateShow" id="subscribe-tablecellWrap" >
                <div id="subscribe-closer"></div>
                <div id="subscribe-wrapper">
                    <div class="subscribe-content">
                        <div class="subscribe-title">{{$t('createSubscription')}}</div>
                        <div class="subscribe-description">创建一个要求持有特定数量的 Token 的订阅来让 <span class="mtt-name">Matataki.io</span> 的关注者订阅你的地址</div>
                        <br>
                        <form class="subscribe-form" @keyup.enter="sendCreateSubscribe(selected, amount)">
                          <section>
                              <label>你的 Token 要求是什么？</label>
                              <b-autocomplete
                                  class="subscribe-token-select"
                                  v-model="name"
                                  placeholder="e.g. AND"
                                  :keep-first="false"
                                  :open-on-focus="openOnFocus"
                                  :data="filterObject"
                                  field="display"
                                  @select="option => selected = option">
                              </b-autocomplete>
                            </section>
                            <label>要持有多少 Token 才能看到你呢？</label>
                            <input type="text" name="form-amount" class="subscribe-form-field" placeholder="Amount"
                                maxlength="50" pattern="\d+$" required v-model="amount">
                            <br>
                            <div class="warning-note"><span class="warning-head">注意</span>：订阅和朋友是有实际区别的，你同一时间只能发布一个激活的订阅。<br>
                            <center><strong>请注意自己的人身安全!!</strong></center>
                            </div>
                            <br>
                            <input type="button" class="subscribe-form-submit" :value="$t('create_prefix')" @click="sendCreateSubscribe(selected, amount)">
                        </form>
                    </div>
                </div>
            </div>
          </div>
          <div v-show="mineSubscribeShow" class="mine-subscribe-list">
            <div class="subscribe-item">
              <img class="avatar" :src="url + '/user/avatar?id=' + userId">
              <div class="username" style="margin-left: 1rem;flex: 1;">{{ userProfile.nickname }}（我）</div>
              <div v-show="!mineActive" class="mine-status" style="font-weight: 900;font-size: 0.7rem;color: #43464B;">暂无订阅</div>
              <div v-show="mineActive" class="mine-status">
                <div class="deny-btn button is-rounded"
                  @click="dismissSubscribe"
                style="display: flex; align-items: center;">
                  <span>取消订阅广播</span><b-icon icon="close" size="is-small" type="is-danger" />
                </div>
              </div>
            </div>
            <div class="spliter">
              <div class="spliter-text">订阅列表</div>
            </div>
            <div v-show="mineDataIsReady" class="others">
              <ul id="subscribe-content">
                <div v-show="!mineDataIsReady" class="loading">
                  <div class="loader"></div>
                </div>
                <li v-for="(item, index) in mineSubscribeList" :key="index" :item="item" >
                  <div class="subscribe-item" :id="item.id">
                    <div v-show="dismissShow" id="dismiss-overlay">
                    <div v-show="dismissShow" id="dismiss-tablecellWrap" >
                      <div id="dismiss-closer"></div>
                        <div id="dismiss-wrapper">
                          <div class="dismiss-content">
                            <div class="dismiss-title">解除订阅</div>
                            <div>你确定要取消订阅 <span class="user-name">{{ item.nickname }}</span> 的地理位置吗？</div>
                            <div class="assigns">
                              <div class="confirm-btn" @click="() => { confirm(index, item.id) }">
                                <b-icon icon="check" size="is-medium" type="is-success" />
                              </div>
                              <div class="deny-btn" @click="() => { deny(index, item.id) }" >
                                <b-icon icon="close" size="is-medium" type="is-danger" />
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                    </div>
                    <img class="avatar" :src="url + '/user/avatar?id=' + item.id" />
                    <div class="user-info">
                      <div class="username">{{ item.nickname }}</div>
                      <div v-show="item.status" class="status">
                        <div class="green-circle"></div>
                        <div class="online-text">{{$t('online')}}</div>
                      </div>
                      <div v-show="!item.status" class="status">
                        <div class="red-circle"></div>
                        <div class="offline-text">{{$t('offline')}}</div>
                      </div>
                    </div>
                    <div class="map-item">
                      <div class="locate-marker" @click="() => locate(item.id)" >
                        <b-icon icon="map-marker-radius" size="is-medium"/>
                      </div>
                      <div class="dismiss-marker" @click="openRemove" >
                        <b-icon icon="bookmark-off" size="is-medium" />
                      </div>
                    </div>
                </div>
              </li>
            </ul>
            </div>
          </div>
          <div v-show="!mineSubscribeShow" class="subscribe-list">
            <div v-show="!dataIsReady" class="loading">
              <div class="loader"></div>
            </div>
            <ul v-show="dataIsReady" id="subscribe-content">
              <li v-for="(item, index) in subscribeList" :key="index" :item="item" >
                <div class="subscribe-item" :id="item.userId">
                  <img class="avatar" :src="url + '/user/avatar?id=' + item.userId" />
                  <div class="user-info">
                    <div class="username">{{ item.nickname }}</div>
                    <div v-show="item.status" class="status">
                      <div class="green-circle"></div>
                      <div class="online-text">{{$t('online')}}</div>
                    </div>
                    <div v-show="!item.status" class="status">
                      <div class="red-circle"></div>
                      <div class="offline-text">{{$t('offline')}}</div>
                    </div>
                  </div>
                  <div class="subscribe-control-item">
                    <div class="subscribe-needed-text"><span class="amount">{{item.amount}} </span> <span class="symbol">{{item.symbol}} </span> 解锁</div>
                    <div class="subscribe-btn"
                      @click="addSubscribe(item.amount, item.symbol, item.userId, index)"
                    >
                      <b-icon icon="bookmark-plus" size="is-medium" />   
                    </div> 
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </h1>
    </div>
    <!-- mobile -->
    <b-modal :active.sync="mobileSubscribe" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div class="about-box">
        <h1 v-show="mobileSubscribe">
          <div class="content">
          </div>
        </h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Toast } from 'buefy/dist/components/toast';
import location from '@/views/location.js'
import Axios from 'axios'
import { getCookie } from '../util/cookies';

export default {
  props: {
    subscribeShow: {
      type: Boolean,
      default: false,
    },
    mobileSubscribeShow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      mobileSubscribe: false,
      dataIsReady: false,
      mineDataIsReady: false,
      tokenList: [],
      keepFirst: false,
      openOnFocus: true,
      name: '',
      selected: null,
      amount: 0,
      subscribecreateShow: false,
      dismissShow: false,
      subscribeList: [],
      mineSubscribeList: [],
      mineSubscribeShow: false,
      mineActive: false,
      url: process.env.VUE_APP_CMUAPI,
      unlocked: false,
    }
  },
  created () {
    this.mobileSubscribe = this.mobileSubscribeShow
  },
  methods: {
    ...mapActions(['createSubscribe', 'setWallet']),
    CloseSubscribeView() {
      this.$emit('CloseSubscribeView', null);
    },
    confirm(index, id) {
      const elem = document.getElementById(id);
      let opacity = 100;
      // eslint-disable-next-line no-use-before-define
      const intervalId = setInterval(frame, 5);
      function frame() {
        if (opacity === 0) {
          clearInterval(intervalId);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      this.dismissShow = !this.dismissShow
      this.mineSubscribeList.splice(index, 1)
      if (this.mineSubscribeList.length === 0) this.mineDataIsReady = false
      Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/remove?id=' + this.userId + '&removeId=' + id)
    },
    deny() {
      this.dismissShow = false
      const elem = document.getElementById('dismiss-overlay');
      let opacity = 100;
      // eslint-disable-next-line no-use-before-define
      const id = setInterval(frame, 5);
      function frame() {
        if (opacity === 0) {
          clearInterval(id);
        } else {
          opacity--;
          elem.style.opacity = opacity / 100;
        }
      }
    },
    sendCreateSubscribe(selected, amount) {
      if (selected === null) {
        Toast.open({
          message: '必须选择指定的币种才可以哦',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      } else if (!/^\d{0,8}$|^\d{0,8}\.\d{0,4}$/.test(amount)) {
        Toast.open({
          message: '整数位数最大是 8 位，小数位数最多 4 位哦',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      } else {
        Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/create?id=' + this.userId + '&tokenId=' + selected.id + '&symbol=' + selected.symbol + '&amount=' + amount).then(res => {
          if (res.status === 200) {
            Toast.open({
              message: '订阅创建成功',
              type: 'is-success',
              duration: 4000,
              queue: false,
            })
          }
        })
        this.subscribecreateShow = false
        const elem = document.getElementById('subscribe-overlay');
        let opacity = 100;
        // eslint-disable-next-line no-use-before-define
        const id = setInterval(frame, 5);
        // eslint-disable-next-line no-inner-declarations
        function frame() {
          if (opacity === 0) {
            clearInterval(id);
          } else {
            opacity -= 1;
            elem.style.opacity = opacity / 100;
          }
        }
      }
    },
    dismissSubscribe() {
      this.mineActive = false
      Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/dismiss?id=' + this.userId)
    },
    openSubscribe() {
      document.getElementById('subscribe-overlay').style.cssText = 'opacity: 0; display: table;';
      const elem = document.getElementById('subscribe-overlay');
      let opacity = 0;
      // eslint-disable-next-line no-use-before-define
      const id = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(id);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      document.getElementById('subscribe-closer').addEventListener('click', () => {
        document.getElementById('subscribe-overlay').style.cssText = 'display: none;';
      })
      this.subscribecreateShow = true
    },
    openMineSubscribe() {
      this.mineSubscribeShow = !this.mineSubscribeShow
    },
    locate(id) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/user/position?id=' + id).then(res => {
        location.updateToLocation(res.data)
      })
    },
    openRemove() {
      this.dismissShow = true
      document.getElementById('dismiss-overlay').style.cssText = 'opacity: 0; display: table;';
      const elem = document.getElementById('dismiss-overlay');
      let opacity = 0;
      // eslint-disable-next-line no-use-before-define
      const id = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(id);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      document.getElementById('dismiss-closer').addEventListener('click', () => {
        document.getElementById('dismiss-overlay').style.cssText = 'display: none;';
      })
    },
    addSubscribe(amount, symbol, uid, index) {
      const targetToken = this.wallet.filter(e => e.symbol === symbol)
      if (targetToken.length > 0) {
        const move = 10 ** targetToken[0].decimals
        if (targetToken[0].amount / move >= amount) {
          Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/add?id=' + this.userId + '&addId=' + uid).then(res => {
            Toast.open({
              message: '订阅成功',
              type: 'is-success',
              duration: 4000,
              queue: false,
            })
          }).catch(e => {
            Toast.open({
              message: '订阅失败: ' + e,
              type: 'is-danger',
              duration: 4000,
              queue: false,
            })
          })
        }
      } else {
        Toast.open({
          message: '订阅失败: 你没有足够的对应币种',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      }
      this.scribeList.splice(index, 1)
      if (this.scribeList.length === 0) this.dataIsReady = false
    }
  },
  watch: {
    mobileSubscribeShow(showing) {
      // if (showing === false) {
      //   this.$emit('CloseMobileAboutView', null);
      // }
      this.mobileSubscribe = showing
      if (!showing) {
        this.$emit('CloseMobileSubscribeView', null);
      }
    },
  },
  computed: {
    ...mapState(['userId', 'userProfile', 'isLoggingIn', 'wallet']),
    filterObject() {
      return this.tokenList.filter((option) => option.symbol
        .toString()
        .toLowerCase()
        .indexOf(this.name.toLowerCase()) >= 0)
    }
  },
  mounted() {
    Axios.get('https://api.smartsignature.io/token/all?page=1&pagesize=999').then(res => {
      res.data.data.list.forEach(item => {
        const tokenObj = { 
          id: item.id,
          uid: item.uid,
          name: item.name,
          symbol: item.symbol,
          display: item.symbol + '-' + item.name
        }
        this.tokenList.push(tokenObj)
      })
    }).catch(e => console.log(e))

    this.myInterval = window.setInterval(() => {
      setTimeout(() => {
        Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/all').then(res => {
          if (res.data.length > 0) {
            if (this.isLoggingIn) {
              Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe?id=' + this.userId).then(res2 => {
                if (res2.data) {
                  this.subscribeList = res.data.filter(e => res2.data.indexOf(e.userId) === -1)
                  if (this.subscribeList.length > 0) {
                    this.dataIsReady = true
                  } else {
                    this.dataIsReady = false
                  }
                } else {
                  this.subscribeList = res.data
                  if (this.subscribeList.length > 0) {
                    this.dataIsReady = true
                  } else {
                    this.dataIsReady = false
                  }
                }
              })
            }
          }
        })
      }, 1)
    }, 2000);

    if (this.isLoggingIn) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/mine?id=' + this.userId).then(res => {
        this.mineActive = res.data
      })
      this.myInterval2 = window.setInterval(() => {
        setTimeout(() => {
          Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe?id=' + this.userId).then(res => {
            Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/all').then(res2 => {
              if (res.data) {
                res.data = res.data.filter(e => res2.data.filter(elem => res2.data.indexOf(elem.userId) !== -1))
                res.data = res.data.filter(user => { 
                  // eslint-disable-next-line array-callback-return
                  res2.data.filter(e => {
                    const token = this.wallet.filter(t => t.symbol === e.symbol)
                    const move = 10 ** token[0].decimals
                    if (token[0].amount / move >= e.amount) {
                      return e
                    }
                  })
                  return res2.data
                })
                if (res.data.length <= 0) {
                  this.mineDataIsReady = false
                  return
                }
                for (let i = 0; i < res.data.length; i++) { 
                  Axios.get(process.env.VUE_APP_CMUAPI + '/user/info?id=' + res.data[i]).then(res3 => {
                    this.mineSubscribeList.push(res3.data)
                  })
                }
                this.mineDataIsReady = true
                clearInterval(this.myInterval2)
              }
            })
          })
        }, 1)
      }, 2000);
    }
  },
  destroyed() {
    clearInterval(this.myInterval)
    if (this.myInterval2) clearInterval(this.myInterval2)
  }
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

.amount
  margin-right: 0.3rem;

.symbol
  font-weight: 700;
  margin-right: 0.5rem;

.subscribe-needed-text 
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-size: 1.3rem;

#subscribe-content
  margin: 0px;
  overflow: auto
  top: 80px

.subscribe-btn
  color: #E5A221

.subscribe-btn:hover
  color: #BF7D00

.subscribe-item
  align-items: center
  display: flex
  height: 6rem
  margin: 1.5rem
  background-color: #FFFCF9
  color: black;
  border-radius: 1.5rem
  padding: 2rem

.avatar
  height: 64px
  object-fit: cover

#mine-subscription
  position: absolute
  right: 9rem

#create-subscription
  position: absolute
  right: 2rem
  
#back
  left: 1rem

.about-box
  padding-right: 20px

.country-detail
  position: absolute
  left: 0
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

.pc-about-h1
  top: 80px
  overflow-y: scroll

.pc-about-h1::-webkit-scrollbar
  width: 6px
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-track
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-thumb
  background-color: #fff
  border-radius: 3px

.spliter-text
  display: flex;
  align-items: center;

.spliter-text::before,.spliter-text::after
  content: ''
  flex: 1
  height: 1px
  background: #fff

.spliter-text::before
  margin-left: 1rem
  margin-right: 1rem

.spliter-text::after
  margin-right: 1rem
  margin-left: 1rem

.map-item
  flex-direction: row
  display: flex
  margin-right: 1rem

.avatar
  height: 64px
  object-fit: cover

.status
  display: flex;
  align-items: center;

.green-circle
  width: 1rem
  height: 1rem
  left: 40%
  border-radius: 50%
  background-color: #269D36

.online-text
  padding-left: 0.5rem

.red-circle
  width: 1rem
  height: 1rem
  left: 40%
  border-radius: 50%
  background-color: #D83434

.offline-text
  padding-left: 0.5rem

.user-info
  display: flex
  flex-direction: column
  padding-left: 1rem
  flex: 1

.username
  font-size: 1rem
  font-weight: 700

.status
  display: flex
  align-items: center
  margin: auto 0

.subscribe-control-item
  flex-direction: row
  display: flex
  margin-right: 1rem

.locate-marker
  margin-right: 1rem
  color: #21BEDA

.locate-marker:hover
  color: #1b96ac

.dismiss-marker
  color: #FF2424

.dismiss-marker:hover
  color: #ca1e21

#subscribe-overlay 
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%
    max-width: 550px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 30;


#subscribe-tablecellWrap 
    display: table-cell;
    vertical-align: middle;
    text-align: center;


#subscribe-closer 
    position: absolute;
    top: 0;
    left: 0;
    z-index: 35;
    width: 100%;
    height: 100%;
    cursor: pointer;


#subscribe-wrapper 
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;
    z-index: 40;

/* content */

label
  color: #ffd83f

.mtt-name 
  color: #6c4be0;


.subscribe-content 
    border-radius: 20px !important;
    box-sizing: border-box !important;
    padding: 40px !important;
    background-color: #000 !important;
    width: 380px !important;

.subscribe-description


.subscribe-form 
  margin-top: 1rem;


.subscribe-form-field 
    display: block;
    font-family: Arial, Arial, Helvetica, sans-serif;
    background-color: black;
    color: rgba(255, 216, 63, 1.000);
    font-size: 15px;
    line-height: 120%;
    height: 42px;
    width: 227px;
    border: none;
    box-sizing: border-box;
    padding: 17px 11px;
    margin: 0 auto 10px;
    border-bottom: 2px solid rgba(255, 216, 63, 1.000);
    border-radius: 4px


.subscribe-form-field:focus 
    outline: none;


.subscribe-form-submit 
    display: block;
    background-color: #1c2025;
    border: none;
    font-family: Arial, Arial, Helvetica, sans-serif;
    color: #fff;
    font-size: 23px;
    text-transform: uppercase;
    width: 228px;
    height: 60px;
    z-index: 5;
    box-sizing: border-box;
    cursor: pointer;
    margin: 1.5rem auto 0;
    border-radius: 10px;


.subscribe-form-submit:hover 
    background-color: #000;
    color: #fff;
    border: 3px solid rgba(255, 216, 63, 1.000);

.subscribe-form-submit:focus 
  outline: none;

.subscribe-title 
  font-family: Arial, Arial, Helvetica, sans-serif !important;
  color: #fff !important;
  font-size: 40px !important;
  line-height: 125% !important;
  letter-spacing: 1.3px !important;
  margin: 1rem 0 1rem 0 !important;

.subscribe-token-select
  font-family: Arial, Arial, Helvetica, sans-serif !important;
  width: 227px;
  color: #ffd83f;
  border: none
  margin: 0 auto 10px;

#dismiss-overlay 
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%
    max-width: 550px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 30;


#dismiss-tablecellWrap 
    display: table-cell;
    vertical-align: middle;
    text-align: center;


#dismiss-closer 
    position: absolute;
    top: 0;
    left: 0;
    z-index: 35;
    width: 100%;
    height: 100%;
    cursor: pointer;


#dismiss-wrapper 
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;
    z-index: 40;


/* content */

.user-name 
  font-weight: 600
  color: #EB4C64;


.dismiss-content
    color: #fff 
    border-radius: 20px;
    box-sizing: border-box;
    padding: 40px;
    background-color: #000;
    width: 380px;


.dismiss-form 
  margin-top: 1rem;


.dismiss-form-field 
    display: block;
    font-family: Arial, Arial, Helvetica, sans-serif;
    background-color: black;
    color: rgba(255, 216, 63, 1.000);
    font-size: 15px;
    line-height: 120%;
    height: 42px;
    width: 227px;
    border: none;
    box-sizing: border-box;
    padding: 17px 11px;
    margin: 0 auto 10px;
    border-bottom: 2px solid rgba(255, 216, 63, 1.000);


.dismiss-form-field:focus 
    outline: none;


.dismiss-form-submit 
    display: block;
    background-color: #1c2025;
    border: none;
    font-family: Arial, Arial, Helvetica, sans-serif;
    color: #fff;
    font-size: 23px;
    text-transform: uppercase;
    width: 228px;
    height: 60px;
    z-index: 5;
    box-sizing: border-box;
    cursor: pointer;
    margin: 1.5rem auto 0;
    border-radius: 10px;


.dismiss-form-submit:hover 
    background-color: #000;
    color: #fff;
    border: 3px solid rgba(255, 216, 63, 1.000);


.dismiss-form-submit:focus 
  outline: none;


.dismiss-title 
    font-family: Arial, Arial, Helvetica, sans-serif;
    color: #EB4C64;
    font-size: 40px;
    line-height: 125%;
    letter-spacing: 1.3px;
    margin: 1rem 0 1rem 0;

.assigns
  display: flex
  justify-content: center
  margin-top: 1rem

.confirm-btn
  margin-right: 1rem

.deny-btn:active
  transform: scale(0.96)
</style>
<style>
.warning-head {
  color: #ff5353;
}

.subscribe-token-select > div > input {
  color: #ffd83f !important;
  border: none;
  background-color: black !important;
  border-bottom: 2px solid #ffd83f;
}

.subscribe-token-select > div > input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgb(102, 102, 102);
  opacity: 1; /* Firefox */
}

.subscribe-token-select > div > input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgb(102, 102, 102);
  opacity: 1; /* Firefox */
}

.subscribe-token-select > div > input::-ms-input-placeholder { /* Microsoft Edge */
  color: rgb(102, 102, 102);
  opacity: 1; /* Firefox */
}

.subscribe-token-select > div > input:focus {
  color: #ffd83f;
  border:none;
  border-bottom: 2px solid #ffd83f;
  outline: none !important;
  box-shadow: none;
  -webkit-box-shadow: none;
}

.subscribe-token-select > div > input:hover {
  border-bottom: 2px solid #ffd83f;
}

.dropdown-content {
  background-color: black !important;
}

.dropdown-item {
  color: #FFF !important;
}

.dropdown-item:hover {
  text-decoration: none !important;
}

.dropdown-content::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}
.dropdown-content::-webkit-scrollbar-track {
  background-color: transparent;
}
.dropdown-content::-webkit-scrollbar-thumb {
  background-color: #fff;
  border-radius: 3px;
}
.loading {
  height: 80vh;
  display: flex;
  align-items: center;
  flex-flow: column;
  justify-content: center;
}

.loader {
  width: 4rem !important;
  height: 4rem !important;
}

.loader-text {
  margin-top: 4rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.loader {
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
}

.loader::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  -webkit-clip-path: inset(0 50% 0 0);
          clip-path: inset(0 50% 0 0);
  -webkit-mask: -webkit-gradient(linear, left top, left bottom, from(black), to(transparent));
  -webkit-mask: linear-gradient(black, transparent);
          mask: -webkit-gradient(linear, left top, left bottom, from(black), to(transparent));
          mask: linear-gradient(black, transparent);
  -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
  }
}

@keyframes spin {
  to {
    -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
  }
}
</style>
