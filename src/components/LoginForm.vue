<template>
    <div>
        <v-card>
            <v-card-text class="px-5">
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <v-flex xs12 sm12 md5 lg5 xl5>
                            <v-form v-model="travelerValid" ref="travelerForm" lazy-validation>
                                <img src="@/assets/traveler.png" alt="traveler_logo" class="img-responsive">
                                <v-text-field @keyup.enter="login('traveler')" :rules="emailRules" v-model="travelerLogin.email" label="Email address" prepend-icon="mail"></v-text-field>
                                <v-text-field @keyup.enter="login('traveler')" :rules="basicRules" v-model="travelerLogin.password" type="password" label="Password" prepend-icon="vpn_key"></v-text-field>
                                <div class="text-xs-center">
                                    <v-btn depressed large class="grey darken-3 white--text" @click="login('traveler')" :disabled="loginButton">Login</v-btn>
                                </div>
                            </v-form>
                        </v-flex>
                        <v-flex xs2 sm2 md2 lg2 xl2>
                            <div class="outer hidden-sm-and-down">
                                <div class="inner"></div>
                            </div>
                        </v-flex>
                        <v-flex xs12 sm12 md5 lg5 xl5 class="clickable-pointer">
                            <v-form v-model="expertValid" ref="expertForm" lazy-validation>
                                <img src="@/assets/expert.png" alt="expert_logo" class="img-responsive">
                                <v-text-field @keyup.enter="login('expert')" :rules="emailRules" v-model="expertLogin.email" label="Email address" prepend-icon="mail"></v-text-field>
                                <v-text-field @keyup.enter="login('expert')" :rules="basicRules" v-model="expertLogin.password" type="password" label="Password" prepend-icon="vpn_key"></v-text-field>
                                <div class="text-xs-center">
                                    <v-btn depressed large class="grey darken-3 white--text" @click="login('expert')" :disabled="loginButton">Login</v-btn>
                                </div>
                            </v-form>
                        </v-flex>
                    </v-layout>
                    <div class="text-xs-center">
                        <v-btn flat @click="$events.fire('closeLoginDialog')">Cancel</v-btn>
                    </div>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      travelerLogin: {
        email: null,
        password: null
      },
      expertLogin: {
        email: null,
        password: null
      },
      loginButton: false,
      basicRules: [
        (v) => !!v || 'This field is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      travelerValid: null,
      expertValid: null
    }
  },
  mounted () {
    this.$events.listen('closeLoginDialog', () => {
      this.clearFields()
    })
  },
  methods: {
    login (accountType) {
      // needs the loginAction method
      const a = accountType === 'traveler' ? this.travelerLogin : this.expertLogin
      a.type = accountType
      if (accountType === 'traveler' && this.$refs.travelerForm.validate()) {
        this.loginAction(a)
      } else if (accountType === 'expert' && this.$refs.expertForm.validate()) {
        this.loginAction(a)
      }
    },
    clearFields () {
      this.travelerLogin = {
        email: null,
        password: null
      }
      this.expertLogin = {
        email: null,
        password: null
      }
    },
    loginAction (a) {
      this.loginButton = true
      this.$Progress.start()
      this.$store.dispatch('accounts/AUTHENTICATE', a)
        .then(res => {
          if (res.success) {
            this.$Progress.finish()
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'You are now logged in.' })
          } else {
            this.$Progress.fail()
            console.error('ERROR!', res)
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: res.message })
          }
          this.clearFields()
          this.loginButton = false
          this.$events.fire('closeLoginDialog')
        })
        .catch(error => {
          this.$Progress.fail()
          console.error('ERROR2!', error)
          this.loginButton = false
          this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: error.message })
        })
    }
  }
}
</script>

<style scoped>
        .img-responsive {
            height: auto;
            width: 100%;
        }
    
        .clickable-pointer {
            cursor: pointer;
        }
    
        .outer {
            width: 1px;
            height: 100%;
            margin: auto;
            position: relative;
            overflow: hidden;
        }
        .inner {
            position: absolute;
            width:100%;
            height: 40%;
            background: grey;
            top: 30%;
            box-shadow: 0px 0px 30px 20px grey;
        }
    </style>