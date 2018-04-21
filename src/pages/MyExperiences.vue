<template>
	<div>
		<v-container>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card tile flat>
						<v-toolbar color="orange darken-2" dark flat>
							<v-toolbar-title class="headline">My Experiences</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" single-line placeholder="Search an experience..." color="white" hide-details append-icon="search"></v-text-field>
						</v-toolbar>
						<v-card-text class="pa-0">
							<div class="text-xs-center">
								<h1 class="grey--text text--darken-2" v-show="!ALL.length">You have no experiences yet.</h1>
							</div>
							<v-list two-line class="pt-0 pb-0">
								<v-subheader v-if="ALL.length > 0">Click an item to view bookings</v-subheader>
								<template v-for="(e, index) in filterBy(ALL, search)">
									<v-list-tile avatar ripple @click="viewBookings(e)" :key="e.id">
										<v-list-tile-avatar>
											<v-list-tile-avatar tile>
												<img :src="e.thumbURL">
											</v-list-tile-avatar>
										</v-list-tile-avatar>
										<v-list-tile-content>
											<v-list-tile-title v-html="e.name"></v-list-tile-title>
											<v-list-tile-sub-title>Duration: {{e.noOfDays}} days</v-list-tile-sub-title>
										</v-list-tile-content>
									</v-list-tile>
									<v-divider :key="index"></v-divider>
								</template>
							</v-list>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-dialog v-model="bookingsDialog" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Bookings</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="bookingsDialog = false">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="pa-0">
					<div class="text-xs-center pa-3" v-show="bookingsSpinner">
						<v-progress-circular indeterminate :size="50" color="orange darken-1"></v-progress-circular>
					</div>
					<div class="text-xs-center pa-3" v-show="noBookings">
						<h1 class="grey--text text--darken-2">No bookings yet.</h1>
					</div>
					<v-list three-line class="pt-0 pb-0">
						<template v-for="(b, index) in bookings">
							<v-list-tile ripple @click="viewBooking(b)" :key="b.id">
								<v-list-tile-content>
									<v-list-tile-title>{{b.userData.firstName}} {{b.userData.lastName}}</v-list-tile-title>
									<v-list-tile-sub-title>Date booked: {{b.createdAt | fullDate}}</v-list-tile-sub-title>
									<v-list-tile-sub-title>From {{b.date.from}} - {{b.date.end}} @ {{b.time.from}} {{b.time.to}}</v-list-tile-sub-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-btn icon>
										<v-icon color="green">check</v-icon>
									</v-btn>
								</v-list-tile-action>
							</v-list-tile>
							<v-divider :key="index"></v-divider>
						</template>
					</v-list>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import moment from 'moment'
export default {
	created () {
		this.$Progress.start()
		this.$store.dispatch('experiences/GET_MY_EXPERIENCES')
		.then(() => {
			this.$Progress.finish()
		})
		.catch((e) => {
			this.$Progress.fail()
			console.error(e)
		})
	},
	data: () => ({
		search: null,
		bookingsDialog: false,
		bookings: [],
		bookingsSpinner: false,
		noBookings: false,
		experienceViewed: {}
	}),
	methods: {
		viewBookings (e) {
			this.experienceViewed = Object.assign({}, e)
			this.bookings.length = 0
			this.bookingsSpinner = true
			this.bookingsDialog = true
			this.noBookings = false
			this.$store.dispatch('bookings/GET_HOST_BOOKINGS', e.eid)
			.then((response) => {
				console.log(response)
				this.bookingsSpinner = false
				this.bookings = response
				if (!response.length) this.noBookings = true
			})
		},
		viewBooking (booking) {
			booking.experienceData = this.experienceViewed
			this.$router.push({name: 'Booking', params: {id: booking.id, booking}, query: {user: booking.userId}})
		}
	},
	computed: {
		...mapGetters({
			ALL: 'experiences/GET_ALL_MY_EXPERIENCES'
		})
	},
	filters: {
		fullDate (val) {
			return moment(val).format('MMMM D, YYYY hh:mm A')
		}
	}
}
</script>