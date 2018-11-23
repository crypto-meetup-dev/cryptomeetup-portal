<template>
    <form action="">
        <div class="modal-card" style="min-width: 500px; width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Invite friends to get rewards</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Invite connection">
                    <b-field>
                        <b-input
                                id="refLink"
                                v-bind:value="getRefer()"
                                readonly
                                expanded>
                        </b-input>
                        <p class="control">
                            <a class="button is-primary" @click="copy">
                                copy
                            </a>
                        </p>
                    </b-field>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-rounded" @click="$parent.close()">close</button>
            </footer>
        </div>
    </form>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'InviteModal',
        methods: {
            getRefer () {
                const loc = window.location
                return `${loc.protocol}//${loc.host}/?#/invite/${this.scatterAccount.name}`
            },
            copy () {
                this.$copyText(this.getRefer()).then(() => {
                    this.$toast.open({
                        message: 'Invitation link has been copied to the clipboard',
                        type: 'is-success',
                        duration: 3000,
                        position: 'is-bottom',
                        queue: false
                    })
                    this.$parent.close()
                }, () => {
                    this.$toast.open({
                        message: 'Invitation link replication failed, please copy manually',
                        type: 'is-danger',
                        duration: 5000,
                        position: 'is-bottom',
                        queue: false
                    })
                })
            }
        },
        computed: {
            ...mapState(['identity', 'scatterAccount']),
        }
    }
</script>