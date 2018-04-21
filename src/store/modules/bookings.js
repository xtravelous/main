import { AUTH, DB } from '@/services/fireinit.js'
import axios from 'axios'
const bookingsRef = DB.collection('_bookings')
const experiencesRef = DB.collection('_experiences')
const accountsRef = DB.collection('_accounts')

const state = {
	bookings: []
}

const getters = {
	GET_BOOKINGS: state => state.bookings
}

const mutations = {
	SET_BOOKINGS (state, bookings) {
		state.bookings = bookings
	},
	ADD_BOOKING (state, booking) {
		state.bookings.push(booking)
	},
	RESET_BOOKINGS (state) {
		state.bookings.length = 0
	}
}

const actions = {
	async CONFIRM_AND_PAY ({commit}, payload) {
		try {
			const response = await axios.post('http://139.59.105.62:4000/payment', payload)
			return response
		} catch (e) {
			throw e
		}
	},
	async UPDATE_BOOKING_STATUS ({commit, dispatch}, referenceId) {
		try {
			const querySnapshot = await bookingsRef.where('referenceId', '==', referenceId).get()
			const bookings = querySnapshot.docs.map(b => b)
			const bookingId = bookings[0].id
			const response = await bookingsRef.doc(bookingId).update({
				status: 'COMPLETED'
			})
			return
		} catch (e) {
			throw e
		}
	},
	GET_BOOKINGS ({commit}, payload) {
		return new Promise((resolve, reject) => {
			const user = AUTH.currentUser
			const bookingsPromise = bookingsRef.where('userId', '==', user.uid).where('status', '==', 'COMPLETED').get()
			return bookingsPromise.then((querySnapshot) => {
				const bookings = []
				querySnapshot.forEach((doc) => {
					const data = doc.data()
					data.id = doc.id
					bookings.push(
						experiencesRef.doc(data.experienceId).get()
						.then((experienceDoc) => {
							data.experienceData = Object.assign({}, experienceDoc.data())
							return accountsRef.doc(data.experienceData.uid).get()
						})
						.then((accountDoc) => {
							data.experienceData.user = Object.assign({}, accountDoc.data())
							return data
						})
						)
				})
				const allPromises = Promise.all(bookings)
				allPromises.then((response) => {
					commit('SET_BOOKINGS', response)
					resolve(response)
				})
				allPromises.catch((error) => reject(error))
			})
		})
	},
	GET_HOST_BOOKINGS ({commit}, experienceId) {
		const queryPromise = bookingsRef.where('experienceId', '==', experienceId).get()
		return queryPromise.then((querySnapshot) => {
			const bookings = []
			querySnapshot.forEach((doc) => {
				const data = doc.data()
				data.id = doc.id
				bookings.push(
					accountsRef.doc(data.userId).get()
					.then((accountDoc) => {
						data.userData = accountDoc.data()
						return data
					})
					)
			})
			return Promise.all(bookings)
		})
	},
	async GET_BOOKING ({}, experienceId) {
		try {
			const response = await bookingsRef
			.where('userId', '==', AUTH.currentUser.uid)
			.where('experienceId', '==', experienceId)
			.get()
			if (response.docs.length > 0) {
				const data = response.docs[0].data()
				data.id = response.docs[0].id
				return {found: true, data}
			} else {
				return {found: false}
			}
		} catch (e) {
			throw e
		}
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}