<template>
	<v-container>
		<div class="pt-1">
			<v-card tile flat>
				<v-card-title class="grey darken-1" dark tabs flat>
					<div class="headline white--text">Booking details</div>
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
						</v-flex>
						<v-flex xs12 sm12 md1 lg1 xl1></v-flex>
						<v-flex xs12 sm12 md5 lg5 xl5>
							<v-layout row wrap>
								<v-flex xs9 sm9 md9 lg9 xl9>
									<div class="experience-title grey--text text--darken-2">{{experience.name}}</div>
									<div class="experience-sub grey--text text--darken-2">{{experience.noOfDays}} day experience</div>
									<div v-if="$route.query.user" class="experience-sub grey--text text--darken-2">Hosted by {{user.firstName || ''}} {{user.lastName || ''}}</div>
									<div v-else class="experience-sub grey--text text--darken-2">Hosted by {{experience.user.firstName || ''}} {{experience.user.lastName || ''}}</div>
								</v-flex>
								<v-flex xs3 sm3 md3 lg3 xl3>
									<img :src="experience.thumbURL" alt="thumbnail" class="thumbnail">
								</v-flex>
							</v-layout>
							<v-divider class="mt-3 mb-3"></v-divider>
							<div class="experience-sub grey--text text--darken-2">{{booking.date.from}} - {{booking.date.end}}</div>
							<div class="experience-sub grey--text text--darken-2">{{booking.time.from}} - {{booking.time.to}}</div>
							<v-divider class="mt-3 mb-3"></v-divider>
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
	</v-container>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
export default {
	created () {
		console.log(this.$route.params)
		this.experience = Object.assign({}, this.$route.params.booking.experienceData)
		this.booking =  Object.assign({}, this.$route.params.booking)
	},
	data: () => ({
		experience: {},
		booking: {}
	}),
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