import { AUTH, DB } from '@/services/fireinit.js'
const messagesRef = DB.collection('_messages')
const accountsRef = DB.collection('_accounts')

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
	GET_MESSAGES ({commit}, bookingId) {
		const messagesPromise = messagesRef.where('bookingId', '==', bookingId).get()
		return messagesPromise.then((querySnapshot) => {
			const messages = []
			querySnapshot.forEach((doc) => {
				const data = doc.data()
				data.id = doc.id
				messages.push(
					accountsRef.doc(data.userId).get()
					.then((user) => {
						data.userData = user.data()
						return data
					})
				)
			})
			return Promise.all(messages)
		})
	},
	async SEND_MESSAGE ({rootState}, payload) {
		try {
			const user = AUTH.currentUser
			const data = {
				message: payload.message,
				createdAt: new Date(),
				bookingId: payload.bookingId,
				userId: user.uid
			}
			const response = await messagesRef.add(data)
			data.id = response.id
			const userData = await accountsRef.doc(data.userId).get()
			data.userData = userData.data()
			return data
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