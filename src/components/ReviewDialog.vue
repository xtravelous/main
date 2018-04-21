<template>
	<div>
		<v-card>
			<v-card-title class="grey darken-2 white--text">
				<div class="title">Leave a review</div>
			</v-card-title>
			<v-card-text>
				<v-text-field
				label="Type your message here..."
				multi-line
				v-model="reviewData.message"
				></v-text-field>
				<div class="text-xs-center">
					<VueStars
					name="reviewDialogStar"
					active-color="#FB8C00"
					inactive-color="#999999"
					shadow-color="#FFB74D"
					hover-color="#FB8C00"
					:max="5"
					:readonly="false"
					char="★"
					v-model="reviewData.rating"
					style="font-size: 30px;"
					/>
				</div>
				<p class="display-1 mt-2 grey--text text--darken-2 text-xs-center" v-show="reviewData.rating > 0">
					{{reviewData.rating}}/5
				</p>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn depressed class="grey darken-1 white--text" @click="submitReview" :disabled="reviewSubmitDisabled" :loading="reviewSubmitDisabled">Submit</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import VueStars from 'vue-stars'
export default {
	data () {
		return {
			reviewData: {
				message: null,
				rating: 0
			},
			reviewSubmitDisabled: false,
		}
	},
	methods: {
		submitReview () {
			if (!this.reviewData.message || this.reviewData.rating < 1) {
				return
			}
			this.reviewSubmitDisabled = true
			const data = {
				message: this.reviewData.message,
				rating: this.reviewData.rating,
				experienceId: this.$route.params.id
			}
			this.$store.dispatch('reviews/ADD_REVIEW', data)
			.then((response) => {
				//this.reviewDialog = false
				this.$emit('CLOSE')
				this.reviewSubmitDisabled = false
				this.reviewData = Object.assign({}, {
					message: null,
					rating: 0
				})
			})
		}
	},
	components: {
		VueStars
	}
}
</script>