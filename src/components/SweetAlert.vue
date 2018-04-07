<template>
    <div>
      <sweet-modal blocking :icon="icon" ref="modal">{{message}}</sweet-modal>
    </div>
</template>

<script>
export default {
  data () {
    return {
      icon: null,
      message: null
    }
  },
  mounted () {
    this.$events.listen('SHOW_NOTIFICATION', payload => {
      this.icon = payload.icon
      this.message = payload.message
      this.$refs.modal.open()
    })
  }
}
</script>
