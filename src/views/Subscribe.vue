<template>
  <div>
    <div :class="['country-detail', {'is-active': subscribeShow}]">
      <div class="globe-control">
        <div style="width: 100%; position: absolute;top: 2rem; left: 0;">
          <button id="back" class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="subscribeShow"
                  @click="CloseSubscribeView"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
          <button id="create-subscription" class="globe-control-item button is-white is-small is-rounded is-outlined">      
            <b-icon icon="bookmark-plus-outline" size="is-small" />&nbsp;{{$t('createSubscription')}}
          </button>
        </div>
      </div>
      <h1 v-show="subscribeShow" class="pc-about-h1">
        <div class="content pc-content">
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
      dataIsReady: false
    }
  },
  created () {
    this.mobileSubscribe = this.mobileSubscribeShow
  },
  methods: {
    CloseSubscribeView() {
      this.subscribeShow = !this.subscribeShow
      this.$emit('CloseSubscribeView', null);
    },
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
  mounted() {

  },
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

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

.content
  padding-right: 20px

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
</style>
<style>
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
