<template>
  <div>
    <v-container>
      <div class="pt-1">
        <v-card flat>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3 lg3 xl3>
              <v-list class="pt-0 pb-0">
                <v-list-tile ripple v-for="(item, i) in items" :key="i" @click="navigate(item)">
                  <v-list-tile-content>
                    <v-list-tile-title class="grey--text text--darken-2">
                      {{item}}
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="currentTab === item">
                    <v-icon color="blue darken-1">mode_edit</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>
            <v-flex xs12 sm12 md9 lg9 xl9>
              <div class="pt-0">
                <v-card tile flat>
                  <v-card-title class="grey darken-1">
                    <div class="headline white--text">{{currentTab}}</div>
                  </v-card-title>
                </v-card>
                <v-card-text>
                  <div v-show="currentTab === 'Cover'">
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title">Experience title</div>
                          <div class="body-1">
                            A great title is short, clear and descriptive. Avoid abstract or complicated words.
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="experienceData.name" label="Enter experience name"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title mt-5">Cover photo</div>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12 class="pt-2">
                            <image-uploader id="coverPhoto" :debug="2" :maxWidth="1024" :maxHeight="1024" :quality="0.7" :autoRotate=true outputFormat="verbose"
                              :preview=false @input="setImage" @onUpload="startImageResize" @onComplete="endImageResize" v-show="imageUploaderContainer"></image-uploader>
                          <img class="coverPhotoPreview" v-show="hasCoverPhoto" :src="experienceData.coverPhoto" alt="cover_photo">
                          <br>
                          <v-btn :disabled="uploadCoverPhotoBtn" large color="orange darken-1" dark @click="openUploader">
                            <v-icon left>camera_alt</v-icon> Upload Cover Photo</v-btn>
                          <div>
                            <v-checkbox color="orange darken-1" label="Same as cover?" v-model="sameAsCover" v-show="experienceData.coverPhoto" light></v-checkbox>
                          </div>
                        </v-flex>
                        <div v-show="hasCoverPhoto" class="pt-4">
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">Thumbnail</div>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12 class="pt-2">
                              <image-uploader id="coverPhotoThumbnail" :debug="2" :maxWidth="1024" :maxHeight="1024" :quality="0.7" :autoRotate=true outputFormat="verbose"
                                :preview=false @input="setImageThumbnail" @onUpload="startImageThumbnailResize" v-show="imageUploaderContainer"></image-uploader>
                            <img class="coverPhotoPreview" :src="experienceData.thumbnail" alt="cover_thumbnail">
                            <br>
                            <v-btn color="orange darken-1" dark @click="openThumbnailUploader" v-show="!sameAsCover">
                              <v-icon left>camera_alt</v-icon> Upload thumbnail</v-btn>
                          </v-flex>
                        </div>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="currentTab === 'Description'">
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title">What we’ll do</div>
                          <div class="body-1">
                            Describe in detail what you’ll be doing with your guests. The more information you can give, the better.
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <!-- <v-text-field v-model="experienceData.description" label="Describe everything here..." multi-line></v-text-field> -->
                          <br>
                          <vue-editor v-model="experienceData.description"></vue-editor>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="currentTab === 'Place'">
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title">Where we’ll meet</div>
                          <div class="body-1">
                            Let guests know exactly where you’ll be meeting.
                          </div>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12 class="pt-4">
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">Location name</div>
                          </v-flex>
                          <v-flex xs12 sm12 md9 lg9 xl9>
                            <v-text-field v-model="experienceData.location.name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">Street address</div>
                          </v-flex>
                          <v-flex xs12 sm12 md9 lg9 xl9>
                            <v-text-field v-model="experienceData.location.streetAddress" label="House name/number + street/road"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">Apt, Suit, Bldg. (optional)</div>
                          </v-flex>
                          <v-flex xs12 sm12 md9 lg9 xl9>
                            <v-text-field v-model="experienceData.location.optional" label="Apt., suite, building access code"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">City</div>
                          </v-flex>
                          <v-flex xs12 sm12 md9 lg9 xl9>
                            <v-text-field v-model="experienceData.location.city"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 xl12>
                            <div class="title">ZIP code</div>
                          </v-flex>
                          <v-flex xs12 sm12 md9 lg9 xl9>
                            <v-text-field v-model="experienceData.location.zipCode"></v-text-field>
                          </v-flex>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="currentTab === 'Date and Time'">
                    <v-container fluid grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title">Number of days</div>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                          <v-select :items="numberOfDays" bottom v-model="experienceData.noOfDays" label="Choose..."></v-select>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title mb-3">Time <v-btn depressed color="blue darken-1" @click="timePickerDialog = true" dark>Add Time</v-btn></div>
                          <p v-for="(time, i) in experienceData.times" :key="i" class="grey--text text--darken-2 title">
                            <v-icon color="red" style="cursor: pointer;" @click="experienceData.times.splice(i, 1)">remove_circle</v-icon> {{time.from}} - {{time.to}}
                          </p>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="currentTab === 'Price'">
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12 xl12>
                          <div class="title">Price</div>
                        </v-flex>
                        <v-flex xs12 sm12 md4 lg4 xl4>
                          <v-text-field label="Price" type="number" v-model="experienceData.price"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <div v-show="currentTab === 'Notes'">
                    <v-container fluid grid-list-md>
                      <v-flex xs12 sm12 md12 lg12 xl12>
                        <div class="title">What else should guests know?</div>
                        <div class="body-1">
                          Mention anything that guests will have to bring with them or arrange on their own, like transportation.
                        </div>
                      </v-flex>
                      <v-flex xs12>
                        <br>
                        <vue-editor v-model="experienceData.notes"></vue-editor>
                      </v-flex>
                    </v-container>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn fab color="blue darken-1" dark @click="previousTab" v-show="currentTab !== 'Cover'">
                    <v-icon>arrow_back</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn fab color="blue darken-1" dark @click="nextTab" v-show="currentTab !== 'Notes'">
                    <v-icon>arrow_forward</v-icon>
                  </v-btn>
                  <v-btn fab :disabled="submitLoadingButton" :loading="submitLoadingButton" color="orange darken-1" class="white--text" @click="submitExperience" v-show="currentTab === 'Notes'">
                    <v-icon>send</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </div>
    </v-container>
    <v-dialog v-model="timePickerDialog" persistent max-width="350">
      <v-card>
        <v-card-title>
          <div class="headline">Select Time</div>
        </v-card-title>
        <v-card-text>
          <v-select :items="timeSelectionFrom" label="From" v-model="timepickerFrom"></v-select>
          <v-select :items="timeSelectionTo" label="To" v-model="timepickerTo"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="timePickerDialog = false" color="grey darken-2">Cancel</v-btn>
          <v-btn flat color="blue darken-2" @click="addTime">Add Time <v-icon right>send</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VueEditor } from 'vue2-editor'
