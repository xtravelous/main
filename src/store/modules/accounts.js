import { AUTH, DB } from '@/services/fireinit.js'
const accountsRef = DB.collection('_accounts')

const state = {
  menuDialog: false,
  isLoggedIn: false,
  isHost: false,
  user: {
    contact: null,
    email: null,
    firstName: null,
    lastName: null,
    type: null
  }
}

const getters = {
  IS_AUTHENTICATED: state => state.isLoggedIn,
  IS_HOST: state => state.isHost,
  GET_USER: state => state.user,
  GET_FULL_NAME: state => state.user.fullName
}

const mutations = {
  toggleMenuDialog (state) {
    state.menuDialog = !state.menuDialog
  },
  closeMenuDialog (state) {
    if (state.menuDialog) state.menuDialog = false
  },
SET_AUTH_STATE (state, payload) {
  state.isLoggedIn = payload
},
SET_USER (state, payload) {
  state.user = Object.assign({}, payload)
},
RESET_USER (state, payload) {
  state.user = Object.assign({}, {
    contact: null,
    email: null,
    firstName: null,
    lastName: null,
    type: null
  })
},
SET_USER_TYPE (state, payload) {
  state.isHost = payload
}
}

const actions = {
  async REGISTER ({commit}, payload) {
    try {
      let { fullName, email, contact, type, password } = payload
      const response = await AUTH.createUserWithEmailAndPassword(email, password)
      const data = {
        fullName,
        email,
        contact,
        type
      }
      await accountsRef.doc(response.uid).set(data)
      commit('SET_USER', data)
      commit('SET_AUTH_STATE', true)
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async AUTHENTICATE ({commit}, payload) {
    try {
      const response = await AUTH.signInWithEmailAndPassword(payload.email, payload.password)
      const doc = await accountsRef.doc(response.uid).get()
      const data = doc.data()
      data.uid = doc.id
      if (data.type === payload.type) {
        commit('SET_USER', data)
        commit('SET_AUTH_STATE', true)
        const isHost = data.type === 'expert' ? true : false
        commit('SET_USER_TYPE', isHost)
        return {success: true}
      } else {
        AUTH.signOut()
        commit('RESET_USER')
        return {success: false, message: 'Invalid account type.'}
      }
    } catch (error) {
      throw error
    }
  },
  async GET_USER (context, payload) {
    try {
      const doc = await accountsRef.doc(payload.uid).get()
      if (doc.exists) {
        const data = doc.data()
        data.uid = payload.uid
        context.commit('SET_USER', data)
        const isHost = data.type === 'expert' ? true : false
        context.commit('SET_USER_TYPE', isHost)
        // console.log(data)
      }
    } catch (error) {
      throw error
    }
  },
  GET_USER_DETAILS (context, uid) {
    return accountsRef.doc(payload.uid).get()
  },
  async UPDATE_USER (context, payload) {
    try {
      const user = AUTH.currentUser
      const userPayload = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        contact: payload.contact,
        type: payload.type
      }
      // UPDATE FIREBASE AUTH EMAIL IF EMAIL IS NOT EQUAL TO AUTHENTICATED USER
      if (user.email !== payload.email) {
        await user.updateEmail(payload.email)
      }
      const response = await accountsRef.doc(payload.uid).set(userPayload)
      context.commit('SET_USER', payload)
      const userType = payload.type === 'expert'
      context.commit('SET_USER_TYPE', userType)
      return response
    } catch (error) {
      throw error
    }
  },
  async UPDATE_ACCOUNT_TYPE (context, payload) {
    try {
      const user = context.state.user
      const userData = {
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        type: payload
      }
      const response = await accountsRef.doc(user.uid).set(userData)
      userData.uid = user.uid
      context.commit('SET_USER', userData)
      const userType = payload === 'expert'
      context.commit('SET_USER_TYPE', userType)
      return response
    } catch (error) {
      throw error
    }
  },
  OBSERVE_AUTH_STATE (context, payload) {
    AUTH.onAuthStateChanged(user => {
      if (user) {
        context.commit('SET_AUTH_STATE', true)
        context.dispatch('GET_USER', user)
      } else {
        context.commit('SET_AUTH_STATE', false)
        context.commit('SET_USER', {
          contact: null,
          email: null,
          fullName: null,
          type: null
        })
      }
    })
  },
  async SIGN_OUT ({commit}, payload) {
    try {
      await AUTH.signOut()
      commit('RESET_USER')
      commit('SET_AUTH_STATE', false)
      commit('SET_USER_TYPE', false)
    } catch (error) {
      throw error
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