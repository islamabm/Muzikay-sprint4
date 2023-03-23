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
        <a @click="createPlayList">Create Playlist</a>

        <RouterLink to="/station/like">Liked songs</RouterLink>
      </div>
    </div>

    <ul class="clean-list">
      <li v-for="playlist in playlists" :key="playlist._id">
        <RouterLink :to="`/station/${playlist._id}`">{{
          playlist.name
        }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
export default {
  data() {
    return {
      playlists: [],
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
      const playlistName = `My Playlist #${this.playlistCounter}`
      const station = stationService.createNewStation(
        playlistName
        // playlistName
      ) // Pass the name as a second argument
      console.log(station)
      const newPlaylist = { _id: station._id, name: playlistName }
      this.playlists.push(newPlaylist)
      this.$router.push(`/station/${newPlaylist._id}`)
    },
  },
}
</script>
