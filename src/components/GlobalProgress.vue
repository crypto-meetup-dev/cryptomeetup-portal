<template>
  <div class="container">
    <div class="progress">
      <div class="track"></div>
    </div>
    <div class="text">Loading...</div>
  </div>
</template>

<script>
export default {
  name: 'GlobalProgress',
  props: ['progress'],
};
</script>
<style lang="sass" scoped>
.container
  left: 50%
  top: 50%
  width: 180px
  margin-left: -90px
  margin-tio: -15px

.progress
  position: relative
  width: 100%
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
  font-size: 12px
  color: #FFF;
  margin-top: 5px
  line-height: 20px
</style>
