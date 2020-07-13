<template>
  <div>
    <div v-show="!dataIsReady" class="loading">
      <div class="loader"></div>
      <div class="loader-text">这里什么都没有...</div>
    </div>
    <div>
      <ul id="friends-content">
        <li v-for="(item, index) in friendsList" :key="index" :item="item" >
          <div class="friend-item">
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
                <div class="map-marker"

                >
                  <b-icon icon="map-marker-radius" size="is-medium"/>
                </div>
                <div class="dismiss-marker"

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
      url: process.env.VUE_APP_CMUAPI 
    }
  },
  created () {
    this.mobileFriends = this.mobileFriendsShow
  },
  methods: {
    ...mapActions(['invite']),
    CloseUserProfileView() {
      this.$emit('CloseUserProfileView', null);
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
    this.myInterval = window.setInterval(() => {
      setTimeout(() => {
        Axios.get(process.env.VUE_APP_CMUAPI + '/friends?id=' + this.userId).then(res => {
          console.log(res.data)
          this.friendsList = res.data
          if (this.friendsList.length > 0) {
            this.dataIsReady = true
          }
        })
      }, 1)
    }, 10000);   
  },
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
  letter-spacing: 1rem;
  font-weight: 800;

#back
  left: 1rem

#notification
  position: absolute
  right: 1rem 

#friends
  position: absolute
  right: 4rem

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

.map-marker
  margin-right: 1.5rem
  color: #21BEDA

.map-marker:hover
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
