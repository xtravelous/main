<template>
	<v-container>
		<div class="pt-1">
			<v-card tile flat>
				<v-card-title class="grey darken-1" dark tabs flat>
					<div class="headline white--text">Review and Pay</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12 sm12 md6 lg6 xl6>
							<v-container grid-list-md fluid>
								<v-layout row wrap>
									<v-flex xs12>
										<v-text-field
										prepend-icon="people_outline"
										label="How many people are going? (including you)"
										type="number"
										v-model="people"
										min="1"
										></v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-select prepend-icon="credit_card" label="Pay with" :items="['Credit Card']" v-model="payment.method"></v-select>
									</v-flex>
									<v-flex xs6 sm6 md6 lg6 xl6>
										<v-text-field label="First Name" v-model="payment.user.firstName"></v-text-field>
									</v-flex>
									<v-flex xs6 sm6 md6 lg6 xl6>
										<v-text-field label="Last Name" v-model="payment.user.lastName"></v-text-field>
									</v-flex>
								</v-layout>
								<fieldset class="pa-3 mt-4 fieldset">
									<legend class="grey--text text--darken-1">Billing info</legend>
									<v-layout row wrap>
										<v-flex xs12>
											<v-text-field label="Billing address" v-model="payment.billingInfo.address"></v-text-field>
										</v-flex>
										<v-flex xs12>
											<v-text-field label="Billing address line 2 (optional)" v-model="payment.billingInfo.address2"></v-text-field>
										</v-flex>
										<v-flex xs6 sm6 md6 lg6 xl6>
											<v-text-field label="City" v-model="payment.billingInfo.city"></v-text-field>
										</v-flex>
										<v-flex xs6 sm6 md6 lg6 xl6>
											<v-text-field label="Zip Code" v-model="payment.billingInfo.zipCode"></v-text-field>
										</v-flex>
										<v-flex xs6 sm6 md6 lg6 xl6>
											<v-select label="Country" :items="['Philippines']" v-model="payment.billingInfo.country"></v-select>
										</v-flex>
										<v-flex xs6 sm6 md6 lg6 xl6>
											<v-text-field label="Contact number" v-model="payment.billingInfo.contact"></v-text-field>
										</v-flex>
									</v-layout>
								</fieldset>
								<v-btn depressed large :disabled="loading" :loading="loading" class="white--text orange darken-1 mt-4 pl-0 ml-0 hidden-xs-only" @click="confirm">Confirm and Pay</v-btn>
								<v-btn depressed block class="white--text orange darken-1 mt-4 pl-0 ml-0 hidden-sm-and-up">Confirm and Pay</v-btn>
							</v-container>
						</v-flex>
						<v-flex xs12 sm12 md1 lg1 xl1></v-flex>
						<v-flex xs12 sm12 md5 lg5 xl5>
							<v-layout row wrap>
								<v-flex xs9 sm9 md9 lg9 xl9>
									<div class="experience-title grey--text text--darken-2">{{experience.name}}</div>
									<div class="experience-sub grey--text text--darken-2">{{experience.noOfDays}} day experience</div>
									<div class="experience-sub grey--text text--darken-2">Hosted by {{experience.user.firstName || ''}} {{experience.user.lastName || ''}}</div>
								</v-flex>
								<v-flex xs3 sm3 md3 lg3 xl3>
									<img :src="experience.thumbURL" alt="thumbnail" class="thumbnail">
								</v-flex>
							</v-layout>
							<v-divider class="mt-3 mb-3"></v-divider>
							<div class="experience-sub grey--text text--darken-2">{{experienceDate.from}} - {{experienceDate.end}}</div>
							<div class="experience-sub grey--text text--darken-2">{{experienceTime.from}} - {{experienceTime.to}}</div>
							<v-divider class="mt-3 mb-3"></v-divider>
							<v-layout row wrap>
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-sub grey--text text--darken-2">
										{{experience.price | currency('₱')}} x {{people}}
									</div>
								</v-flex>
								<v-flex xs6 sm6 md6 lg6 xl6>
										<div class="experience-title grey--text text--darken-3 text-xs-right">{{experience.price * people | currency('₱')}}</div>
								</v-flex>
							</v-layout>
							<v-layout row wrap>
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-sub grey--text text--darken-2">Total (PHP)</div>
								</v-flex>
								<v-flex xs6 sm6 md6 lg6 xl6>
									<div class="experience-title grey--text text--darken-3 text-xs-right">{{experience.price | currency('₱')}}</div>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card-text>
			</v-card>
		</div>
	</v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	created () {
		this.payment.user.firstName = this.user.firstName || null
		this.payment.user.lastName = this.user.lastName || null
		this.payment.billingInfo.contact = this.user.contact || null
		this.experienceDate = Object.assign({}, this.$route.params.date)
		this.experienceTime = Object.assign({}, this.$route.params.time)
		this.total = this.experience.price
	},
	data: () => ({
		experienceDate: {
			from: null,
			end: null
		},
		experienceTime: {
			from: null,
			to: null
		},
		payment: {
			method: 'Credit Card',
			user: {
				firstName: null,
				lastName: null
			},
			billingInfo: {
				address: '55 Provl. Rd., Pallua Norte',
				address2: null,
				country: 'Philippines',
				city: 'Tuguegarao',
				zipCode: 3500,
				contact: null
			}
		},
		loading: false,
		people: 1
	}),
	methods: {
		confirm () {
			const c = confirm("Are you sure?")
			if (c) {
				const totalAmount = this.people * this.experience.price
				const payload = {
					date: this.experienceDate,
					time: this.experienceTime,
					payment: this.payment,
					email: this.user.email,
					experience: this.experience,
					userId: this.user.uid,
					people: this.people,
					totalAmount
				}
				// console.log(payload)
				this.loading = true
				this.$store.dispatch('bookings/CONFIRM_AND_PAY', payload)
				.then((res) => {
					window.location.href = res.data.payment.redirectUrl
				})
				.catch((e) => {
					console.error(e)
				})
			}
		}
	},
	computed: {
		...mapGetters({
			user: 'accounts/GET_USER',
			experience: 'experiences/GET_VIEWED_EXPERIENCE'
		})
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
</style>