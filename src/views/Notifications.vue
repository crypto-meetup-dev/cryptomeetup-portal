<template>
  <div>
    <div v-show="!dataIsReady" class="nofity-loading">
      <div class="loader"></div>
      <div class="loader-text">这里什么都没有...</div>
    </div>
    <ul id="notification-content">
      <li v-for="(item, index) in resList" :key="index" :item="item.message" >
        <div class="notify-item" :id="item.notifyGlobalId">
          <div>
            <p class="notify-title">{{ item.title }}</p>
            <p class="notify-body">{{ item.body }}</p>
          </div>
          <div class="assigns">
            <div class="confirm-btn"
              @click="() => { confirm(index, item.notifyGlobalId) }"
            >
              <b-icon icon="check" size="is-medium" type="is-success" />
            </div>
            <div class="deny-btn"
              @click="() => { deny(index, item.notifyGlobalId) }"
            >
              <b-icon icon="close" size="is-medium" type="is-danger" />
          </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- mobile -->
    <b-modal :active.sync="mobileNotification" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div class="about-box">
        <h1  v-show="mobileNotification">
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
import Axios from 'axios'

export default {
  components: {
    offline
  },
  props: {
    notificationShow: {
      type: Boolean,
      default: true,
    },
    mobileNotificationShow: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      mobileNotification: false,
      url: process.env.MTTKIMGCDN,
      email: '',
      resList: [],
      dataIsReady: false
    }
  },
  created () {
    this.mobileNotification = this.mobileNotificationShow
  },
  methods: {
    ...mapActions(['invite']),
    CloseNotificationView() {
      this.$emit('CloseNotificationView', null);
    },
    confirm(index, id) {
      console.log(id)
      const elem = document.getElementById(id);
      let opacity = 0;
      // eslint-disable-next-line no-use-before-define
      const intervalId = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(intervalId);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      this.resList.splice(index, 1)
    },
    deny (index, id) {
      const elem = document.getElementById(id);
      let opacity = 0;
      // eslint-disable-next-line no-use-before-define
      const intervalId = setInterval(frame, 5);
      function frame() {
        if (opacity === 100) {
          clearInterval(intervalId);
        } else {
          opacity++;
          elem.style.opacity = opacity / 100;
        }
      }
      this.resList.splice(index, 1)
    },
    handleConnectivityChange(status) {
      
    },
    CloseUserProfileView() {
      this.userProfileShow = !this.userProfileShow
    },
    CloseAboutView() {
      this.aboutShow = !this.aboutShow;
    },
    CloseMobileAboutView() {
      this.mobileAboutShow = !this.mobileAboutShow;
    },
    CloseMobileUserProfileView() {
      this.mobileAboutShow = !this.mobileUserProfileShow
    },
    CloseMobileNotificationView() {
      this.mobileNotificationShow = !this.mobileNotificationShow
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
    mobileNotificationShow(showing) {
      // if (showing === false) {
      //   this.$emit('CloseMobileAboutView', null);
      // }
      this.mobileAbout = showing
      if (!showing) {
        this.$emit('CloseMobileNotificationView', null);
      }
    },
  },
  computed: {
    ...mapState(['userProfile', 'userId'])
  },
  mounted() {
    this.myInterval = window.setInterval(() => {
      setTimeout(() => {
        Axios.get(process.env.VUE_APP_CMUAPI + '/notification/push?id=' + this.userId).then(res => {
          console.log(res.data)
          this.resList = res.data
          this.dataIsReady = true
        })
      }, 1)
    }, 10000);
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

.nofity-loading
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


.assigns
  margin-right: 1rem
  margin-left: 1rem
  display: flex;
  flex-direction: column;
  justify-content: center; 

.confirm-btn
  border: 2px solid #ffd83f;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

.confirm-btn:hover
  border: 2px solid #FFBC32;
  background-color: #F4F2EF;

.deny-btn
  border: 2px solid #ffd83f;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background-color: #fff;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;

.deny-btn:hover
  border: 2px solid #FFBC32;
  background-color: #F4F2EF;

.notify-item 
  display: flex;
  height: 8rem;
  color: black;
  background-color: #FFFCF9;
  border-radius: 1rem;
  margin: 1.5rem;
  align-self: center;
  justify-content: center;

.notify-title
  position: relative;
  font-size: 1.2rem;
  font-weight: 700;
  margin-left: 1rem;
  margin-top: 1rem;

.notify-body
  margin-top: 0.5rem;
  text-overflow: ellipsis;
  margin-left: 1rem;
  overflow: hidden;
  max-width: 681px;
  min-width: auto;
  display: inline-block;
  height: 70px;
  margin-right: 6rem;
  
#back
  left: 1rem

#notification
  position: absolute
  right: 1rem 

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
