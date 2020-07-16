<template>
  <div>
    <div :class="['country-detail', {'is-active': userProfileShow}]">
      <div class="globe-control">
        <div style="width: 100%; position: absolute;top: 2rem; left: 0;">
          <button id="back" class="globe-control-item button is-white is-small is-rounded is-outlined"
                  v-show="userProfileShow"
                  @click="CloseUserProfileView"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
          <button id="add-friend" class="globe-control-item button is-white is-small is-rounded is-outlined"
                  @click="openInvite"
            >      
            <b-icon icon="plus" size="is-small" />&nbsp;{{$t('invite')}}
          </button>
          <button id="friends" class="globe-control-item button is-white is-small is-rounded is-outlined"
              @click="showFriends"
          >
            <b-icon icon="human-handsup" size="is-small" />&nbsp;{{$t('friends')}}
          </button>

          <button id="notification" class="globe-control-item button is-white is-small is-rounded is-outlined"
              @click="showNotification"
          >
            <b-icon icon="bell-outline" size="is-small" />&nbsp;{{$t('notifications')}}
          </button>
        </div>
      </div>
      <div id="invite-overlay">
        <div id="invite-tablecellWrap" >
            <div id="invite-closer"></div>
            <div id="invite-wrapper">
                <div class="invite-content">
                    <h2 class="invite-title">Invite</h2>
                    <h4>Send Invitation to <span class="mtt-name">Matataki.io</span> Friends to Share Your Location</h4>
                    <form class="invite-form" @keyup.enter="sendInvite">
                        <input type="text" name="form-email" class="invite-form-field" placeholder="Email Address"
                            maxlength="50" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required v-model="email">
                        <input type="button" class="invite-form-submit" id="login-btn" :value="$t('invite')" @click="sendInvite">
                    </form>
                </div>
            </div>
        </div>
      </div>
      <h1 v-show="userProfileShow" class="pc-about-h1">
        <div v-show="userContentShow" class="content pc-content">
          <img class="avatar" :src="url + this.userProfile.avatar" />
          <div class="status-line">
            <offline @detected-condition="handleConnectivityChange">
                <div slot="online" class="status">
                  <div class="green-circle"></div>
                  <div class="online-status">{{$t('online')}}</div>
                </div>
                <div slot="offline" class="status">
                  <div class="red-circle"></div>
                  <div class="offline-status">{{$t('offline')}}</div>
                  <div class="last-seen"></div>
                </div>
              </offline>
          </div>
          <div class="name">{{ this.userProfile.nickname }}</div>
          <div class="introduction">{{ this.userProfile.introduction }}</div>
          <a class="matataki-link" :href=" 'https://matataki.io/user/' + userId">
            <img class="matataki-logo" src="../../public/matataki-white.svg" />
          </a>
        </div>
      </h1>
      <Notificationview
        v-show="notificationShow"
        :notificationShow="notificationShow"
        :mobileNotificationShow="mobileNotificationShow"
      />
      <Friendsview
        v-show="friendsShow"
        :friendsShow="friendsShow"
        :mobileFriendsShow="mobileFriendsShow"
      />
    </div>
    <!-- mobile -->
    <b-modal :active.sync="mobileUserProfile" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div class="about-box">
        <h1 v-show="mobileUserProfile">
          <div class="content">    
          </div>
        </h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Notificationview from '@/views/Notifications.vue'
import Friendsview from '@/views/Friends.vue'
import offline from 'v-offline';
import Axios from 'axios';
import { getCookie, disassemble } from '../util/cookies';

