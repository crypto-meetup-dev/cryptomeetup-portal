<template>
  <div class="marker-location"></div>
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
  position: relative

  &::before, &::after
    content: ''
    width: 100%
    height: 100%
    border-radius: 50%
    background-color: #FFC30D
    box-shadow: 0 0 10px #FFC30D
    opacity: 0.6
    position: absolute
    top: 0
    left: 0
    animation: sk-bounce 2.0s infinite ease-in-out

  &::after
    animation-delay: -1.0s

  @keyframes sk-bounce
    0%, 100%
      transform: scale(0.0)
    50%
      transform: scale(1.0)
</style>
