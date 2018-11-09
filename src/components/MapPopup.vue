<template>
  <div class="popup">
    <div class="content popup-content">
      <h3>{{ title }}</h3>
      <div class="popup-item"><span class="icon is-small"><i class="mdi mdi-map-marker"></i></span> {{ location }}</div>
      <div class="popup-item"><span class="icon is-small"><i class="mdi mdi-clock-outline"></i></span> {{ date }}</div>
      <div class="popup-item"><a :href="link" target="_blank"><span class="icon is-small"><i class="mdi mdi-open-in-new"></i></span> Details</a></div>
      <div class="popup-item" v-if="canCheckIn">
        <button class="button is-small is-primary is-fullwidth is-rounded">Check In</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapPopup',
  props: ['title', 'location', 'date', 'link'],
  data() {
    return {
      canCheckIn: false,
    }
  },
  methods: {
    setCanCheckIn(v) {
      this.canCheckIn = v;
    },
  },
};
</script>
<style lang="sass" scoped>
.popup
  h1, h2, h3, h4, h5
    color: #000

.popup-item
  margin: 0.5rem 0
</style>
