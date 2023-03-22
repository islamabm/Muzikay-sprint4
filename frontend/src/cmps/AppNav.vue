<template>
  <nav>
    <div class="sticky-nav">
      <div class="logo-container">
        <i class="logo" v-html="getSvg('whiteLogo')"></i>
        <span>Muzikay<span class="trademark">®</span></span>
      </div>

      <div class="main-nav">
        <div class="home-nav">
          <RouterLink to="/station/collection">
            <i class="home-icon icons" v-html="getSvg('homeIcon')"></i>
            Home
          </RouterLink>
        </div>

        <RouterLink to="/station/search">
          <i class="search-icon icons" v-html="getSvg('searchIcon')"></i>
          Search</RouterLink
        >

        <RouterLink to="/station/library">
          <i class="library-icon icons" v-html="getSvg('libraryIcon')"></i>
          Your Library</RouterLink
        >
      </div>

      <div class="liked-create-nav">
        <a @click="createPlayList">Create Playlist</a>
        <!-- <RouterLink :to="{ path: '/station/' + station._id }"
          >Create playlist</RouterLink
        > -->
        <!-- <router-link class="toy-details-link" :to="{ path: 'toy/' + toy._id }" -->
        <!-- >details</router-link -->
        <!-- >| -->

     
        <!-- <RouterLink :to="{ path: '/station/' + station._id }"
          >Create playlist</RouterLink
        > -->

        <RouterLink to="/station/like">Liked songs</RouterLink>
      </div>
    </div>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
export default {
  data() {
    return {
      // station: stationService.createNewStation(),
    }
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    createPlayList() {
      const station = stationService.createNewStation()
      this.$router.push(`/station/${station._id}`)
    },
  },
  // computed: {
  //   makeNewStation() {
  //     return stationService.getEmptyStation()
  //   }
  // }
}
</script>
