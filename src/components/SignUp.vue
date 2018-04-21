<template>
    <v-card>
        <v-card-title>
            <div class="logo-container">
                <img src="@/assets/traveler.png" alt="traveler_logo" class="logo" v-if="registerData.type === 'traveler'">
                <img src="@/assets/expert.png" alt="expert_logo" class="logo" v-else-if="registerData.type === 'expert'">
            </div>
        </v-card-title>
        <v-card-text>
            <div class="text-xs-center" v-show="loader">
                <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
            </div>
            <v-form v-model="valid" ref="registrationForm" lazy-validation v-show="formContainer">
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field :rules="basicRules" prepend-icon="account_circle" label="First name" v-model="registerData.firstName" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field :rules="basicRules" prepend-icon="account_circle" label="Last name" v-model="registerData.lastName" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field :rules="emailRules" prepend-icon="email" label="Email address" v-model="registerData.email" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field prepend-icon="perm_contact_calendar" label="Contact number(optional)" v-model="registerData.contact"></v-text-field>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field :rules="basicRules" prepend-icon="security" label="Password" type="password" v-model="registerData.password"
                                required></v-text-field>
                        </v-flex>
                        <v-flex xs12 lg6 xl6>
                            <v-text-field :rules="basicRules" prepend-icon="security" label="Confirm password" type="password" required id="confirmPassword"></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <div class="text-xs-center">
                    <v-btn dark class="hidden-xs-only" color="orange darken-2" depressed large @click="register">REGISTER</v-btn>
                    <v-btn block class="hidden-sm-and-up" dark color="orange darken-2" depressed large @click="register">REGISTER</v-btn>
                    <br>
                    <v-btn flat @click="close">Cancel</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      registerData: {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        password: '',
        type: ''
      },
      loader: false,
      formContainer: true,
      basicRules: [
        (v) => !!v || 'This field is required'
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  mounted () {
    this.$events.listen('setAccountType', (accountType) => {
      this.registerData.type = accountType
    })
  },
  methods: {
    register () {
      if (this.$refs.registrationForm.validate()) {
        if (this.registerData.password !== document.querySelector('#confirmPassword').value) {
          this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: `Check if password and confirm password are equal.` })
          return false
        }
        this.loader = true
        this.formContainer = false
        this.$store.dispatch('accounts/REGISTER', this.registerData)
          .then(() => {
            this.loader = false
            this.formContainer = true
            this.$events.fire('closeRegisterDialog')
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'Registration successful!' })
          })
          .catch(error => {
            this.loader = false
            this.formContainer = true
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: error.message })
          })
      } else {
        console.log('hmm something missing')
      }
    },
    close () {
      // this.clearRegisterData()
      this.$events.fire('closeRegisterDialog')
    },
    clearRegisterData () {
      this.registerData = {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        password: '',
        type: ''
      }
    }
  }
}
</script>

<style>
  .registerButton {
      height: 80px;
      width: 200px;
  }

  .logo {
        height: auto;
        width: 50%;
        /* -webkit-filter: drop-shadow(5px 5px 5px #888888 );
        filter: drop-shadow(5px 5px 5px #888888); */
  }

   .logo-container {
        text-align: center !important; 
        width: 100% !important;
   }
</style>


