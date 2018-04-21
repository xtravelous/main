<template>
	<v-container grid-list-md>
		<div class="pt-2">
			<v-card tile flat>
				<v-card-title class="grey darken-1" dark tabs flat>
					<div class="headline white--text">{{host.firstName}} {{host.lastName || ''}}</div>
				</v-card-title>
				<v-card-text>
					<span class="display-1 bold grey--text text--darken-3">About host</span>
					<div v-html="host.about" class="mt-2"></div>
					<Experiences title="Experiences by host" :hideExperienceTextInTitle="false" :hasButton="false" :experiences="experiences" />
					<div class="text-xs-center" v-show="showLoader">
						<v-progress-circular indeterminate :size="50" color="orange darken-1"></v-progress-circular>
					</div>
				</v-card-text>
			</v-card>
		</div>
	</v-container>
</template>

<script>
import moment from 'moment'
import Experiences from '@/components/Experiences'
import {mapGetters} from 'vuex'
export default {
	created () {
		if (this.$route.params.host) {
			this.host = Object.assign({}, this.$route.params.host)
		}
		if (this.$route.params.id) {
			this.showLoader = true
			this.$store.dispatch('experiences/GET_EXPERIENCES_BY_USER_ID', this.$route.params.id)
			.then((response) => {
				this.showLoader = false
				this.experiences = response
			})
		}
	},
	data: () => ({
		host: {},
		experiences: [],
		showLoader: false
	}),
	methods: {
	},
	computed: {
		...mapGetters({
			user: 'accounts/GET_USER'
		})
	},
	components: {
		Experiences
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