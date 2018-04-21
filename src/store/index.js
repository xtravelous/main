import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './modules/accounts'
import experiences from './modules/experiences'
import bookings from './modules/bookings'
import payments from './modules/payments'
import messages from './modules/messages'
import reviews from './modules/reviews'

Vue.use(Vuex)

const state = {
  menuDialog: false
}

const mutations = {
  toggleMenuDialog (state) {
    state.menuDialog = !state.menuDialog
  },
  closeMenuDialog (state) {
    if (state.menuDialog) state.menuDialog = false
  }
}

export default new Vuex.Store({
	state,
	mutations,
	modules: {
		accounts,
		experiences,
    bookings,
    payments,
    messages,
    reviews
	}
})
