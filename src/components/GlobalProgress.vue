<template>
  <GlobalLayer>
    <div>
      <div class="progress">
        <div class="track"></div>
      </div>
      <div class="text">Loading...</div>
    </div>
  </GlobalLayer>
</template>

<script>
import GlobalLayer from '@/components/GlobalLayer.vue';

export default {
  name: 'GlobalProgress',
  components: {
    GlobalLayer,
  },
  props: ['progress'],
};
</script>
<style lang="sass" scoped>
.progress
  position: relative
  width: 200px
  height: 5px
  background: #888

.track
  position: absolute
  left: 0
  top: 0
  height: 100%
  width: 0
  transition: width 0.2s linear
  background: #FFF
  box-shadow: 0 0 5px #FFF

.text
  text-align: center
  font-size: 13px
  color: #FFF;
  margin-top: 5px
  line-height: 20px
</style>
