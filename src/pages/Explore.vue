<template>
    <div>
        <section>
            <Banner />
        </section>
        <section>
            <v-container class="my-3" grid-list-md>
               <Experiences title="Luzon" :experiences="experiences" />
               <div class="py-4"></div>
               <Experiences title="Visayas" :experiences="experiences" />
               <div class="py-4"></div>
               <Experiences title="Mindanao" :experiences="experiences" />
            </v-container>
        </section>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from '@/components/Banner'
import Experiences from '@/components/Experiences'
export default {
  data () {
    return {
      slides: []
    }
  },
  created () {
    for (let g = 1; g <= 8; g++) {
      this.slides.push('')
    }
  },
  computed: {
    ...mapGetters({
      experiences: 'experiences/GET_EXPERIENCES'
    })
  },
  components: {
    Banner,
    Experiences
  }
}
</script>