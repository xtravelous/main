<template>
	<v-container grid-list-lg>
		<div class="pt-1">
			<v-card tile flat>
				<v-card-title class="orange darken-2" dark tabs flat>
					<div class="headline white--text" v-if="traveler.firstName">Conversation with {{traveler.firstName}} {{traveler.lastName || ''}}</div>
					<div v-else class="headline white--text">Conversation with host</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12 sm4 md4 lg4 xl4>
							<v-card>
								<v-card-text v-if="hostData.id">
									<div class="text-xs-center">
										<v-avatar size="100px">
											<img :src="hostData.picture" alt="profpic">
										</v-avatar>
										<p class="headline mt-3"><a @click.prevent="viewHost">{{hostData.firstName}} {{hostData.lastName || ''}}</a></p>
										<p>Host</p>
									</div>
								</v-card-text>
								<v-card-text v-else>
									<div class="text-xs-center">
										<v-progress-circular indeterminate :size="50" color="orange darken-2" v-if="loader"></v-progress-circular>
									</div>
								</v-card-text>
							</v-card>
						</v-flex>
						<v-flex xs12 sm8 md8 lg8 xl8>
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
									<v-progress-circular indeterminate :size="50" color="orange darken-2" v-if="loader"></v-progress-circular>
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
import { DB } from '@/services/fireinit.js'
export default {
	created () {
		console.log(this.$route.params)
		if (this.$route.params.booking_id) {
			this.traveler = Object.assign({}, this.$route.params.traveler)
			this.loader = true
			this.$store.dispatch('messages/GET_MESSAGES', this.$route.params.booking_id)
			.then((response) => {
				console.log(response)
				this.loader = false
				this.messages = response
			})
			this.getHostData(this.$route.params.booking_id)
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
		},
		hostData: {}
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
		},
		async getHostData (booking_id) {
			try {
				const bookingDoc = await DB.collection('_bookings').doc(booking_id).get()
				const experienceDoc = await DB.collection('_experiences').doc(bookingDoc.data().experienceId).get()
				const accountDoc = await DB.collection('_accounts').doc(experienceDoc.data().uid).get()
				const hostData =  accountDoc.data()
				hostData.id = accountDoc.id
				if (!hostData.picture) {
					hostData.picture = `https://robohash.org/${hostData.firstName}.png`
				}
				this.hostData = Object.assign({}, hostData)
			} catch (e) {
				throw e
			}
		},
		viewHost () {
			this.$router.push({name: 'HostProfile', params: {
				id: this.hostData.id,
				host: this.hostData
			}})
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