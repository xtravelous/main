<template>
  <div >
    <h2 class="pb-2" v-if="GET_REVIEWS.length > 0">Reviews</h2>
    <h2 class="pb-2" v-else>No reviews yet</h2>
    <div v-for="(r, i) in limitBy(GET_REVIEWS, 8)" :key="r.id">
      <v-list three-line style="background: inherit;">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="r.user.picture" alt="avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="title">{{r.user.firstName}} {{r.user.lastName}}</v-list-tile-title>
            <v-list-tile-sub-title>{{r.createdAt | simpleDate}}</v-list-tile-sub-title>
            <v-list-tile-sub-title>
              <VueStars
              :name="uniqueName()"
              active-color="#FB8C00"
              inactive-color="#999999"
              hover-color="#FB8C00"
              :max="5"
              :readonly="true"
              char="★"
              :value="r.rating"
              style="font-size: 15px;"
              />
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div class="pl-4 grey--text text--darken-3">
        <span class="subheading">{{r.message}}</span>
      </div>
      <HorizontalRule paddingClass="pt-4" />
    </div>
    <v-btn v-if="GET_REVIEWS.length > 8" flat color="orange darken-3" @click="viewAll">Read all {{GET_REVIEWS.length}} reviews</v-btn>
    <v-btn v-if="IS_AUTHENTICATED" flat color="orange darken-3" @click="writeReview">Write a review</v-btn>
    <v-dialog max-width="600" v-model="reviewsDialog" scrollable>
      <v-card height="600px">
        <v-card-title>
          <div class="title">Reviews ({{GET_REVIEWS.length}})</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="reviewsDialog = false"><v-icon>close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <div v-for="(r, i) in GET_REVIEWS" :key="r.id">
            <v-list three-line style="background: inherit;">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="r.user.picture" alt="avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title">{{r.user.firstName}} {{r.user.lastName}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{r.createdAt | simpleDate}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    <VueStars
                    :name="uniqueName()"
                    active-color="#FB8C00"
                    inactive-color="#999999"
                    hover-color="#FB8C00"
                    :max="5"
                    :readonly="true"
                    char="★"
                    :value="r.rating"
                    style="font-size: 15px;"
                    />
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <div class="pl-4 grey--text text--darken-3">
              <span class="subheading">{{r.message}}</span>
            </div>
            <HorizontalRule paddingClass="pt-4" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <sweet-modal blocking :icon="sweetModal.icon" ref="sweetModal">{{sweetModal.message}}</sweet-modal>
    <v-dialog max-width="400" v-model="writeReviewDialog">
      <ReviewDialog @CLOSE="closeWriteReviewDialog" />
    </v-dialog>
  </div>
</template>

<script>
import HorizontalRule from '@/components/HorizontalRule'
import {mapGetters} from 'vuex'
import VueStars from 'vue-stars'
import moment from 'moment'
import ReviewDialog from '@/components/ReviewDialog'
export default {
  data () {
    return {
      avatarSize: 50,
      reviewsDialog: false,
      writeReviewDialog: false,
      sweetModal: {
        icon: null,
        message: null
      }
    }
  },
  components: {
    HorizontalRule,
    VueStars,
    ReviewDialog
  },
  computed: {
    ...mapGetters({
      GET_REVIEWS: 'reviews/GET_REVIEWS',
      IS_AUTHENTICATED: 'accounts/IS_AUTHENTICATED'
    })
  },
  methods: {
    viewAll () {
      this.reviewsDialog = true
    },
    writeReview () {
      this.$store.dispatch('bookings/GET_BOOKING', this.$route.params.id)
      .then((response) => {
        if (response.found) {
          this.writeReviewDialog = true
        } else {
          setTimeout(() => {
            this.sweetModal.icon = 'error'
            this.sweetModal.message = 'No booking found.'
            this.$refs.sweetModal.open()
            setTimeout(() => {
              this.$refs.sweetModal.close()
            }, 2000)
          }, 250)
        }
      })
    },
    closeWriteReviewDialog () {
      this.writeReviewDialog = false
      this.sweetModal.icon = 'success'
      this.sweetModal.message = 'Review has been successfully submitted.'
      this.$refs.sweetModal.open()
      setTimeout(() => {
        this.$refs.sweetModal.close()
      }, 2000)
    },
    uniqueName() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
  },
  filters: {
    simpleDate (val) {
      return moment(val).format('MMMM D')
    }
  }
}
</script>