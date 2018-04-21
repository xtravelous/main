<template>
  <div>
    <div v-show="experiences.length === 0" class="text-xs-center">
      <!-- <img src="@/assets/spinner.gif" alt="spinner" /> -->
      <v-progress-circular indeterminate :size="50" color="orange darken-1"></v-progress-circular>
    </div>
    <carousel-3d v-show="experiences.length > 0" :autoplayTimeout="4000" :clickable="false" :disable3d="true" :space="315" :autoplay="true" :autoplayHoverPause="true"
      :controls-visible="true" :height="290" :width="300">
      <slide v-for="(e, i) in experiences" :key="i" :index="i">
        <v-card flat class="no-bg" :ripple="false" append :to="`/explore/${e.eid}`">
          <div class="card-img-container">
            <img :src="e.thumbURL" alt="Deck Image" class="card-img content-placeholder" />
          </div>
          <v-card-title primary-title :class="[e.name.length > 0 ? 'pt-1 pb-0 content-padding-y' : 'pt-1 pb-0 content-padding-y content-placeholder']">
            <div>
              <h3 class="experience-title mb-0">{{e.name}}</h3>
              <div class="subheading justify-text">{{e.price | currency('₱')}}</div>
              <div>
                <VueStars
                :name="uniqueName()"
                active-color="#FB8C00"
                inactive-color="#999999"
                shadow-color="#FFB74D"
                hover-color="#FB8C00"
                :max="5"
                :readonly="true"
                char="★"
                :value="e.highestRating.rating"
                class="star-size"
                />
                <span v-if="e.reviews.length > 0">{{e.reviews.length}}</span>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </slide>
    </carousel-3d>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueStars from 'vue-stars'
export default {
  data () {
    return {
      slides: []
    }
  },
  components: {
    VueStars
  },
  computed: {
    ...mapGetters({
      experiences: 'experiences/GET_EXPERIENCES'
    })
  },
  methods: {
    uniqueName() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
  }
}
</script>

<style scoped>
.no-bg {
  background-color: inherit !important;
}

.card-img-container {
  max-width: 100%;
}

.card-img {
  height: 180px;
  width: 100%;
  max-width: 100%;
  -moz-transition: all 1s;
  -webkit-transition: all 1s;
  transition: all 1s;
}

.card-img:hover {
  -moz-transform: scale(1.1);
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.justify-text {
  text-align: justify;
}

.carousel-3d-slide {
  background-color: transparent;
  border: 0;
}

.star-icon {
  font-size:15px;
}

.experience-title {
  font-size: 20px;
  font-weight: 300;
}

.content-padding-y {
  padding-left: 5px;
  padding-right: 5px;
}

.star-size {
  font-size: 15px;
}
</style>