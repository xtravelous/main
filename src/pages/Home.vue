<template>
    <div>
        <section>
            <Banner />
        </section>
        <section>
            <v-container class="my-3">
                <span class="headline bold grey--text text--darken-3">Top Rated Experiences</span>
                <v-layout row wrap>
                    <v-flex xs12>
                        <CarouselDecks />
                        <div class="text-xs-center pt-2" v-show="experiences.length > 0">
                            <v-btn class="hidden-xs-only" dark :to="{ name: 'Explore' }" large color="orange darken-2">Show all (2000+)
                                <v-icon right>chevron_right</v-icon></v-btn>
                            <v-btn class="hidden-sm-and-up" dark block :to="{ name: 'Explore' }" large color="ornage darken-2">Show all (2000+)
                                <v-icon right>chevron_right</v-icon></v-btn>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </section>
        <section class="grey darken-2">
            <v-container class="white--text py-5">
                <h1 class="display-2 hidden-sm-and-down">What is xTravelous?</h1>
                <h1 class="headline text-xs-center hidden-md-and-up">What is xTravelous?</h1>
                <div class="px-5 pt-3">
                    <p class="definition">
                        We are an online hub where travellers connect with locals in order to enjoy unique local experiences - like dining, festivals,
                        hidden gems, workshops, sports & recreation, etc. After all, travelling is not just about the selfies;
                        it's the experiences we live for and the memories we bring home.
                    </p>
                    <p class="definition italic">
                        Don't just travel. Make it an xTravelous experience!
                    </p>
                </div>
            </v-container>
        </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from '../components/Banner'
import CarouselDecks from '../components/CarouselDecks'
export default {
  data () {
    return {}
  },
  components: {
    Banner,
    CarouselDecks
  },
  computed: {
    ...mapGetters({
      experiences: 'experiences/GET_EXPERIENCES'
    }),
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
  .bold {
      font-weight: bold;
  }

  .italic {
      font-style: italic;
  }

  .justify {
      text-align: justify;
  }

  .definition {
      font-size: 20px;
      text-align: justify;
  }
</style>