import moment from 'moment'
const timeArray = []
export default {
  data () {
    return {
      e6: 1,
      hasCoverPhoto: false,
      hasThumbnail: false,
      experienceData: {
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
        notes: null
      },
      imageUploaderContainer: false,
      uploadCoverPhotoBtn: false,
      sameAsCover: true,
      timeSelectionFrom: timeArray,
      timeSelectionTo: timeArray,
      termsAndCons: false,
      items: ['Cover', `Description`, 'Place', 'Date and Time', 'Price', 'Notes'],
      currentTab: 'Cover',
      numberOfDays: [],
      timepickerFrom: null,
      timepickerTo: null,
      allowedMinutes: [0, 30],
      timePickerDialog: false,
      submitLoadingButton: false
    }
  },
  created () {
    for (let x = 1; x <= 12; x++) {
      if (x === 12) {
        timeArray.push(`${x}:00 PM`)
        timeArray.push(`${x}:30 PM`)
      } else {
        timeArray.push(`${x}:00 AM`)
        timeArray.push(`${x}:30 AM`)
      }
    }
    for (let x = 1; x <= 12; x++) {
      if (x === 12) {
        timeArray.push(`${x}:00 AM`)
        timeArray.push(`${x}:30 PM`)
      } else {
        timeArray.push(`${x}:00 AM`)
        timeArray.push(`${x}:30 PM`)
      }
    }
    for (let x = 1; x <= 31; x++) {
      this.numberOfDays.push(x)
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'accounts/IS_AUTHENTICATED',
      isHost: 'accounts/IS_HOST',
      getUser: 'accounts/GET_USER'
    })
  },
  methods: {
    processCoverPhoto (event) {
      const allowedImageExtensions = ['image/jpeg', 'image/png']
      const file = event.target.files[0]
      if (allowedImageExtensions.includes(file.type)) {
        if (process.browser) {
          const FR = new FileReader()
          FR.addEventListener('load', (e) => {
            if (this.hasCoverPhoto) {
              this.experienceData.thumbnail = e.target.result
            } else {
              this.hasCoverPhoto = true
              this.experienceData.coverPhoto = e.target.result
              this.experienceData.thumbnail = e.target.result
            }
          })
          FR.readAsDataURL(file)
        }
      } else {
        alert('invalid image')
      }
    },
    openUploader () {
      document.getElementById('coverPhoto').click()
    },
    setImage (file) {
      this.hasCoverPhoto = true
      this.uploadCoverPhotoBtn = false
      this.experienceData.coverPhoto = file.dataUrl
      this.experienceData.thumbnail = file.dataUrl
    },
    startImageResize () {
      this.uploadCoverPhotoBtn = true
    },
    endImageResize () {
      // this.uploadCoverPhotoBtn = false
    },
    openThumbnailUploader () {
      document.getElementById('coverPhotoThumbnail').click()
    },
    setImageThumbnail (file) {
      this.experienceData.thumbnail = file.dataUrl
    },
    startImageThumbnailResize () {},
    submitExperience () {
      const location = this.experienceData.location
      this.experienceData.formattedAddress = ''
      if (location.streetAddress) {
        this.experienceData.formattedAddress += location.streetAddress
      }
      if (location.optional) {
        this.experienceData.formattedAddress += location.optional
      }
      if (location.city) {
        this.experienceData.formattedAddress += location.city
      }
      if (location.zipCode) {
        this.experienceData.formattedAddress += location.zipCode
      }
      const r = confirm('Are you sure?')
      if (r) {
        this.submitLoadingButton = true
        this.$store.dispatch('experiences/ADD_EXPERIENCE', this.experienceData)
          .then(() => {
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'success', message: 'Your experience has been added!' })
            this.submitLoadingButton = false
          })
          .catch(error => {
            this.$events.fire('SHOW_NOTIFICATION', { icon: 'error', message: 'An error occurred.' })
            this.submitLoadingButton = false
            console.error(error)
          })
      }
    },
    navigate (tab) {
      this.currentTab = tab
    },
    previousTab () {
      const i = this.items.findIndex((item) => item === this.currentTab)
      if (i >= 0 && i <= 5) {
        this.currentTab = this.items[i - 1]
      }
    },
    nextTab () {
      const i = this.items.findIndex((item) => item === this.currentTab)
      if (i >= 0 && i <= 4) {
        this.currentTab = this.items[i + 1]
      }
    },
    addTime () {
      const timepickerFrom = moment(this.timepickerFrom, 'h:mm A')
      const timepickerTo = moment(this.timepickerTo, 'h:mm A')
      if (timepickerFrom < timepickerTo) {
        const from = moment(timepickerFrom).format('h:mm A')
        const to = moment(timepickerTo).format('h:mm A')
        this.experienceData.times.push({
          from, to
        })
        this.timePickerDialog = false
        console.log(this.experienceData)
      }
    }
  },
  watch: {
    sameAsCover () {
      this.experienceData.thumbnail = this.sameAsCover ? this.experienceData.coverPhoto : null
    },
    timepickerFrom () {
      const timepickerFrom = moment(this.timepickerFrom, 'h:mm A')
      this.timeSelectionTo = timeArray.filter((time) => {
        return timepickerFrom < moment(time, 'h:mm A')
      })
    },
    timepickerTo () {
      const timepickerTo = moment(this.timepickerTo, 'h:mm A')
      this.timeSelectionFrom = timeArray.filter((time) => {
        return timepickerTo > moment(time, 'h:mm A')
      })
    }
  },
  components: {
    VueEditor
  } 
}
</script>

<style>
  .coverPhotoPreview {
    width: 50%;
    height: auto;
  }
</style>