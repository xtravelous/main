<template>
	<div>
		<v-container>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card tile flat>
						<v-toolbar color="grey darken-1" dark tabs flat>
							<v-toolbar-title class="headline">My Bookings</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" single-line placeholder="Search a booking..." color="white" hide-details append-icon="search"></v-text-field>
						</v-toolbar>
						<v-card-text>
							<div class="text-xs-center">
								<h1 class="grey--text text--darken-2" v-show="showNoBookings">You have no bookings yet.</h1>
							</div>
							<v-list three-line class="pt-0 pb-0">
								<v-list-tile avatar ripple v-for="b in filterBy(orderBy(bookings, 'createdAt', -1), search)" @click="viewBooking(b)" :key="b.id">
									<v-list-tile-avatar>
										<v-list-tile-avatar>
											<img :src="b.experienceData.thumbURL">
										</v-list-tile-avatar>
									</v-list-tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title v-html="b.experienceData.name"></v-list-tile-title>
										<v-list-tile-sub-title>{{b.date.from}} - {{b.date.end}}</v-list-tile-sub-title>
										<v-list-tile-sub-title>{{b.time.from}} - {{b.time.to}}</v-list-tile-sub-title>
									</v-list-tile-content>
								</v-list-tile>
							</v-list>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	data: () => ({
		search: null,
		showNoBookings: false
	}),
	created () {
		this.showNoBookings = false
		this.$Progress.start()
		this.$store.dispatch('bookings/GET_BOOKINGS')
		.then((response) => {
			if (!response.length) this.showNoBookings = true
			this.$store.commit('bookings/SET_BOOKINGS', response)
			this.$Progress.finish()
		})
		.catch((e) => {
			this.$Progress.fail()
			console.error(e)
		})
	},
	methods: {
		viewBooking (booking) {
			this.$router.push({name: 'Booking', params: {id: booking.id, booking}})
		}
	},
	beforeDestroy () {
		this.$store.commit('bookings/RESET_BOOKINGS')
	},
	computed: {
		...mapGetters({
			'bookings': 'bookings/GET_BOOKINGS'
		})
	}
}
</script>

<style scoped>
.img-responsive {
	height: auto;
	width: 100%;
}
</style>