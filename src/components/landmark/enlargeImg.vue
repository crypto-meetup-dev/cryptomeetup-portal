/* eslint-disable */
<template>
  <div v-if="isShow" class="img-box">
    <div class="close" @click="close"><i class="close-icon" /></div>
    <img  class="img" :src="url" />
  </div>
</template>

<script>

export default {
  name: 'enlargeImg',
  props: ['url', 'isShow'],
  data() {
    return {};
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
};
</script>
<style lang="sass" scoped>
  .img-box
    position: absolute
    width: 100%
    height: 100%
    top: 0px
    left: 0px
    display: flex
    align-items: center
    justify-content: center
    z-index: 1000
    background: #000

  .img
    position: absolute
    display: block
    max-width: 100%
    max-height: 100%

  .close
    width: 30px
    height: 30px
    display: block
    position: absolute
    top: 10px
    right: 10px
    border-radius: 50%
    border: 2px solid #fff
    cursor: pointer

  .close-icon
    display: block
    top: 2px
    left: 12px
    height: 20px
    width: 2px
    background: #fff
    position: relative
    transform: rotate(-45deg)

  .close-icon::after
    width: 20px
    height: 2px
    content: ""
    background: #fff
    position: absolute
    top: 9px
    left: -9px
    transform: rotate(1deg)
</style>

