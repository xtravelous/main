import { AUTH, DB, STORAGE } from '@/services/fireinit.js'
/* import moment from 'moment' */
import axios from 'axios'
const experiencesRef = DB.collection('_experiences')
const accountsRef = DB.collection('_accounts')
const expStorageRef = STORAGE.ref('xtravelous/experiences')
const defaultProfilePicture = require('@/assets/default.png')

function uploadCover (id, coverPhoto) {
  const coverStorage = expStorageRef.child(`${id}/cover`)
  return coverStorage.putString(coverPhoto, 'data_url')
}

function uploadThumbnail (id, thumbnail) {
  const thumbnailStorage = expStorageRef.child(`${id}/thumb`)
  return thumbnailStorage.putString(thumbnail, 'data_url')
}

/* function getPicture (id, type) {
  const storage = expStorageRef.child(`${id}/${type}`)
  return storage.getDownloadURL()
} */

const state = {
  experiences: [],
  experience: {
    name: null,
    coverPhoto: null,
    thumbnail: null,
    description: null,
    location: {
      name: null,
      streetAddress: null,
      optional: null,
      city: null,
      zipCode: null
    },
    price: null,
    noOfDays: null,
    times: [],
    notes: null,
    user: {
      firstName: null,
      lastName: null
    },
    coordinates: {
      lat: 0,
      lng: 0
    }
  },
  myExperiences: []
}

const getters = {
  GET_EXPERIENCES: state => state.experiences,
  GET_VIEWED_EXPERIENCE: state => state.experience,
  GET_COMPLETE_ADDRESS: state => {
    const e = state.experience.location
    return `${e.name}\n${e.streetAddress},\n${e.city} ${e.zipCode}`
  },
  GET_ALL_MY_EXPERIENCES: state => state.myExperiences
}

const mutations = {
  SET_EXPERIENCES (state, payload) {
    state.experiences = state.experiences.concat(payload)
  },
  SET_EXPERIENCE (state, payload) {
    const i = state.experiences.findIndex(e => e.eid === payload)
    if (i >= 0) {
      state.experience = Object.assign({}, state.experiences[i])
    }
  },
  SET_DIRECT_LOADED_EXPERIENCE (state, experience) {
    state.experience = Object.assign({}, experience)
  },
  ADD_EXPERIENCE (state, payload) {
    state.experiences.push(payload)
  },
  SET_MY_EXPERIENCES (state, experiences) {
    state.myExperiences = experiences
  }
}

const actions = {
  async ADD_EXPERIENCE ({rootState, commit}, payload) {
    try {
      const experienceData = {
        name: payload.name,
        description: payload.description,
        location: payload.location,
        notes: payload.notes,
        price: payload.price,
        noOfDays: payload.noOfDays,
        times: payload.times,
        uid: rootState.accounts.user.uid,
        maxParticipants: payload.maxParticipants,
        exclusive: payload.exclusive,
        coordinates: {
          lat: null,
          lng: null
        },
        createdAt: Date.now()
      }
      const coords = await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${payload.formattedAddress}&key=AIzaSyDv1ZGrQszxWp_yDYBxA9qiZhao-8dVz5M`)
      experienceData.coordinates = Object.assign({}, coords.data.results[0].geometry.location)
      const response = await experiencesRef.add(experienceData)
      const coverResponse = await uploadCover(response.id, payload.coverPhoto)
      const thumbResponse = await uploadThumbnail(response.id, payload.thumbnail)
      await experiencesRef.doc(response.id).update({
        coverURL: coverResponse.downloadURL,
        thumbURL: thumbResponse.downloadURL
      })
      response.coverURL = coverResponse.downloadURL
      response.thumbURL = thumbResponse.downloadURL
      commit('ADD_EXPERIENCE', response)
    } catch (error) {
      throw error
    }
  },
  async FETCH_EXPERIENCE ({commit}, eid) {
    try {
      const doc = await experiencesRef.doc(eid).get()
      const data = doc.data()
      data.eid = eid
      const user = await accountsRef.doc(data.uid).get()
      data.user = user.data()
      if(!data.user.picture) {
        data.user.noPicture = true
        data.user.picture = defaultProfilePicture
      }
      commit('SET_DIRECT_LOADED_EXPERIENCE', data)
      console.log(data)
    } catch (error) {
      throw error
    }
  },
  GET_EXPERIENCES ({commit, dispatch}, payload) {
    const experiencesSnapshot = experiencesRef.orderBy('createdAt', 'desc').limit(payload).get()
    return experiencesSnapshot.then((querySnapshot) => {
      const experiences = []
      querySnapshot.forEach((doc) => {
        const experienceData = doc.data()
        experienceData.eid = doc.id
        experiences.push(
          accountsRef.doc(experienceData.uid).get()
          .then((userDoc) => {
            // GET USER DATA
            experienceData.user = Object.assign({}, userDoc.data())
            if(!experienceData.user.picture) {
              experienceData.user.noPicture = true
              experienceData.user.picture = defaultProfilePicture
            }
            return dispatch('reviews/GET_REVIEWS', experienceData.eid, {root: true})
          })
          .then((reviews) => {
            // GET REVIEWS
            if (reviews.length > 0) {
              experienceData.reviews = reviews
              experienceData.highestRating = reviews.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
            } else {
              experienceData.reviews = []
              experienceData.highestRating = 0
            }
            return experienceData
           // return await STORAGE.ref('xtravelous/profile-pictures/' + userDoc.id).getDownloadURL()
          })
        )
      })
      return Promise.all(experiences)
    })
  },
  GET_EXPERIENCES_BY_USER_ID ({commit, dispatch}, userId) {
    const experiencesSnapshot = experiencesRef.where('uid', '==', userId).get()
    return experiencesSnapshot.then((querySnapshot) => {
      const experiences = []
      querySnapshot.forEach((doc) => {
        const experienceData = doc.data()
        experienceData.eid = doc.id
        experiences.push(
          accountsRef.doc(experienceData.uid).get()
          .then((userDoc) => {
            // GET USER DATA
            experienceData.user = Object.assign({}, userDoc.data())
            if(!experienceData.user.picture) {
              experienceData.user.noPicture = true
              experienceData.user.picture = defaultProfilePicture
            }
            return dispatch('reviews/GET_REVIEWS', experienceData.eid, {root: true})
          })
          .then((reviews) => {
            // GET REVIEWS
            if (reviews.length > 0) {
              experienceData.reviews = reviews
              experienceData.highestRating = reviews.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
            } else {
              experienceData.reviews = []
              experienceData.highestRating = 0
            }
            return experienceData
          })
        )
      })
      return Promise.all(experiences)
    })
  },
  async GET_MY_EXPERIENCES ({commit}, payload) {
    try {
      const user = AUTH.currentUser
      const querySnapshot = await experiencesRef.where('uid', '==', user.uid).get()
      const myExperiences = querySnapshot.docs.map((doc) => {
        const experienceData = doc.data()
        experienceData.eid = doc.id
        return experienceData
      })
      commit('SET_MY_EXPERIENCES', myExperiences)
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