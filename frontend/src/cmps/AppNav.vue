<template>
  <nav class="nav-content">
    <div class="sticky-nav">
      <div class="logo-container">
        <i class="logo" v-html="getSvg('whiteLogo')"></i>
        <span>Muzikay<span class="trademark">®</span></span>
      </div>

      <div class="nav-media-stayers">
        <div class="main-nav">
          <div class="home-nav">
<<<<<<< HEAD
            <RouterLink
              to="/station/collection"
              exact
              :class="{ active: $route.path === '/station/collection' }"
            >
=======
            <RouterLink to="/station/collection">
>>>>>>> 59360f058ff4f3a603e7dbeae52f3b5e0f32e161
              <i class="home-icon icons" v-html="getSvg('homeIcon')"></i>
              Home
            </RouterLink>
          </div>

<<<<<<< HEAD
          <RouterLink
            to="/station/search"
            exact
            :class="{ active: $route.path === '/station/search' }"
          >
=======
          <RouterLink to="/station/search">
>>>>>>> 59360f058ff4f3a603e7dbeae52f3b5e0f32e161
            <i class="search-icon icons" v-html="getSvg('searchIcon')"></i>
            Search
          </RouterLink>

<<<<<<< HEAD
          <RouterLink
            to="/station/library"
            exact
            :class="{ active: $route.path === '/station/library' }"
          >
=======
          <RouterLink to="/station/library">
>>>>>>> 59360f058ff4f3a603e7dbeae52f3b5e0f32e161
            <i class="library-icon icons" v-html="getSvg('libraryIcon')"></i>
            Your Library
          </RouterLink>
        </div>
      </div>

      <div class="liked-create-nav">
        <a @click="createPlayList">
          <div>
            <font-awesome-icon class="plus-sign" :icon="['fas', 'plus']" />
          </div>
          Create Playlist
        </a>

<<<<<<< HEAD
        <RouterLink
          class="liked-songs"
          to="/station/like"
          :class="{ active: $route.path === '/station/like' }"
        >
=======
        <a class="liked-songs">
>>>>>>> 59360f058ff4f3a603e7dbeae52f3b5e0f32e161
          <font-awesome-icon class="heart-icon" :icon="['fas', 'heart']" />
          Liked Songs
        </a>
      </div>

      <Container
        v-bind="$attrs"
        v-on="$listeners"
        class="clean-list user-stations"
      >
        <Draggable v-for="(playlist, index) in userStations" :key="index">
          <div @click="setStation(playlist._id)">{{ playlist.name }}</div>
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
      userStationsList: [],
      playlistCounter: 0,
    }
  },
  methods: {
    onDrop(dropResult) {
      this.userStationsList = this.applyDrag(this.userStationsList, dropResult)
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult

      if (removedIndex === null && addedIndex === null) return arr

      const result = [...arr]
      const itemToAdd = result.splice(removedIndex, 1)[0]

      if (addedIndex === null) {
        result.push(itemToAdd)
      } else {
        result.splice(addedIndex, 0, itemToAdd)
      }

      return result
    },
    setStation(stationId) {
      this.$store.commit({ type: 'setCurrStation', stationId })
      this.$router.push(`/station/${stationId}`)
    },

    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    createPlayList() {
      this.playlistCounter++
      const playlistName = `My Playlist #${this.playlistCounter}`
      const station = stationService.createNewStation(playlistName)
      this.userStations.push(station)
      this.$router.push(`/station/${station._id}`)
    },
  },
  computed: {
    userStations() {
      return this.$store.getters.getUserStations
    },
  },
  created() {
    this.userStationsList = this.$store.getters.getUserStations
  },
  components: {
    FontAwesomeIcon,
    Container,
    Draggable,
  },
}
</script>
