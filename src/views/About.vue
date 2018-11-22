<template>
  <div>
    <div :class="['country-detail', {'is-active': aboutShow}]">
      <div class="globe-control">
        <div style="position: absolute;top: 2rem;left: 5rem;">
          <button class="globe-control-item button is-hidden-mobile is-white is-small is-rounded is-outlined"
                  v-show="aboutShow"
                  @click="CloseAboutView"
          >
            <b-icon icon="arrow-left" size="is-small" />&nbsp;{{$t('back')}}
          </button>
        </div>
      </div>
      <h1  v-show="aboutShow">
        <div class="content"
          v-html="$t('ABOUT_CONTENT')">
        </div>
      </h1>
    </div>
    <!-- mobile -->
    <b-modal :active.sync="mobileAboutShow" style="background-color: rgba(10, 10, 10, 0.8);align-items: flex-start;">
      <b-icon icon="" size="is-big" />&nbsp;
      <div>
      <h1  v-show="mobileAboutShow">
        <div class="content"
          v-html="$t('ABOUT_CONTENT')">
        </div>
      </h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import aboutEn from '../i18n/about_en.md';
import aboutJp from '../i18n/about_jp.md';
import aboutRu from '../i18n/about_ru.md';
import aboutZh from '../i18n/about_zh.md';
import aboutTw from '../i18n/about_tw.md';

export default {
  props: {
    aboutShow: {
      type: Boolean,
      default: false,
    },
    mobileAboutShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    CloseAboutView() {
      this.$emit('CloseAboutView', null);
    },
  },
  component:{
    aboutEn,
    aboutJp,
    // about_ko,
    aboutRu,
    aboutTw,
    aboutZh,
  },
  watch: {
    mobileAboutShow(showing) {
      if (showing === false) {
        this.$emit('CloseMobileAboutView', null);
      }
    },
  },
  mounted () {
  },
};
</script>

<style lang="sass" scoped>
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";

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
