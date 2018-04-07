import { AUTH, DB } from '@/services/fireinit.js'
const paymentsRef = DB.collection('_payments')

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
	async ADD_PAYMENT_STATUS ({commit}, payload) {
		try {
			const response = await paymentsRef.add(payload)
			return response
		} catch (e) {
			throw e
		}
	},
	async GET_PAYMENT_DETAILS ({commit}, referenceId) {
		try {
			let exists
			const querySnapshot = await paymentsRef.where('referenceId', '==', referenceId).get()
			const payments = querySnapshot.docs.map((doc) => {
				const data = doc.data()
				data.id = doc.id
				return data
			})
			if (payments.length > 0) {
				return {exists: true, paymentData: payments[0]}
			} else {
				return {exists: false}
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