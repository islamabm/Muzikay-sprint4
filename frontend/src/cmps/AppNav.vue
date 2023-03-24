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
          Liked Songs
        </RouterLink>
      </div>

      <Container @drop="onDrop" class="clean-list user-stations">
        <Draggable v-for="playlist in userStations" :key="playlist._id">
          <RouterLink :to="`/station/${playlist._id}`">{{
            playlist.name
          }}</RouterLink>
        </Draggable>
      </Container>
    </div>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faHeart)

export default {
  data() {
    return {
      playlistCounter: 0,
      userStations: [],
      // station: stationService.createNewStation(),
    }
  },
  methods: {
    onDrop(dropResult) {
      console.log('onDrop called with dropResult:', dropResult)
      this.userStations = this.applyDrag(this.userStations, dropResult)
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult

      if (removedIndex === null && addedIndex === null) return arr
      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      return result
    },

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
    Container,
    Draggable,
  },
}
</script>
