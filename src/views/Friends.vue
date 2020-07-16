<template>
  <div>
    <div v-show="!dataIsReady" class="loading">
      <div class="loader"></div>
      <div class="loader-text">这里什么都没有...</div>
    </div>
    <div>
      <ul id="friends-content">
        <li v-for="(item, index) in friendsList" :key="index" :item="item" >
          <div class="friend-item" :id="item.userId">
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
    <!-- mobile -->
    <b-modal :active.sync="mobileFriends" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div class="about-box">
        <h1  v-show="mobileFriends">
          <div class="content">    
          </div>
        </h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import offline from 'v-offline';
import { getCookie, disassemble } from '@/util/cookies'
import Axios from 'axios';
import { getUserProfile } from '../api/login';
import location from './location.js'

export default {
  components: {
    offline
  },
  props: {
    friendsShow: {
      type: Boolean,
      default: false,
    },
    mobileFriendsShow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      mobileFriends: false,
      friendsList: [],
      dataIsReady: false,
      url: process.env.VUE_APP_CMUAPI,
      dismissShow: false
    }
  },
  created () {
    this.mobileFriends = this.mobileFriendsShow
  },
  methods: {
    ...mapActions(['invite']),
    CloseUserProfileView() {
      this.$emit('CloseUserProfileView', null);
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
      Axios.get(process.env.VUE_APP_CMUAPI + '/friends/update?id=' + this.userId + '&removeId=' + id)
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
    mobileUserProfileShow(showing) {
      // if (showing === false) {
      //   this.$emit('CloseMobileAboutView', null);
      // }
      this.mobileAbout = showing
      if (!showing) {
        this.$emit('CloseMobileUserProfileView', null);
      }
    },
  },
  computed: {
    ...mapState(['userProfile', 'userId', 'mapObject'])
  },
  mounted() {
    this.myInterval = window.setInterval(() => {
      setTimeout(() => {
        Axios.get(process.env.VUE_APP_CMUAPI + '/friends?id=' + this.userId).then(res => {
          this.friendsList = res.data
          if (this.friendsList.length > 0) {
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

.loading
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;

.loader
  width: 4rem;
  height: 4rem;

.loader-text
  margin-top: 4rem;
  font-size: 1.5rem;
  font-weight: 800;

#friends-content
  overflow: auto
  top: 80px

.friend-item
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

#add-friend
  position: absolute
  right: 7rem

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
