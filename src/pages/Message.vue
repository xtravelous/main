<template>
	<v-container grid-list-md>
		<div class="pt-1">
			<v-card tile flat>
				<v-card-title class="orange darken-2" dark tabs flat>
					<div class="headline white--text" v-if="traveler.firstName">Conversation with {{traveler.firstName}} {{traveler.lastName || ''}}</div>
					<div v-else class="headline white--text">Conversation with host</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12 sm5 md5 lg5 xl5></v-flex>
						<v-flex xs12 sm7 md7 lg7 xl7>
							<v-card>
								<v-card-text>
									<v-text-field
									label="Type your message here..."
									multi-line
									v-model="message"
									></v-text-field>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn @click="send" depressed class="orange darken-1 white--text" :loading="sendButtonDisabled" :disabled="sendButtonDisabled">Send Message <v-icon right>send</v-icon></v-btn>
								</v-card-actions>
							</v-card>
							<div class="mt-4">
								<div class="text-xs-center">
									<v-progress-circular indeterminate :size="50" color="primary" v-if="loader"></v-progress-circular>
								</div>
								<div v-for="m in orderBy(messages, 'createdAt', -1)" :key="m.id" class="mt-4">
									<v-card :class="[m.userId === user.uid ? 'grey lighten-2' : '']">
										<v-card-title>
											<div class="title">
												{{m.userData.firstName}} {{m.userData.lastName || ''}}
											</div>
										</v-card-title>
										<v-card-text>
											<p>
												{{m.message}}
											</p>
											<p>
												{{m.createdAt | readableDate}}
											</p>
										</v-card-text>
									</v-card>
								</div>
							</div>
						</v-flex>
					</v-layout>
				</v-card-text>
			</v-card>
		</div>
		<sweet-modal blocking :icon="sweetModal.icon" ref="sweetModal">{{sweetModal.message}}</sweet-modal>
	</v-container>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
export default {
	created () {
		if (this.$route.params.booking_id) {
			this.traveler = Object.assign({}, this.$route.params.traveler)
			this.loader = true
			this.$store.dispatch('messages/GET_MESSAGES', this.$route.params.booking_id)
			.then((response) => {
				console.log(response)
				this.loader = false
				this.messages = response
			})
		}
	},
	data: () => ({
		message: null,
		sendButtonDisabled: false,
		messages: [],
		loader: false,
		traveler: {},
		sweetModal: {
			icon: null,
			message: null
		}
	}),
	methods: {
		send () {
			if (!this.message) return
				this.sendButtonDisabled = true
			this.$store.dispatch('messages/SEND_MESSAGE', {message: this.message, bookingId: this.$route.params.booking_id})
			.then((response) => {
				this.sendButtonDisabled = false
				this.message = null
				this.messages.push(response)
				setTimeout(() => {
					this.sweetModal.icon = 'success'
					this.sweetModal.message = 'Message sent.'
					this.$refs.sweetModal.open()
					setTimeout(() => {
						this.$refs.sweetModal.close()
					}, 2000)
				}, 250)
			})
		}
	},
	computed: {
		...mapGetters({
			user: 'accounts/GET_USER'
		})
	},
	filters: {
		readableDate (val) {
			return moment(val).format('MMMM D, YYYY h:mm A')
		}
	}
}
</script>

<style scoped>

</style>