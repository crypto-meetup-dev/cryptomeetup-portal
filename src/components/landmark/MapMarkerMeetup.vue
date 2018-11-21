<template>
  <div class="marker-meetup" @click="openPopup"></div>
</template>

<script>
export default {
  name: 'MapMarkerMeetup',
  props: ['coord'],
  methods: {
    openPopup() {
      this.$emit('click', this.coord);
    },
  },
};
</script>
<style lang="sass" scoped>
.marker-meetup,
.marker-meetup::before
  position: relative
  box-sizing: border-box

.marker-meetup
  color: #4EFFF3
  cursor: pointer

.marker-meetup::before
  content: ''
  display: inline-block
  float: none
  background-color: currentColor
  border: 0 solid currentColor

.marker-meetup
  width: 32px
  height: 32px

.marker-meetup::before
  width: 32px
  height: 32px
  background: transparent
  border-width: 4px
  border-radius: 100%
  opacity: 0
  animation: ball-scale-ripple 1s 0s infinite cubic-bezier(.21, .53, .56, .8)

@keyframes ball-scale-ripple
  0%
    opacity: 1
    transform: scale(.1)
  70%
    opacity: .65
    transform: scale(1)
  100%
    opacity: 0
</style>
