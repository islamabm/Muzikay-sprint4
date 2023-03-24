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
      <!-- <RouterLink to="/station/modal"> Modal</RouterLink> -->

      <div class="liked-create-nav">
        <a @click="createPlayList">
          <div>
            <font-awesome-icon class="plus-sign" :icon="['fas', 'plus']" />
          </div>
          Create Playlist
        </a>

        <RouterLink class="liked-songs" to="/station/like">
          <font-awesome-icon class="heart-icon" :icon="['fas', 'heart']" />
          Liked songs
        </RouterLink>
      </div>

      <article class="clean-list user-stations">
        <article v-for="playlist in userStations" :key="playlist._id">
          <RouterLink :to="`/station/${playlist._id}`">{{
            playlist.name
          }}</RouterLink>
        </article>
      </article>
    </div>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faHeart)

export default {
  data() {
    return {
      playlistCounter: 0,
      // station: stationService.createNewStation(),
    }
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    createPlayList() {
      this.playlistCounter++
      console.log(this.playlistCounter)
      const playlistName = `My Playlist #${this.playlistCounter}`
      const station = stationService.createNewStation(
        playlistName
        // playlistName
      ) // Pass the name as a second argument
      // const newPlaylist = { _id: station._id, name: playlistName }
      this.userStations.push(station)
      this.$router.push(`/station/${station._id}`)
    },
  },
  computed: {
    userStations() {
      return this.$store.getters.getUserStations
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>
