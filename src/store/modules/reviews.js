import { AUTH, DB, STORAGE } from '@/services/fireinit.js'
const reviewsRef = DB.collection('_reviews')
const accountsRef = DB.collection('_accounts')
const defaultProfilePicture = require('@/assets/default.png')

const state = {
	reviews: []
}

const getters = {
	GET_REVIEWS: state => {
		return state.reviews.sort((a,b) => {
			return new Date(b.createdAt) - new Date(a.createdAt)
		});
	},
	GET_HIGHEST_RATING: state => {
		if (state.reviews.length > 0) {
			return state.reviews.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
		} else {
			return {rating: 0}
		}
	}
}

const mutations = {
	SET_REVIEWS (state, reviews) {
		state.reviews = reviews
	},
	ADD_REVIEW (state, review) {
		state.reviews.push(review)
	},
	EMPTY_REVIEWS (state) {
		state.reviews.length = 0
	}
}

const actions = {
	async ADD_REVIEW ({commit}, payload) {
		try {
			const data = {
				createdAt: new Date(),
				message: payload.message,
				rating: payload.rating,
				userId: AUTH.currentUser.uid,
				experienceId: payload.experienceId
			}
			const response = await reviewsRef.add(data)
			const user = await accountsRef.doc(AUTH.currentUser.uid).get()
			data.user = user.data()
			if(!data.user.picture) {
				data.user.noPicture = true
				data.user.picture = defaultProfilePicture
			}
			commit('ADD_REVIEW', data)
			return data
		} catch (e) {
			throw e
		}
	},
	GET_REVIEWS ({}, experienceId) {
		const reviewsSnapshot = reviewsRef.where('experienceId', '==', experienceId).get()
		return reviewsSnapshot.then((querySnapshot) => {
			const reviews = []
			querySnapshot.forEach((doc) => {
				const reviewData = doc.data()
				reviewData.id = doc.id
				reviews.push(
					accountsRef.doc(reviewData.userId).get()
					.then((userDoc) => {
						reviewData.user = Object.assign({}, userDoc.data())
						if(!reviewData.user.picture ) {
							reviewData.user.noPicture = true
							reviewData.user.picture = defaultProfilePicture
						}
						return reviewData
					})
					)
			})
			return Promise.all(reviews)
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}