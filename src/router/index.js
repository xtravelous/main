import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

// Pages
import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import Experience from '@/pages/Experience'
import About from '@/pages/About'
import CreateExperience from '@/pages/CreateExperience'
import Account from '@/pages/Account'
import MyExperiences from '@/pages/MyExperiences'
import MyBookings from '@/pages/MyBookings'
import ReviewAndPay from '@/pages/ReviewAndPay'
import ProcessBooking from '@/pages/ProcessBooking'
import Booking from '@/pages/Booking'
import ExperienceBookings from '@/pages/ExperienceBookings'
import Message from '@/pages/Message'
import HostProfile from '@/pages/HostProfile'

import store from '@/store'

Vue.use(Router)

const router = new Router({
	routes: [{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/about',
		name: 'About',
		component: About,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/explore',
		name: 'Explore',
		component: Explore,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/explore/:id',
		name: 'Experience',
		component: Experience,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/create-experience',
		name: 'CreateExperience',
		component: CreateExperience,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/my-account',
		name: 'Account',
		component: Account,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/my-experiences',
		name: 'MyExperiences',
		component: MyExperiences,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/my-bookings',
		name: 'MyBookings',
		component: MyBookings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/explore/:id/review-and-pay',
		name: 'ReviewAndPay',
		component: ReviewAndPay,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/process-booking',
		name: 'ProcessBooking',
		component: ProcessBooking,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/booking/:id',
		name: 'Booking',
		component: Booking,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/my-experiences/:id',
		name: 'ExperienceBookings',
		component: ExperienceBookings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/q/:booking_id',
		name: 'Message',
		component: Message,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/host/:id',
		name: 'HostProfile',
		component: HostProfile,
		meta: {
			requiresAuth: false
		}
	}]
})

router.beforeEach((to, from, next) => {
	if (store.state.menuDialog) store.state.menuDialog = false
		if(to.matched.some(record => record.meta.requiresAuth)) {
			if(!firebase.auth().currentUser) {
				next({
					path: '/',
					query: {
						redirecT: to.fullPath
					}
				})
			} else {
				if (to.name === 'MyExperiences' && store.state.accounts.isHost) {
					next()
				} else if (to.name === 'MyExperiences' && !store.state.accounts.isHost) {
					next({
						path: '/',
						query: {
							redirecT: to.fullPath
						}
					})
				} else if (to.name === 'CreateExperience' && store.state.accounts.isHost) {
					next()
				} else if (to.name === 'CreateExperience' && !store.state.accounts.isHost) {
					next({
						path: '/',
						query: {
							redirecT: to.fullPath
						}
					})
				} else {
					next()
				}
			}
		} else {
			next()
		}
	})

export default router