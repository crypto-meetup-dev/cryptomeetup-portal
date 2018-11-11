<template>
  <form>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Check In Succeeded!</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Your Redeem Code">
          <b-field>
            <b-input :value="code" readonly expanded></b-input>
            <p class="control">
              <button class="button is-primary" @click="copy">Copy</button>
            </p>
          </b-field>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-rounded is-white is-outlined" @click="$parent.close()">Close</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: 'RedeemCodeCopyDialog',
  props: ['code'],
  methods: {
    copy() {
      this.$copyText(this.code).then(() => {
        this.$toast.open({
          message: 'Redeem code is copied to clipboard!',
          type: 'is-success',
          duration: 3000,
          position: 'is-bottom',
          queue: false,
        });
        this.$parent.close();
      }, () => {
        this.$toast.open({
          message: 'Failed to copy redeem code to clipboard.',
          type: 'is-danger',
          duration: 5000,
          position: 'is-bottom',
          queue: false,
        });
      });
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
