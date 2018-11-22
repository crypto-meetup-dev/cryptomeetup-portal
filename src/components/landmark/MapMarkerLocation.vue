<template>
  <div class="marker-location">
    <img src="../../assets/icons/my-location.png" />
  </div>
</template>

<script>
export default {
  name: 'MapMarkerLocation',
};
</script>
<style lang="sass" scoped>
.marker-location
  width: 30px
  height: 30px
  background: #fff
  border: 1px solid #6070E9
  border-radius: 50%
  position: relative
  img
    width: 22px
    height: 26px
    position: absolute
    top: 2px
    left: 2px
</style>
