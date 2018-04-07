<template>
  <div>
    <v-container>
      <v-layout row wrap class="pt-5 grey--text text--darken-3">
        <v-flex xs12 sm12 md6 lg6 xl6 class="px-1">
          <progressive-img v-viewer :src="experience.coverURL" alt="Primary Image" class="card-img pb-3 hidden-md-and-up" />
          <!-- <img v-viewer :src="experience.coverPhoto" alt="Primary Image" class="card-img pb-3 hidden-md-and-up content-placeholder" /> -->
          <h1 style="font-size: 32px;">{{experience.name || ''}}</h1>
          <h3 class="subheading pt-3">
            <v-layout row wrap>
              <v-flex xs6 sm6 md6 lg6 xl6>
                <p>
                  <v-icon color="blue darken-1">location_on</v-icon> {{experience.location.name || ''}} in {{experience.location.city}}</p>
                  <p>
                    <v-icon color="blue darken-1">date_range</v-icon> {{experience.noOfDays}} days total</p>
                    <p>
                      <v-icon color="blue darken-1">fa-user</v-icon>
                      Hosted by
                      <a href="#" class="no-underline">{{experience.user.firstName || ''}} {{experience.user.lastName || ''}}
                        <!-- {{fullName}} -->
                      </a>
                    </p>
                  </v-flex>
                  <v-flex xs6 sm6 md6 lg6 xl6>
                    <p class="text-xs-right">
                      <v-avatar :size="'65'" class="grey lighten-4">
                        <img src="http://i.pravatar.cc/65" alt="avatar" class="elevation-1 content-placeholder">
                      </v-avatar>
                    </p>
                  </v-flex>
                </v-layout>

              </h3>
              <HorizontalRule paddingClass="pb-4 pt-3" />
              <h2>Description</h2>
              <p class="subheading pt-2 " v-html="experience.description"></p>
              <HorizontalRule paddingClass="py-4" />
              <div v-show="experience.notes">
                <h2>Notes</h2>
                <div class="subheading pt-3">
                  <p>Inclusions:</p>
                  <p>
                    <v-icon color="blue darken-1">fa-glass-martini</v-icon> 1 buko juice
                  </p>
                  <p>
                    <v-icon color="blue darken-1">fa-utensils</v-icon> 1 sizzling squid
                  </p>
                  <p>
                    <v-icon color="blue darken-1">fa-beer</v-icon> 1 ice-cold San Miguel
                  </p>
                  <br>
                  <p>Exclusions:</p>
                  <p>
                    <v-icon color="blue darken-1">fa-shopping-cart</v-icon> seafood purchases
                  </p>
                  <p>
                    <v-icon color="blue darken-1">fa-money-bill-alt</v-icon> cooking charge
                  </p>
                </div>
                <HorizontalRule paddingClass="py-4" />
              </div>
              <h2>Where we'll be</h2>
              <p class="subheading pt-2" v-html="address"></p>
              <div id="locationInMap" class="pt-2">
                <gmap-map :center="{lat:experience.coordinates.lat, lng:experience.coordinates.lng}" :zoom="11" style="width: 100%; height: 300px">
                  <gmap-marker :position="{lat:experience.coordinates.lat, lng:experience.coordinates.lng}" :clickable="true" :draggable="true"
                  @click="center={lat:14.5453624, lng:120.9861792}"></gmap-marker>
                </gmap-map>
              </div>
            </v-flex>
            <v-flex xs12 sm12 md1 lg1 xl1 class="py-3"></v-flex>
            <v-flex xs12 sm12 md5 lg5 xl5 class="px-1">
              <div :style="{ position: position }">
                <v-card>
                  <img :src="experience.coverURL" alt="Primary Image" class="hidden-sm-and-down card-img content-placeholder">
                  <v-card-title>
                    <div>
                      <h4>{{experience.price | currency('₱')}} per person</h4>
                      <div>
                        <v-icon class="star-icon orange--text">star</v-icon>
                        <v-icon class="star-icon orange--text">star</v-icon>
                        <v-icon class="star-icon orange--text">star</v-icon>
                        <v-icon class="star-icon orange--text">star</v-icon>
                        <v-icon class="star-icon">star_border</v-icon>
                        <span>110 reviews</span>
                      </div>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn depressed dark color="orange darken-2">Contact host</v-btn>
                    <v-btn @click.stop="datesAvailableDialog = true" depressed dark color="orange darken-2">See dates</v-btn>
                  </v-card-actions>
                </v-card>
                <Reviews class="pt-4" />
                <v-btn flat color="orange darken-3">Read all 10 reviews</v-btn>
              </div>
            </v-flex>
          </v-layout>
          <div class="pt-5">
            <span class="headline bold grey--text text--darken-3">Similar experiences in Cagayan</span>
            <CarouselDecks />
          </div>
        </v-container>
        <v-dialog v-model="datesAvailableDialog" max-width="450">
          <v-card>
            <v-card-title>
              <v-btn icon @click="datesAvailableDialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <div class="headline">When do you want to go?</div>
            </v-card-title>
            <v-card-text>
              <vee-date-picker is-expanded v-model="startDate" @input="computeEndDate" :min-date="new Date()" is-inline tint-color="#F57C00"
              show-caps>
            </vee-date-picker>
            <div class="mt-3 mb-2 title grey--text text--darken-2">
              No of days: {{experience.noOfDays}}
            </div>
            <div class="mt-3 mb-2 title grey--text text--darken-2" v-if="endDate">
              {{startDate | simpleDate}} - {{ endDate }}
            </div>
            <v-list>
              <template v-for="(time, i) in experience.times">
                <v-divider v-show="i"></v-divider>
                <v-list-tile :key="i">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ time.from }} - {{ time.to }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn depressed color="orange darken-2" dark @click="reviewAndPay(time, experience.eid)">Choose</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>

  <script>
  import HorizontalRule from '@/components/HorizontalRule'
  import CarouselDecks from '@/components/CarouselDecks'
  import Reviews from '@/components/Reviews'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  const loaderUrl = require('@/assets/spinner.gif')
  export default {
    data: () => ({
      images: [],
      loaderUrl,
      datesAvailableDialog: false,
      startDate: new Date(),
      endDate: null
    }),
    methods: {
      computeEndDate (day) {
        this.endDate = moment(this.startDate).add(this.experience.noOfDays, 'days').format('MMMM D')
      },
      reviewAndPay (time, id) {
        if (!this.endDate || !this.startDate) return
          const startDate = moment(this.startDate).format('MMMM D')
        this.$router.push({name: 'ReviewAndPay', params: { 
          id, 
          time,
          date: {
            from: startDate,
            end: this.endDate
          }
        }
      })
      }
    },
    created () {
      if (this.experiences.length > 0) {
        this.$store.commit('experiences/SET_EXPERIENCE', this.$route.params.id)
      } else {
        this.$Progress.start()
        this.$store.dispatch('experiences/FETCH_EXPERIENCE', this.$route.params.id)
        .then(() => {
          this.$Progress.finish()
        })
        .catch((e) => {
          this.$Progress.fail()
          console.error(e)
        })
      }
      window.scrollTo(0, 0)
      const cat = ['animals', 'people', 'tech', 'nature']
      for (let g = 1; g <= 8; g++) {
        this.images.push('http://placeimg.com/640/480/' + cat[Math.floor(Math.random() * cat.length)])
      }
    },
    components: {
      HorizontalRule,
      CarouselDecks,
      Reviews
    },
    computed: {
      position () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'static'
          case 'sm': return 'static'
          case 'md': return 'static'
          case 'lg': return 'static'
          case 'xl': return 'static'
        }
      },
      ...mapGetters({
        experiences: 'experiences/GET_EXPERIENCES',
        experience: 'experiences/GET_VIEWED_EXPERIENCE',
        fullName: 'accounts/GET_FULL_NAME',
        address: 'experiences/GET_COMPLETE_ADDRESS',
        user: 'accounts/GET_USER'
      })
    },
    filters: {
      simpleDate (val) {
        return moment(val).format('MMMM D')
      }
    },
    watch: {
      '$route.params.id' (val) {
        this.$store.commit('experiences/SET_EXPERIENCE', val)
        window.scrollTo(0, 0)
      }
    }
  }
  </script>

  <style scoped>
  .bold {
   font-weight: bold;
 }

 .justify {
   text-align: justify;
 }

 .event-details {
   padding-top: 50px;
 }

 .no-underline {
   text-decoration: none;
 }

 .card-img {
  height: auto;
  width: 100%;
  max-width: 100%;
  -moz-transition: all 1s;
  -webkit-transition: all 1s;
  transition: all 1s;
}

.star-icon {
  font-size:15px;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
</style>