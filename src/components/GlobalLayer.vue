<template>
  <div class="layer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GlobalLayer',
};
</script>
<style lang="sass" scoped>
.layer
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  background: rgba(#000, 0.6)
  z-index: 999
</style>
