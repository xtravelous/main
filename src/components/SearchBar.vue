<template>
  <v-layout :align-center="alignCenter" :justify-center="justifyCenter">
    <v-flex xs8 sm8 md8 lg8 xl8>
        <form class="form" @submit.prevent="getExperiences">
          <vue-google-autocomplete ref="address" id="map" :classname="classname" placeholder="Type location here..." v-on:placechanged="getAddressData"
            country="ph"></vue-google-autocomplete>
          <v-btn large color="orange darken-1" class="btn--inside hidden-sm-and-down" dark type="submit">
            Search <v-icon right>send</v-icon></v-btn>
        </form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    alignCenter: {
      default: true,
      required: false
    },
    justifyCenter: {
      default: true,
      required: false
    }
  },
  data () {
    return {
      address: '',
      smallerClass: 'form__field grey--text text--darken-3 form__field__width__small',
      biggerClass: 'form__field grey--text text--darken-3 form__field__width__large'
    }
  },
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.address = addressData
      this.getExperiences()
    },
    getExperiences () {
      const searchValue = document.querySelector('#map').value
      if (!searchValue) return false
      const place = searchValue.replace(/\s+/g, '-').toLowerCase()
      const addressData = this.address ? this.address : {route: searchValue}
      this.$router.push({ name: 'search-slug', params: { slug: place, addressData } })
    }
  },
  computed: {
    classname () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return this.biggerClass
        case 'sm': return this.biggerClass
        case 'md': return this.smallerClass
        case 'lg': return this.smallerClass
        case 'xl': return this.smallerClass
      }
    }
  }
}
</script>

<style scoped>
.btn--inside {
  margin-left: -96px;
}

.form__field {
  background: #fff;
  font: inherit;
  -webkit-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
          box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
  border: 0;
  outline: 0;
  font-weight: bold;
}

.form__field__width__small {
  width: 80%;
  padding: 22px 18px;
}

.form__field__width__large {
  width: 100%;
  padding: 9px 18px;
}
</style>

