<template>
  <v-container>
    <div class="pt-1">
      <v-card flat>
        <v-layout row wrap>
          <v-flex xs12 sm12 md3 lg3 xl3>
            <div class="text-xs-center px-2 pt-2">
              <v-avatar size="200px" tile>
                <img :src="getUser.picture" alt="userImage">
              </v-avatar>
              <v-btn depressed block color="orange" dark @click="openProfilePictureDialog">Update profile picture</v-btn>
            </div>
            <!-- <v-list class="pt-0 pb-0">
              <v-list-tile ripple v-for="(item, i) in items" :key="i" @click="">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{item.name}}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list> -->
            <div class="px-2">
              <v-btn depressed block color="orange" dark @click="becomeHost('expert')" v-if="!isHost">Become a host</v-btn>
              <v-btn depressed block color="primary" dark @click="becomeHost('traveler')" v-if="isHost">Become a user</v-btn>
            </div>
          </v-flex>
          <v-flex xs12 sm12 md9 lg9 xl9>
            <div class="pt-0">
              <v-card tile flat>
                <v-card-title class="orange">
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
                      <v-layout row>
                        <v-flex xs4>
                          <v-subheader>About me</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                          <vue-editor id="user-about" v-model="userData.about" :disabled="disableProfileFields"></vue-editor>
                        </v-flex>
                      </v-layout>
                      <div class="text-xs-center">
                        <v-btn flat @click="activateProfileFields" v-show="editProfileButton">Edit</v-btn>
                        <v-btn color="orange darken-2" class="white--text" @click="save" v-show="saveProfileButton">Save</v-btn>
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
      <v-dialog v-model="profilePictureDialog" max-width="400">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
              <p>
                <img :src="uploadImagePreview" alt="profpic" v-show="uploadImagePreview">
              </p>
              <input ref="profilePictureRef" type="file" @change="readFile">
              <!-- <v-btn class="grey darken-3 white--text" @click="$refs.profilePictureRef.click()">Upload picture</v-btn> -->
            </div>
            <div class="hidden-sm-and-up mt-4" v-show="uploadImagePreview">
              <v-btn depressed block class="orange darken-2 white--text" @click="saveProfilePicture" :disabled="saveProfilePictureButton" :loading="saveProfilePictureButton">Save</v-btn>
              <v-btn depressed block class="grey darken-1" dark @click="profilePictureDialog = false">Cancel</v-btn>
            </div>
          </v-card-text>
          <v-card-actions v-show="uploadImagePreview" class="hidden-xs-only">
            <v-spacer></v-spacer>
            <v-btn depressed color="grey darken-1" dark @click="profilePictureDialog = false">Cancel</v-btn>
            <v-btn depressed color="orange darken-2 white--text" :disabled="saveProfilePictureButton" :loading="saveProfilePictureButton" @click="saveProfilePicture">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { VueEditor } from 'vue2-editor'
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
        type: null,
        about: null
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
      profilePictureDialog: false,
      uploadImagePreview: null,
      saveProfilePictureButton: false
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
    },
    openProfilePictureDialog () {
      this.profilePictureDialog = true
    },
    resizeImage (img, width, height) {
      console.log(width, height)
      return new Promise((resolve) => {
        // We create an image to receive the Data URI
        const fakeImg = document.createElement('img')
        const self = this
        fakeImg.onload = function() {
          // create an off-screen canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          // set its dimension to target size
          const resizedDimensions = self.calculateAspectRatioFit(width, height)
          canvas.width = resizedDimensions.width
          canvas.height = resizedDimensions.height
          // draw source image into the off-screen canvas
          ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
          // encode image to data-uri with base64 version of compressed image
          resolve(canvas.toDataURL())
        }
        fakeImg.crossOrigin = 'anonymous'
        fakeImg.src = img
      })
    },
    getImageDimensions (base64, objectURL) {
      const img = document.createElement('img')
      img.onload = () => {
        this.resizeImage(objectURL, img.width, img.height)
        .then((resizedImage) => {
          this.uploadImagePreview = resizedImage
        })
      }
      img.src = base64
    },
    readFile() {
      const files = this.$refs.profilePictureRef.files
      if (files && files[0]) {
        console.log(files[0])
        var FR = new FileReader()

        FR.addEventListener('load', (e) => {
          this.getImageDimensions(e.target.result, URL.createObjectURL(files[0]))
        })

        FR.readAsDataURL(files[0])
      }
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth=120, maxHeight=120) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return { width: srcWidth*ratio, height: srcHeight*ratio }
    },
    saveProfilePicture () {
      this.$Progress.start()
      this.saveProfilePictureButton = true
      this.$store.dispatch('accounts/UPLOAD_PROFILE_PICTURE', {img: this.uploadImagePreview})
      .then(() => {
        this.$Progress.finish()
        this.profilePictureDialog = false
        this.saveProfilePictureButton = false
        this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'Profile picture has been successfully updated.' })
      })
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'accounts/IS_AUTHENTICATED',
      isHost: 'accounts/IS_HOST',
      getUser: 'accounts/GET_USER'
    })
  },
  components: {
    VueEditor
  }
}
</script>