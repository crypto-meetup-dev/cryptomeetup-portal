<template>
  <GlobalLayer>
    <div class="spinner la-2x"><div></div></div>
  </GlobalLayer>
</template>

<script>
import GlobalLayer from '@/components/GlobalLayer.vue';

export default {
  name: 'GlobalSpinner',
  components: {
    GlobalLayer,
  },
};
</script>
<style lang="css" scoped>
.spinner,
.spinner > div {
  position: relative;
  box-sizing: border-box;
}
.spinner {
  display: block;
  font-size: 0;
  color: #fff;
}
.spinner > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.spinner {
  width: 32px;
  height: 32px;
}
.spinner > div {
  width: 32px;
  height: 32px;
  background: transparent;
  border-width: 2px;
  border-bottom-color: transparent;
  border-radius: 100%;
  animation: ball-clip-rotate .75s linear infinite;
}
.spinner.la-2x {
  width: 64px;
  height: 64px;
  margin-top: -32px;
  margin-left: -32px;
}
.spinner.la-2x > div {
  width: 64px;
  height: 64px;
  border-width: 4px;
}
@keyframes ball-clip-rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
