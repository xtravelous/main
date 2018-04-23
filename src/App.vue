<template>
  <v-app light>
    <v-toolbar color="orange" app fixed clipped-left dark :dense="dense">
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="$store.commit('toggleMenuDialog')"></v-toolbar-side-icon>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat :to="m.to" v-for="(m, i) in mainMenu":key="i">{{m.name}}</v-btn>
      </v-toolbar-items>
      <!-- <v-btn icon v-show="searchToolbar">
        <v-icon>search</v-icon>
      </v-btn> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="!isAuthenticated" @click.stop="openLoginDialog">Log in</v-btn>
        <v-btn flat @click.stop="openRegisterSelectionDialog" v-if="!isAuthenticated">Sign up</v-btn>
        <v-btn flat class="hidden-sm-and-down" v-if="isAuthenticated && isHost" @click="$router.push({name: 'CreateExperience'})">Create Experience</v-btn>
        <!-- <v-btn flat class="hidden-sm-and-down" v-if="isAuthenticated" @click="">Messages</v-btn> -->
        <v-menu offset-y v-if="isAuthenticated">
          <v-btn flat slot="activator">My Account <v-icon right>arrow_drop_down</v-icon></v-btn>
          <v-list>
            <v-list-tile :to="{name: 'CreateExperience'}" ripple class="hidden-md-and-up" v-if="isHost">
              <v-list-tile-title>Create Experience</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{name: 'MyExperiences'}" ripple v-if="isHost">
              <v-list-tile-title>My Experiences</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{name: 'MyBookings'}" ripple>
              <v-list-tile-title>My Bookings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="(item, i) in accountItems" :key="i" :to="{ name: item.url }" ripple>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile ripple @click="logout()">
              <v-list-tile-title>Log Out</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content v-scroll="onScroll">
      <router-view></router-view>
      <vue-progress-bar></vue-progress-bar>
      <v-dialog v-model="menuDialog" fullscreen :overlay="false" transition="fade-transition">
        <v-card>
          <div>
            <v-btn icon @click="$store.commit('toggleMenuDialog')">
              <v-icon medium>close</v-icon>
            </v-btn>
          </div>
          <v-list two-line style="padding-top: 10%;">
            <v-list-tile v-for="(m, i) in mainMenu" ripple :key="i" :to="{ name: m.url }">
              <v-list-tile-content class="menu-item">
                <v-list-tile-title v-html="m.name" class="text-xs-center headline"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-dialog>
      <v-dialog v-model="registerDialog" max-width="700" persistent>
        <SignUp />
      </v-dialog>
      <v-dialog v-model="registerSelectionDialog" max-width="900">
        <RegistrationSelection />
      </v-dialog>
      <v-dialog max-width="500" v-model="loginDialog" persistent>
        <LoginForm />
      </v-dialog>
      <SweetAlert />
    </v-content>
    <v-footer absolute app class="grey darken-2 pa-3 white--text">
      <div>© {{ new Date().getFullYear() }} xTravelous</div>
    </v-footer>
  </v-app>
</template>

<script>
import SignUp from '@/components/SignUp'
import SweetAlert from '@/components/SweetAlert'
import RegistrationSelection from '@/components/RegistrationSelection'
import LoginForm from '@/components/LoginForm'
export default {
  data () {
    return {
      searchToolbar: false,
      dense: true,
      mainMenu: [
      {
        name: 'HOME',
        to: '/',
        url: 'Home'
      },
      {
        name: 'EXPLORE',
        to: '/explore',
        url: 'Explore'
      },
      {
        name: 'ABOUT',
        to: '/about',
        url: 'About'
      }
      ],
      accountItems: [
      {
        title: 'Account Settings',
        url: 'Account'
      }
      ],
      registerDialog: false,
      registerSelectionDialog: false,
      loginDialog: false
    }
  },
  computed: {
    menuDialog () {
      return this.$store.state.menuDialog
    },
    isAuthenticated () {
      return this.$store.getters['accounts/IS_AUTHENTICATED']
    },
    isHost () {
      return this.$store.getters['accounts/IS_HOST']
    }
  },
  components: {
    SignUp,
    SweetAlert,
    RegistrationSelection,
    LoginForm
  },
  mounted () {
    this.$events.listen('openRegisterDialog', (accountType) => {
      this.registerSelectionDialog = false
      this.$events.fire('setAccountType', accountType)
      this.openRegisterDialog()
    })
    this.$events.listen('closeRegisterDialog', () => this.closeRegisterDialog())
    this.$events.listen('closeLoginDialog', () => {
      this.loginDialog = false
    })
    this.$events.listen('OPEN_LOGIN_DIALOG', () => {
      this.openLoginDialog()
    })
  },
  methods: {
    onScroll (e) {
      if (window.pageYOffset > 400 || document.documentElement.scrollTop > 400) {
        this.searchToolbar = true
          // this.dense = false
        } else {
          this.searchToolbar = false
          // this.dense = true
        }
      },
      openRegisterDialog (accountType) {
        this.$events.fire('closeRegisterDialog')
        this.registerDialog = true
      },
      closeRegisterDialog () {
        this.registerDialog = false
      },
      openRegisterSelectionDialog () {
        this.registerSelectionDialog = true
      },
      openLoginDialog () {
        this.loginDialog = true
      },
      logout () {
        this.$Progress.start()
        this.$store.dispatch('accounts/SIGN_OUT')
        .then(() => {
          this.$Progress.finish()
          this.$router.push({ name: 'Home' })
          this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'You have been logged out.' })
        })
      }
    }
  }
  </script>