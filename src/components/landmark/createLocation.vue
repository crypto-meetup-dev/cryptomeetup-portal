<template>
  <div class="create-cocation" @click="createLocation">
    <i class="add-icon" /><span>创建地标</span>
  </div>
</template>

<script>
export default {
  name: 'createLocation',
  methods: {
    createLocation() {
      this.$emit('openCreatePopup')
    },
  },
};
</script>
<style lang="sass" scoped>
  .create-cocation
    font-size: 18px
    color: #fff
    cursor: pointer

  .add-icon
    display: inline-block
    width: 16px
    height: 2px
    position: relative
    background-color: #fff
    top: -5px
    margin-right: 4px

  .add-icon::after
    content: "";
    position: absolute
    width: 2px
    height: 16px
    background-color: #fff
    top: -7px
    left: 7px
</style>
<style lang="sass">
.create-location-popup
  .mapboxgl-popup-content
    background: #0AB5FF

  .mapboxgl-popup-anchor-top-right,
  .mapboxgl-popup-anchor-top,
  .mapboxgl-popup-anchor-top-left
    .mapboxgl-popup-tip
      border-bottom-color: #0AB5FF

  .mapboxgl-popup-anchor-bottom-right,
  .mapboxgl-popup-anchor-bottom-left,
  .mapboxgl-popup-anchor-bottom
    .mapboxgl-popup-tip
      border-top-color: #0AB5FF

.create-location-popup .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip, 
.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip, 
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip
  border-top-color: #0AB5FF

</style>
