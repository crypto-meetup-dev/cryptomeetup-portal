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
              <div class="username" style="flex: 1;">{{ userProfile.nickname }}</div>
              <div v-show="!mineActive" class="mine-status" style="font-weight: 900;font-size: 1.2rem;color: #43464B;">暂无订阅</div>
              <div v-show="!mineActive" class="mine-status">
                <div class="deny-btn"
                  @click="dismissSubscribe"
                >
                  <b-icon icon="close" size="is-medium" type="is-danger" />
                </div>
              </div>
            </div>
            <div class="others">
              <ul id="subscribe-content">
              <li v-for="(item, index) in mineSubscribeList" :key="index" :item="item" >
                <div class="subscribe-item" :id="item.userId">
                  <div v-show="dismissShow" id="dismiss-overlay">
                    <div v-show="dismissShow" id="dismiss-tablecellWrap" >
                      <div id="dismiss-closer"></div>
                        <div id="dismiss-wrapper">
                          <div class="dismiss-content">
                            <h2 class="dismiss-title">Dismiss</h2>
                            <h4>You are sure to dismiss locate sharing with <span class="user-name">{{ item.nickname }}</span> ?</h4>
                            <div class="assigns">
                              <div class="confirm-btn" @click="() => { confirm(index, item.userId) }">
                                <b-icon icon="check" size="is-medium" type="is-success" />
                              </div>
                              <div class="deny-btn" @click="() => { deny(index, item.userId) }" >
                                <b-icon icon="close" size="is-medium" type="is-danger" />
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                    </div>
                    <img class="avatar" src="https://img.zcool.cn/community/015a465698b54432f87574be965625.png@1280w_1l_2o_100sh.png" />
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
                      <div class="locate-marker" @click="() => locate(item.userId)" >
                        <b-icon icon="map-marker-radius" size="is-medium"/>
                      </div>
                      <div class="dismiss-marker" @click="openDismiss" >
                        <b-icon icon="link-variant-off" size="is-medium" />
                      </div>
                    </div>
                </div>
              </li>
            </ul>
            </div>
          </div>
          <div v-show="!mineSubscribeShow" class="subscribe-list">
            <ul id="subscribe-content">
              <li v-for="(item, index) in subscribeList" :key="index" :item="item" >
                <div class="subscribe-item" :id="item.userId">
                  <div v-show="dismissShow" id="dismiss-overlay">
                    <div v-show="dismissShow" id="dismiss-tablecellWrap" >
                      <div id="dismiss-closer"></div>
                        <div id="dismiss-wrapper">
                          <div class="dismiss-content">
                            <h2 class="dismiss-title">Dismiss</h2>
                            <h4>You are sure to dismiss locate sharing with <span class="user-name">{{ item.nickname }}</span> ?</h4>
                            <div class="assigns">
                              <div class="confirm-btn"
                                @click="() => { confirm(index, item.userId) }"
                              >
                                <b-icon icon="check" size="is-medium" type="is-success" />
                              </div>
                              <div class="deny-btn"
                                @click="() => { deny(index, item.userId) }"
                              >
                                <b-icon icon="close" size="is-medium" type="is-danger" />
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                    </div>
                  <img class="avatar" src="https://img.zcool.cn/community/015a465698b54432f87574be965625.png@1280w_1l_2o_100sh.png" />
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
                      <div class="locate-marker"
                        @click="() => locate(item.userId)"
                      >
                        <b-icon icon="map-marker-radius" size="is-medium"/>
                      </div>
                      <div class="dismiss-marker"
                        @click="openDismiss"
                      >
                        <b-icon icon="link-variant-off" size="is-medium" />
                      </div>
                    </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-show="!dataIsReady" class="loading">
            <div class="loader"></div>
            <div class="loader-text">这里什么都没有...</div>
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
    }
  },
  created () {
    this.mobileSubscribe = this.mobileSubscribeShow
  },
  methods: {
    CloseSubscribeView() {
      this.$emit('CloseSubscribeView', null);
    },
    confirm(index, id) {
      this.dismissShow = false
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
      this.friendsList.splice(index, 1)
      if (this.friendsList.length === 0) this.dataIsReady = false
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
      } else if (!/^[0-9]{0,8}$/.test(amount)) {
        Toast.open({
          message: '数量必须是 8 位以内的数字哦',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      } else {
        Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/create?id=' + this.userId + '&tokenId=' + selected.id + '&symbol=' + selected.symbol + '&amount=' + amount)
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
      Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/dismiss?id=' + this.userId)
    },
    openSubscribe() {
      this.subscribecreateShow = true
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
    },
    openMineSubscribe() {
      this.mineSubscribeShow = !this.mineSubscribeShow
    },
    locate(id) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/user/position?id=' + id).then(res => {
        location.updateToLocation(res.data)
      })
    },
    openDismiss() {
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
    ...mapActions(['createSubscribe']),
    ...mapState(['userId', 'userProfile']),
    filterObject() {
      return this.tokenList.filter((option) => option.symbol
        .toString()
        .toLowerCase()
        .indexOf(this.name.toLowerCase()) >= 0)
    }
  },
  mounted() {
    Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/mine?id=' + this.userId).then(res => {
      this.mineActive = res.data
    })
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
    }).catch(e => console.log())

    this.myInterval = window.setInterval(() => {
      setTimeout(() => {
        Axios.get(process.env.VUE_APP_CMUAPI + '/subscribe/all').then(res => {
          this.subscribeList = res.data
          if (this.subscribeList.length > 0) {
            this.dataIsReady = true
            clearInterval(this.myInterval)
          }
        })
      }, 1)
    }, 2000);
  },
  destroyed() {
    clearInterval(this.myInterval)
  }
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

#subscribe-content
  overflow: auto
  top: 80px

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
  font-size: 1.2rem
  font-weight: 700

.status
  display: flex
  align-items: center
  margin: auto 0

.map-item
  flex-direction: row
  display: flex
  margin-right: 1rem

.locate-marker
  margin-right: 1.5rem
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
