<template>
    <div>
        <h2 class="pb-2">Reviews</h2>
        <div v-for="(r, i) in reviews" :key="i">
            <v-list two-line style="background: inherit;">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img src="http://i.pravatar.cc/50" alt="avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="r.name" class="title"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="r.date"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <div class="pl-4 grey--text text--darken-3">
                <span class="subheading">{{r.text}}</span>
            </div>
            <HorizontalRule paddingClass="pt-4" />
        </div>
    </div>
</template>

<script>
import HorizontalRule from '@/components/HorizontalRule'
export default {
  data () {
    return {
      avatarSize: 50,
      reviews: [
        {
          text: 'A perfect example of that music can bring everyone together! A event that cannot be misted.',
          name: 'Xander Ford',
          date: 'January 29, 2018'
        },
        {
          text: 'Great music, nice people, good vibes!',
          name: 'John Cena',
          date: 'January 29, 2018'
        },
        {
          text: 'Joj hosted a fenomenal evening in a unique industrial setting right in the city center. It was lovely experiencing the musical talent of refugees and newcomers from all over the world. As an Amsterdam local, I would def recommend it! What a way to end the weekend!',
          name: 'Mario',
          date: 'January 29, 2018'
        }
      ]
    }
  },
  components: {
    HorizontalRule
  }
}
</script>