<template>
    <div>
        <v-card>
            <v-card-text class="pa-5">
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex xs5 sm5 md5 lg5 xl5>
                            <v-card flat ripple tile class="clickable-pointer" @click.native="openRegisterDialog('traveler')">
                                <img src="@/assets/traveler.png" alt="traveler_logo" class="img-responsive">
                                <div class="text-xs-center">
                                    <span class="headline grey--text text--darken-2">Account</span>
                                </div>
                            </v-card>
                        </v-flex>
                        <v-flex xs2 sm2 md2 lg2 xl2>
                            <div class="outer">
                                <div class="inner"></div>
                            </div>
                        </v-flex>
                        <v-flex xs5 sm5 md5 lg5 xl5 class="clickable-pointer">
                            <v-card flat ripple tile @click.native="openRegisterDialog('expert')">
                                <img src="@/assets/expert.png" alt="traveler_logo" class="img-responsive">
                                <div class="text-xs-center">
                                    <span class="headline grey--text text--darken-2">Account</span>
                                </div>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
  methods: {
    openRegisterDialog (accountType) {
      this.$events.fire('openRegisterDialog', accountType)
      console.log(accountType)
    }
  }
}
</script>

<style scoped>
    .img-responsive {
        height: auto;
        width: 100%;
    }

    .clickable-pointer {
        cursor: pointer;
    }

    .outer {
        width: 1px;
        height: 100%;
        margin: auto;
        position: relative;
        overflow: hidden;
    }
    .inner {
        position: absolute;
        width:100%;
        height: 40%;
        background: grey;
        top: 30%;
        box-shadow: 0px 0px 30px 20px grey;
    }
</style>