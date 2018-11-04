<template>
  <div class="meetup-container">
    <img class="meetup-img" :src="data.imgurl" alt="">
    <div class="meetup-info">
      <div class="meetup-title">{{data.title}}</div>
      <div class="meetup-time-loaction"><span>{{data.date}}</span><span style="float:right;">{{data.location}}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeetupBox',
  props: ['data'],
  data: () => ({}),
  computed: {
  },
  methods: {
  },
};
</script>
<style lang="sass" scoped>
.meetup-container
  width: 14rem;
  font-size: 0;
  display: inline-block;
  margin-right: 1rem;
  margin-bottom: 1rem;

.meetup-img
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

.meetup-info
  border: 1px solid #9b9ea0;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-sizing: border-box;

.meetup-title
  padding: 5px 10px 0 10px;
  font-size: 0.9rem;

.meetup-time-loaction
  padding: 10px;
  color: #9b9ea0;
  font-size: 0.8rem;
</style>

