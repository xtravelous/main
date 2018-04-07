<template>
  <v-container>
    <div class="pt-1">
      <v-card flat>
        <v-layout row wrap>
          <v-flex xs12 sm12 md3 lg3 xl3>
            <v-list class="pt-0 pb-0">
              <v-list-tile ripple v-for="(item, i) in items" :key="i" @click="">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{item.name}}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <div class="pa-3">
              <v-btn depressed block color="orange darken-1" dark @click="becomeHost('expert')" v-if="!isHost">Become a host</v-btn>
              <v-btn depressed block color="grey darken-3" dark @click="becomeHost('traveler')" v-if="isHost">Become a user</v-btn>
            </div>
          </v-flex>
          <v-flex xs12 sm12 md9 lg9 xl9>
            <div class="pt-0">
              <v-card tile flat>
                <v-card-title class="grey darken-1">
                  <div class="headline white--text">Required</div>
                </v-card-title>
                <v-card-text>
                  <v-form v-model="valid" ref="profileForm" lazy-validation>
                    <v-container fluid>
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>First Name</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field :disabled="disableProfileFields" :rules="basicRules" v-model="userData.firstName"></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>Last Name</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field :disabled="disableProfileFields" :rules="basicRules" v-model="userData.lastName"></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>Account Type</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-select
                          :items="accountTypes"
                          single-line
                          bottom
                          :rules="basicRules"
                          v-model="userData.type"
                          disabled
                          ></v-select>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>Email Address</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field :disabled="disableProfileFields" :rules="emailRules" v-model="userData.email"></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>Contact Number</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field :disabled="disableProfileFields" v-model="userData.contact"></v-text-field>
                        </v-flex>
                      </v-layout>
                      <div class="text-xs-center">
                        <v-btn flat @click="activateProfileFields" v-show="editProfileButton">Edit</v-btn>
                        <v-btn color="red lighten-1" class="white--text" @click="save()" v-show="saveProfileButton">Save</v-btn>
                        <v-btn flat @click="cancelEdit" v-show="saveProfileButton">Cancel</v-btn>
                      </div>
                    </v-container>
                  </v-form>
                </v-card-text>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
      <v-dialog v-model="photoCroppieDialog">
        <v-card>
          <v-card-text>
            <div id="croppiecontainer"></div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created () {
    this.userData = Object.assign({}, this.getUser)
  },
  data () {
    return {
      items: [
      {
        name: 'Edit Profile'
      },
      {
        name: 'Photos'
      },
      {
        name: 'Trust and Verification'
      },
      {
        name: 'References'
      }
      ],
      accountTypes: [
      {
        text: 'Traveler',
        value: 'traveler'
      },
      {
        text: 'Expert',
        value: 'expert'
      }
      ],
      userData: {
        contact: null,
        email: null,
        fullName: null,
        type: null
      },
      valid: null,
      disableProfileFields: true,
      basicRules: [
      (v) => !!v || 'This field is required'
      ],
      emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
      ],
      saveProfileButton: false,
      editProfileButton: true,
      photoCroppieDialog: false
    }
  },
  methods: {
    save () {
      if (this.$refs.profileForm.validate()) {
        const r = confirm('Are you sure?')
        if (r) {
          this.$Progress.start()
          this.$store.dispatch('accounts/UPDATE_USER', this.userData)
          .then(res => {
            this.$Progress.finish()
            this.deactivateProfileFields()
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'Profile has been updated!' })
          })
          .catch(error => {
            this.$Progress.fail()
            this.activateProfileFields()
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: 'An error occurred.' })
            console.error(error)
          })
        }
      }
    },
    cancelEdit () {
      this.deactivateProfileFields()
    },
    deactivateProfileFields () {
      this.disableProfileFields = true
      this.editProfileButton = true
      this.saveProfileButton = false
    },
    activateProfileFields () {
      this.disableProfileFields = false
      this.editProfileButton = false
      this.saveProfileButton = true
    },
    becomeHost (accountType) {
      this.deactivateProfileFields()
      const r = confirm('Are you sure?')
      if (r) {
        this.$Progress.start()
        this.$store.dispatch('accounts/UPDATE_ACCOUNT_TYPE', accountType)
        .then(() => {
          this.$Progress.finish()
          const message = accountType === 'expert' ? 'You can now create your experience!' : 'You can now join events!'
          this.userData.type = accountType
          this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message })
        })
        .catch(error => {
          this.$Progress.fail()
          this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: 'An error occurred.' })
          console.error(error)
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'accounts/IS_AUTHENTICATED',
      isHost: 'accounts/IS_HOST',
      getUser: 'accounts/GET_USER'
    })
  }
}
</script>