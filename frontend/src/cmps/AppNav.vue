<template>
  <nav class="nav-content">
    <div class="sticky-nav">
      <div class="logo-container" @click="$router.push('/station/collection')">
        <i class="logo" v-html="getSvg('whiteLogo')"></i>
        <span>Muzikay<span class="trademark">®</span></span>
      </div>

      <div class="nav-media-stayers">
        <div class="main-nav">
          <div class="home-nav">
            <RouterLink
              to="/station/collection"
              exact
              :class="{ active: $route.path === '/station/collection' }"
            >
              <i class="home-icon icons" v-html="getSvg('homeIcon')"></i>
              Home
            </RouterLink>
          </div>

          <RouterLink
            to="/station/search"
            exact
            :class="{ active: $route.path === '/station/search' }"
          >
            <i class="search-icon icons" v-html="getSvg('searchIcon')"></i>
            Search
          </RouterLink>

          <RouterLink
            to="/station/library"
            exact
            :class="{ active: $route.path === '/station/library' }"
          >
            <i class="library-icon icons" v-html="getSvg('libraryIcon')"></i>
            Your Library
          </RouterLink>
        </div>
      </div>

      <div class="liked-create-nav">
        <a @click="createPlayList" class="btn">
          <div class="btn">
            <font-awesome-icon class="plus-sign" :icon="['fas', 'plus']" />
          </div>
          Create Playlist
        </a>

        <a class="liked-songs" @click="onClickLikedSong">
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
          <div
            :class="{ active: playlist._id === activePlaylistId }"
            @click="setStation(playlist._id)"
          >
            {{ playlist.name }}
          </div>
        </Draggable>
      </Container>
    </div>
  </nav>
</template>

<script>
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service.local.js'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faHeart,
  faCommentDollar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faHeart)

export default {
  data() {
    return {
      userStationsList: [],
      playlistCounter: 0,
      activePlaylistId: null,
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
    // setStation(stationId) {
    //   this.$store.commit({ type: 'setCurrStation', stationId })
    //   this.$router.push(`/station/${stationId}`)
    // },
    setStation(stationId) {
      this.activePlaylistId = stationId
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
    onClickLikedSong() {
      let user = userService.getLoggedinUser()
      console.log(user)

      const station = stationService.createNewStation('Liked songs')
      console.log(station)
      console.log(user)

      user = station
      console.log(user)
      // Save updated user object to local storage
      utilService.saveToStorage('loggedinUser', user)

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
