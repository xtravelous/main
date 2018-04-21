import { AUTH, DB, STORAGE } from '@/services/fireinit.js'
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
    type: null,
    about: null,
    picture: null
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
    type: null,
    about: null
  })
},
SET_USER_TYPE (state, payload) {
  state.isHost = payload
},
SET_PROFILE_PICTURE (state, url) {
  state.user.picture = url
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
        type,
        about: null
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
  async AUTHENTICATE ({commit, dispatch, state}, payload) {
    try {
      const response = await AUTH.signInWithEmailAndPassword(payload.email, payload.password)
      const doc = await accountsRef.doc(response.uid).get()
      const data = doc.data()
      data.uid = doc.id
      if (!data.picture) {
        data.picture = `https://robohash.org/${state.user.firstName}.png`
      }
      commit('SET_USER', data)
      commit('SET_AUTH_STATE', true)
      const isHost = data.type === 'expert' ? true : false
      commit('SET_USER_TYPE', isHost)
      return {success: true}
    } catch (error) {
      dispatch('SIGN_OUT')
      throw error
    }
  },
  async GET_USER (context, payload) {
    try {
      const doc = await accountsRef.doc(payload.uid).get()
      if (doc.exists) {
        const data = doc.data()
        data.uid = payload.uid
        if (!data.picture) {
          data.picture = `https://robohash.org/${state.user.firstName}.png`
        }
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
        type: payload.type,
        about: payload.about
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        type: payload,
        about: null
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
  async UPLOAD_PROFILE_PICTURE ({commit}, data) {
    try {
      const user = AUTH.currentUser
      const storageRef = STORAGE.ref('xtravelous/profile-pictures/' + user.uid)
      const response = await storageRef.putString(data.img, 'data_url')
      commit('SET_PROFILE_PICTURE', response.downloadURL)
      return await accountsRef.doc(user.uid).update({picture: response.downloadURL})
    } catch (e) {
      throw e
    }
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