<template>
  <nav>
    <div class="sticky-nav">
      <div class="logo-container">
        <i class="logo" v-html="getSvg('whiteLogo')"></i>
        <span>Muzikay<span class="trademark">®</span></span>
      </div>
      <div class="main-nav">
        <RouterLink to="/station">Home</RouterLink>
        <RouterLink to="/station/search">Search</RouterLink>
        <RouterLink to="/station/library">Your Library</RouterLink>
      </div>

      <div class="liked-create-nav">
        <RouterLink :to="{path:'/station/' + station._id }">Create playlist</RouterLink>
        <!-- <router-link class="toy-details-link" :to="{ path: 'toy/' + toy._id }" -->
      <!-- >details</router-link -->
    <!-- >| -->


        <RouterLink to="/station/like">Liked songs</RouterLink>
      </div>
    </div>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
import {stationService} from '../services/station.service.local.js'
export default {
  data() {
    return {
      station: stationService.getEmptyStation(),
    }
  },
methods: {
  getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
  },
  // computed: {
  //   makeNewStation() {
  //     return stationService.getEmptyStation()
  //   }  
// }
}
</script>
