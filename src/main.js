import Vue from 'vue'
import App from './App.vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import router from './router'
import moment from 'moment'
import Viewer from 'v-viewer'
import VueProgressiveImage from 'vue-progressive-image'
import VueImageUploadResize from 'vue-image-upload-resize'
import * as VueGoogleMaps from 'vue2-google-maps/src/main'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import VueFirestore from 'vue-firestore'
import VueEvents from 'vue-events'
import Carousel3d from 'vue-carousel-3d'
import Vue2Filters from 'vue2-filters'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import Autocomplete from 'v-autocomplete'
import SweetModal from 'sweet-modal-vue/src/plugin.js'
import store from './store'
import firebase from 'firebase'
import './services/fireinit'
import VueProgressBar from 'vue-progressbar'
// import vueg from 'vueg'
import 'vueg/css/transition-min.css'
import { ImageUploader } from 'vue-image-upload-resize'
import './assets/simple-content-placeholder.css'
// import VueHead from 'vue-head'

Vue.component('image-uploader', ImageUploader)

// Vue.use(vueg, router, {
//   shadow: false,
//   forwardAnim: 'fadeIn',
//   backAnim: 'fadeIn'
// })
Vue.use(VueProgressBar, {
  color: '#FFFFFF',
  failedColor: 'red',
  height: '2px'
})
Vue.use(SweetModal)
Vue.use(Autocomplete)
Vue.use(VCalendar, {
  componentPrefix: 'vee'
})
Vue.use(Vue2Filters)
Vue.use(Carousel3d)
Vue.use(VueEvents)
Vue.use(VueFirestore)
Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA3-v5EvmQDT9tT4J7kKwaifqSi8dtCqR0',
    libraries: 'places'
  }
})
Vue.use(VueProgressiveImage)
Vue.use(Viewer)
Vue.use(Vuetify)
Vue.component('view-image-upload-resize', VueImageUploadResize)
// Vue.use(VueHead)

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('experiences/GET_EXPERIENCES', 10).then((response) => {
    store.commit('experiences/SET_EXPERIENCES', response)
  })
    // set user details when logged in
  if (user) {
    store.commit('accounts/SET_AUTH_STATE', true)
    store.dispatch('accounts/GET_USER', user)
  } else {
    store.commit('accounts/SET_AUTH_STATE', false)
    store.commit('accounts/SET_USER', {
      contact: null,
      email: null,
      firstName: null,
      lastName: null,
      type: null
    })
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
