<template>
  <div class="spinner-container" :style="{ zIndex: zIndex }">
    <div class="sk-cube-grid">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
    <div class="spinner-text">{{loadText}}</div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loadText: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: 10000,
    },
  },
  data: () => ({}),
};
</script>

<style lang="sass" scoped>

.spinner-container
  position: absolute
  background-color: #000000
  width: 100vw
  height: 100vh
  text-align: center
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column

.sk-cube-grid
  width: 80px
  height: 80px

.spinner-text
  color: #FFF
  margin-top: 2rem
  margin-bottom: 1rem

.sk-cube-grid .sk-cube
  width: 33%
  height: 33%
  background-color: #FFF
  float: left
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out

.sk-cube-grid .sk-cube1
  -webkit-animation-delay: .2s
  animation-delay: .2s

.sk-cube-grid .sk-cube2
  -webkit-animation-delay: .3s
  animation-delay: .3s

.sk-cube-grid .sk-cube3
  -webkit-animation-delay: .4s
  animation-delay: .4s

.sk-cube-grid .sk-cube4
  -webkit-animation-delay: .1s
  animation-delay: .1s

.sk-cube-grid .sk-cube5
  -webkit-animation-delay: .2s
  animation-delay: .2s

.sk-cube-grid .sk-cube6
  -webkit-animation-delay: .3s
  animation-delay: .3s

.sk-cube-grid .sk-cube7
  -webkit-animation-delay: 0s
  animation-delay: 0s

.sk-cube-grid .sk-cube8
  -webkit-animation-delay: .1s
  animation-delay: .1s

.sk-cube-grid .sk-cube9
  -webkit-animation-delay: .2s
  animation-delay: .2s
  
@-webkit-keyframes sk-cubeGridScaleDelay
  0%,100%,70%
    -webkit-transform: scale3D(1,1,1)
    transform: scale3D(1,1,1)
  35%
    -webkit-transform: scale3D(0,0,1)
    transform: scale3D(0,0,1)

@keyframes sk-cubeGridScaleDelay
  0%,100%,70%
    -webkit-transform: scale3D(1,1,1)
    transform: scale3D(1,1,1)
  35%
    -webkit-transform: scale3D(0,0,1)
    transform: scale3D(0,0,1)

</style>

