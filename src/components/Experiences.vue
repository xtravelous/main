<template>
  <div>
    <span v-if="hasTitle" class="display-1 bold grey--text text--darken-3">{{title}} <span v-if="hideExperienceTextInTitle">Experience</span></span>
    <v-layout row wrap class="pt-3">
      <v-flex xs6 sm4 md4 lg3 xl3 v-for="(e, i) in experiences" :key="i" :index="i" class="pb-3">
        <v-card class="no-bg" ripple :to="`/explore/${e.eid}`">
          <div class="card-img-container">
            <img :src="e.thumbURL" alt="Deck Image" class="card-img content-placeholder" />
          </div>
          <v-card-title primary-title class="pt-2">
            <div>
              <h3 class="headline mb-0">{{e.name}}</h3>
              <span class="subheading justify-text">{{e.price | currency('₱')}}</span>
              <br>
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
      </v-flex>
    </v-layout>
    <div class="text-xs-center" v-if="hasButton">
      <v-btn :block="resizeShowAllButton" large color="orange darken-2" dark>Show all from {{title}} (1000+)
        <v-icon right>chevron_right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import VueStars from 'vue-stars'
export default {
  props: {
    title: {
      type: String
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasButton: {
      type: Boolean,
      default: true
    },
    experiences: {
      type: Array
    },
    hideExperienceTextInTitle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      slides: []
    }
  },
  components: {
    VueStars
  },
  methods: {
    uniqueName() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
  },
  created () {
    for (let g = 0; g <= 8; g++) {
      this.slides.push('')
    }
  },
  computed: {
    resizeShowAllButton () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true
        case 'sm': return true
        case 'md': return false
        case 'lg': return false
        case 'xl': return false
      }
    }
  }
}
</script>

<style scoped>
.card-img-container {
  position: relative;
  overflow: hidden;
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

.star-icon {
  font-size:15px;
}
</style>