import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
// import 'firebase/database'

const config = {
  apiKey: 'AIzaSyD4JvJbZm-Z79LTfq1RxExrbzlYC5VLM9g',
  authDomain: 'robertapp-bff3b.firebaseapp.com',
  databaseURL: 'https://robertapp-bff3b.firebaseio.com',
  projectId: 'robertapp-bff3b',
  storageBucket: 'robertapp-bff3b.appspot.com',
  messagingSenderId: '371634738876'
}

!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
// export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const AUTH = firebase.auth()
export const DB = firebase.firestore()
export const STORAGE = firebase.storage()
export default firebase