export default {
  components: {
    offline,
    Notificationview,
    Friendsview
  },
  props: {
    userProfileShow: {
      type: Boolean,
      default: true,
    },
    mobileUserProfileShow: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      friendsShow: false,
      mobileFriendsShow: false,
      userContentShow: true,
      mobileUserContentShow: false,
      mobileUserProfile: false,
      url: process.env.VUE_APP_MTTKIMGCDN,
      email: '',
      resList: [],
      notificationShow: false,
      mobileNotificationShow: false,
    }
  },
  created () {
    this.mobileUserProfile = this.mobileUserProfileShow
  },
  methods: {
    ...mapActions(['invite']),
    sendInvite() {
      this.invite({ email: this.email, invitationSentMsg: this.$t('invitationSent'), invitationSentFailedMsg: this.$t('invitationSentFailed') })
      const elem = document.getElementById('invite-overlay');
      let opacity = 100;
      // eslint-disable-next-line no-use-before-define
      const id = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(id);
        } else {
          opacity--;
          elem.style.opacity = opacity / 100;
        }
      }
    },
    showUserProfile() {
      this.userContentShow = !this.userContentShow
      this.notificationShow = !this.notificationShow
      this.friendsShow = !this.friendsShow
    },
    showNotification() {
      this.notificationShow = !this.notificationShow
      this.userContentShow = !this.notificationShow
      this.mobileUserContentShow = false
      this.friendsShow = false
    },
    showFriends() {
      this.friendsShow = !this.friendsShow
      this.userContentShow = !this.friendsShow
      this.mobileUserContentShow = false
      this.notificationShow = false
    },
    CloseUserProfileView() {
      this.$emit('CloseUserProfileView', null);
    },
    handleConnectivityChange(status) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/user/update/status?id=' + this.userId + '&status=' + status)
    },
    openInvite() {
      document.getElementById('invite-overlay').style.cssText = 'opacity: 0; display: table;';
      const elem = document.getElementById('invite-overlay');
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
      document.getElementById('invite-closer').addEventListener('click', () => {
        document.getElementById('invite-overlay').style.cssText = 'display: none;';
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
    ...mapState(['userProfile', 'userId'])
  },
  mounted() {
  },
  destroyed() {
  }
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

#back
  left: 1rem

#notification
  position: absolute
  right: 2rem 

#friends
  position: absolute
  right: 6.5rem

#add-friend
  position: absolute
  right: 11rem

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

.status-line
  margin-top: 1.5rem
  align-content: center
  align-items: center
  text-align: center
  justify-content: center
  font-weight: 500

  color: black

.status
  padding: 0.8rem
  background-color: white
  width: fit-content
  height: auto
  border-radius: 1rem
  display: flex;
  align-items: center;
  margin: 0 auto;

.online-status 
  position: relative
  display: inline-block
  padding-right: 1rem

.green-circle
  display: inline-block
  position: relative
  width: 1.1rem
  height: 1.1rem
  margin-left: 1rem
  margin-right: 1rem
  border-radius: 50%
  background-color: #269D36

.offline-status
  position: relative
  display: inline-block
  padding-right: 1rem

.red-circle
  display: inline-block
  position: relative
  width: 1.1rem
  height: 1.1rem
  margin-left: 1rem
  margin-right: 1rem
  border-radius: 50%
  background-color: #D83434

.content
  margin-top: 5rem
  padding-right: 20px
  justify-content: center
  align-items: center
  text-align: center

.avatar 
  width: 200px
  height: 200px
  border-radius: 100px

.name 
  margin-top: 1.5rem
  font-size: 2rem
  font-weight: 500 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;

.introduction
  font-size: 1.2rem
  margin-top: 1.5rem

.matataki-logo
  width: 50px
  margin-top: 3rem
  
.pc-content
  padding-left: 20px
  padding-right: 20px

.pc-about-h1
  overflow-y: scroll
  padding-bottom: 40px

.pc-about-h1::-webkit-scrollbar
  width: 6px
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-track
  background-color: transparent

.pc-about-h1::-webkit-scrollbar-thumb
  background-color: #fff
  border-radius: 3px

#invite-overlay 
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%
    max-width: 550px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 30;


#invite-tablecellWrap 
    display: table-cell;
    vertical-align: middle;
    text-align: center;


#invite-closer 
    position: absolute;
    top: 0;
    left: 0;
    z-index: 35;
    width: 100%;
    height: 100%;
    cursor: pointer;


#invite-wrapper 
    display: inline-block;
    position: relative;
    top: 0;
    left: 0;
    z-index: 40;


/* content */

.mtt-name 
  color: #6c4be0;


.invite-content 
    border-radius: 20px;
    box-sizing: border-box;
    padding: 40px;
    background-color: #000;
    width: 380px;


.invite-form 
  margin-top: 1rem;


.invite-form-field 
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


.invite-form-field:focus 
    outline: none;


.invite-form-submit 
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


.invite-form-submit:hover 
    background-color: #000;
    color: #fff;
    border: 3px solid rgba(255, 216, 63, 1.000);


.invite-form-submit:focus 
  outline: none;


.invite-title 
    font-family: Arial, Arial, Helvetica, sans-serif;
    color: #fff;
    font-size: 40px;
    line-height: 125%;
    letter-spacing: 1.3px;
    margin: 1rem 0 1rem 0;

</style>
