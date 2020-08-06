<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { disassemble } from '../util/cookies'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(['setLoggedIn']),
  },
  watch: {
    id(val) {
      val = val.replace('callback&token=', '')
      const res = disassemble(val)
      this.setLoggedIn(res)
      this.$router.push('/map')
    }
  },
  mounted () {
    if (this.id) {
      const id = this.id.replace('callback&token=', '')
      const res = disassemble(id)
      this.setLoggedIn(res)
      this.$router.push('/map')
    }
  }
}
</script>
