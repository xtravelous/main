<template>
	<v-container>
		<sweet-modal blocking :icon="icon" ref="modal" @close="redirect">{{message}}</sweet-modal>
		<div class="text-xs-center" style="mt-5">
			<h1 class="grey--text text--darken-3">{{message}}</h1> <br>
			<v-progress-circular indeterminate :size="50" color="orange darken-1" v-show="progress"></v-progress-circular>
		</div>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		status: null,
		icon: null,
		message: 'Please wait...',
		progress: false
	}),
	created () {
		// If payment was made successfully
		this.progress = true
		if (this.$route.query.hasOwnProperty('paymentStatus') && this.$route.query.hasOwnProperty('referenceId')) {
			const paymentStatus = this.$route.query.paymentStatus
			const referenceId = this.$route.query.referenceId
			if (paymentStatus === 'success') {
				this.$store.dispatch('bookings/UPDATE_BOOKING_STATUS', referenceId)
				.then(() => {
					this.notify('success', 'Booking successful!')
					this.progress = false
					setTimeout(() => {
						this.redirect()
					}, 3000);
				})
			}
			else if (paymentStatus === 'cancel') {
				this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: 'Payment cancelled.' })
			}
			else if (paymentStatus === 'error') {
				this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: 'Payment failed.' })
			}
		}
	},
	methods: {
		notify (icon, message) {
			this.icon = icon
			this.message = message
			this.$refs.modal.open()
		},
		redirect () {
			this.$router.push({name: 'MyBookings'})
		}
	}
}
</script>

<style scoped>
.centered {
	position: absolute;
	left: 50%;
	top: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}
</style>