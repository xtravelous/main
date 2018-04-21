<template>
	<v-container>
		<div class="pt-1">
			<v-card tile flat>
				<v-card-title class="orange darken-2" dark tabs flat>
					<div class="headline white--text">Booking details</div>
					<v-spacer></v-spacer>
					<v-btn @click="messageHost" v-if="!$route.query.user"><v-icon left>message</v-icon> Message host</v-btn>
					<v-btn @click="messageTraveler" v-else><v-icon left>message</v-icon> Message traveler</v-btn>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12 sm12 md6 lg6 xl6>
							<div class="experience-title grey--text text--darken-2">Booking date</div>
							<div class="experience-sub grey--text text--darken-2">
								{{booking.createdAt | readableDate}}
							</div>
							<v-divider class="mt-3 mb-3"></v-divider>
							<div class="experience-title grey--text text--darken-2">Address</div>
							<div class="experience-sub grey--text text--darken-2">
								{{experience.location.name || ''}} <br>
								{{experience.location.streetAddress || ''}}, {{experience.location.city || ''}}, {{experience.location.zipCode || ''}}
							</div>
							<div class="mt-5 text-xs-center" v-if="!$route.query.user">
								<v-btn large color="orange darken-1" dark @click="openReviewDialog">Leave a review</v-btn>
							</div>
						</v-flex>
						<v-flex xs12 sm12 md1 lg1 xl1></v-flex>
						<v-flex xs12 sm12 md5 lg5 xl5>
							<v-layout row wrap>
								<v-flex xs9 sm9 md9 lg9 xl9>
									<div class="experience-title grey--text text--darken-2">{{experience.name}}</div>
									<div class="experience-sub grey--text text--darken-2">{{experience.noOfDays}} day experience</div>
									<div v-if="$route.query.user" class="experience-sub grey--text text--darken-2">Hosted by {{user.firstName || ''}} {{user.lastName || ''}}</div>
									<div v-else class="experience-sub grey--text text--darken-2">Hosted by <a @click.prevent="viewHost">{{experience.user.firstName || ''}} {{experience.user.lastName || ''}}</a></div>
								</v-flex>
								<v-flex xs3 sm3 md3 lg3 xl3>
									<img :src="experience.thumbURL" alt="thumbnail" class="thumbnail">
								</v-flex>
							</v-layout>
							<v-divider class="mt-3 mb-3"></v-divider>
							<div class="experience-sub grey--text text--darken-2">{{booking.date.from}} - {{booking.date.end}}</div>
							<div class="experience-sub grey--text text--darken-2">{{booking.time.from}} - {{booking.time.to}}</div>
							<v-divider class="mt-3 mb-3"></v-divider>
							<v-layout row wrap v-if="booking.people">
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-sub grey--text text--darken-2">
										{{experience.price | currency('₱')}} x {{booking.people}}
									</div>
								</v-flex>
								<v-flex xs6 sm6 md6 lg6 xl6>
										<div class="experience-title grey--text text--darken-3 text-xs-right">{{experience.price * booking.people | currency('₱')}}</div>
								</v-flex>
							</v-layout>
							<v-layout row wrap>
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-sub grey--text text--darken-2">Total (PHP)</div>
								</v-flex>
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-title grey--text text--darken-3 text-xs-right">{{experience.price | currency('P')}}</div>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card-text>
			</v-card>
		</div>
		<v-dialog max-width="400" v-model="reviewDialog">
			<v-card>
				<v-card-title class="grey darken-1 white--text">
					<div class="title">Leave a review</div>
				</v-card-title>
				<v-card-text>
					<v-text-field
					label="Type your message here..."
					multi-line
					v-model="review.message"
					></v-text-field>
					<div class="text-xs-center">
						<vue-stars
						name="demo"
						active-color="#FB8C00"
						inactive-color="#999999"
						shadow-color="#FFB74D"
						hover-color="#FB8C00"
						:max="5"
						:readonly="false"
						char="★"
						v-model="review.rating"
						class="star-size"
						/>
					</div>
					<p class="display-1 mt-2 grey--text text--darken-2 text-xs-center" v-show="review.rating > 0">
						{{review.rating}}/5
					</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn depressed class="orange darken2 white--text" @click="submitReview" :disabled="reviewSubmitDisabled" :loading="reviewSubmitDisabled">Submit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<sweet-modal blocking :icon="sweetModal.icon" ref="sweetModal">{{sweetModal.message}}</sweet-modal>
	</v-container>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
import VueStars from 'vue-stars'
export default {
	created () {
		console.log(this.$route.params.booking)
		if (this.$route.params.booking) {
			// if (this.$route.params.booking.userId !== this.user.uid) {
			// 	this.$router.push({name: 'Home'})
			// 	return
			// }
			this.experience = Object.assign({}, this.$route.params.booking.experienceData)
			this.booking =  Object.assign({}, this.$route.params.booking)
		} else {
			this.$router.push({name: 'Home'})
		}
	},
	data: () => ({
		experience: {},
		booking: {},
		reviewDialog: false,
		review: {
			message: null,
			rating: 0
		},
		reviewSubmitDisabled: false,
		sweetModal: {
			icon: null,
			message: null
		}
	}),
	methods: {
		messageHost () {
			this.$router.push({name: 'Message', params: { booking_id: this.booking.id }})
		},
		messageTraveler () {
			this.$router.push({name: 'Message', params: { booking_id: this.booking.id, traveler:  this.$route.params.booking.userData}})
		},
		openReviewDialog () {
			this.reviewDialog = true
		},
		submitReview () {
			if (!this.review.message || this.review.rating < 1) {
				return
			}
			this.reviewSubmitDisabled = true
			const data = {
				message: this.review.message,
				rating: this.review.rating,
				experienceId: this.booking.experienceId
			}
			this.$store.dispatch('reviews/ADD_REVIEW', data)
			.then((response) => {
				this.reviewDialog = false
				this.reviewSubmitDisabled = false
				this.review = Object.assign({}, {
					message: null,
					rating: 0
				})
				setTimeout(() => {
					this.sweetModal.icon = 'success'
					this.sweetModal.message = 'Review has been successfully submitted.'
					this.$refs.sweetModal.open()
					setTimeout(() => {
						this.$refs.sweetModal.close()
					}, 2000)
				}, 250)
			})
		},
		viewHost () {
			this.$router.push({name: 'HostProfile', params: {
				id: this.experience.uid,
				host: this.experience.user
			}})
		}
	},
	computed: {
		...mapGetters({
			user: 'accounts/GET_USER'
		})
	},
	components: {
		'vue-stars': VueStars
	},
	filters: {
		readableDate (val) {
			return moment(val).format('MMMM D, YYYY h:mm A')
		}
	},
	watch: {
		reviewDialog (val) {
			if (!val) {
				this.review = Object.assign({}, {
					message: null,
					rating: 0
				})
			}
		}
	}
}
</script>

<style scoped>
.fieldset {
	border: 1px solid grey;
	-moz-border-radius:2px;
	-webkit-border-radius:2px;	
	border-radius:2px;
}

.experience-title {
	font-size: 21px;
}

.experience-sub {
	font-size: 19px;
	font-weight: 350;
}

.thumbnail {
	height: auto;
	width: 100%;
	max-width: 100%;
}

.star-size {
	font-size: 30px;
}
</style>