<template>
    <div class="banner text-xs-center" :style="{ 'padding-top': paddingTop }">
      <img src="@/assets/_banner.jpg" alt="Banner" style="width: 100%;" class="elevation-2 responsive-img" />
      <div class="banner-content text-xs-center" :style="{ top: logoPosition }">
        <img src="@/assets/logo.png" alt="Logo" :style="{ width: logoWidth }" class="responsive-img" />
        <SearchBar />
      </div>
    </div>
</template>

<script>
import SearchBar from './SearchBar'
export default {
  computed: {
    logoPosition () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '4vh'
        case 'sm': return '12vh'
        case 'md': return '15vh'
        case 'lg': return '20vh'
        case 'xl': return '30vh'
      }
    },
    paddingTop () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '0'
        case 'sm': return '0'
        case 'md': return '0'
        case 'lg': return '0'
        case 'xl': return '0'
      }
    },
    logoWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '50%'
        case 'sm': return '50%'
        case 'md': return '30%'
        case 'lg': return '30%'
        case 'xl': return '30%'
      }
    }
  },
  components: {
    SearchBar
  }
}
</script>

<style scoped>
  .banner {
    position: relative;
  }

  .banner-content {
    top: 0;
    left: 0;
    position: absolute;
  }

  .responsive-img {
    max-width: 100%;
    height: auto;
  }
</style>

