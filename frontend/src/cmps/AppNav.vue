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
              @click="toggleHomeIcon"
            >
              <i
                class="home-icon icons"
                v-if="$route.path === '/station/collection'"
                v-html="getSvg('homeIconActive')"
              ></i>
              <i class="home-icon icons" v-else v-html="getSvg('homeIcon')"></i>
              Home
            </RouterLink>
          </div>

          <RouterLink
            to="/station/search"
            exact
            :class="{ active: $route.path === '/station/search' }"
            @click="toggleSearchIcon"
          >
            <i
              class="search-icon icons"
              v-if="$route.path === '/station/search'"
              v-html="getSvg('searchIconActive')"
            ></i>
            <i
              class="search-icon icons"
              v-else
              v-html="getSvg('searchIcon')"
            ></i>
            Search
          </RouterLink>

          <RouterLink
            to="/station/library"
            exact
            :class="{ active: $route.path === '/station/library' }"
            @click="toggleLibraryIcon"
          >
            <i
              class="library-icon icons"
              v-if="$route.path === '/station/library'"
              v-html="getSvg('libraryIconActive')"
            ></i>
            <i
              class="library-icon icons"
              v-else
              v-html="getSvg('libraryIcon')"
            ></i>
            Your Library
          </RouterLink>
        </div>
      </div>

      <div class="liked-create-nav">
        <a @click="createStation" class="create-container">
          <div class="btn">
            <font-awesome-icon
              class="plus-sign icons"
              :icon="['fas', 'plus']"
            />
          </div>
          Create Playlist
        </a>

        <a class="liked-songs" @click="showLikedSongs">
          <font-awesome-icon
            class="heart-icon icons"
            :icon="['fas', 'heart']"
          />
          Liked Songs
        </a>
      </div>

      <Container @drop="onDrop" class="clean-list user-stations">
        <Draggable v-for="(station, index) in userStations" :key="index">
          <div
            class="station-nav-hover"
            :class="{ active: station._id === activeStationId }"
            @click="setStation(station._id)"
          >
            {{ station.name }}
          </div>
        </Draggable>
      </Container>
    </div>
  </nav>
</template>

<script>
// import { utilService } from '../services/util.service'
// import { userService } from '../services/user.service.local.js'
import svgService from '../services/SVG.service.js'
// import { stationService } from '../services/station.service.local.js'
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
  name: 'AppNav',
  data() {
    return {
      userStationsData: [],
      stationCounter: 0,
      activeStationId: null,
      searchIcon: 'searchIcon',
      homeIcon: 'homeIcon',
      libraryIcon: 'libraryIcon',
      counter: 0,
    }
  },
  methods: {
    onDrop(dropResult) {
      this.userStationsData = this.applyDrag(this.userStationsData, dropResult)
      this.$store.commit('updateUserStations', this.userStationsData)
    },
    applyDrag(arr, dragResult) {
      console.log('hi')
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
      this.activeStationId = stationId
      this.$store.commit({ type: 'setCurrStation', stationId })
      this.$router.push(`/station/${stationId}`)
    },
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    toggleSearchIcon() {
      this.searchIcon =
        this.searchIcon === 'searchIcon' ? 'searchIconActive' : 'searchIcon'
    },
    toggleHomeIcon() {
      this.homeIcon =
        this.homeIcon === 'homeIcon' ? 'homeIconActive' : 'homeIcon'
    },
    toggleLibraryIcon() {
      this.libraryIcon =
        this.libraryIcon === 'libraryIcon' ? 'libraryIconActive' : 'libraryIcon'
    },
    async createStation() {
      try {
        this.stationCounter++
        const StationName = `My Playlist #${this.stationCounter}`
        console.log('station name in app nav', StationName)
        await this.$store.dispatch({
          type: 'createStation',
          StationName,
        })
      } catch (err) {
        console.log('err')
      }
    },
    async showLikedSongs() {
      console.log('hi')
      console.log(this.$store.getters.getSongsLikedByUser)
      const stationId = 'likeduser123'
      const newStation = await this.$store.dispatch({
        type: 'setcurrStation',
        stationId,
      })
      console.log(newStation)
      // socketService.emit('station-added', savedStation)
      // this.$store.commit({ type: 'setCurrStation', stationId })
      this.$router.push(`/station/${stationId}`)
      // this.$store.dispatch({
      //         type: 'createStation',
      //         StationName,
      //       })
    },
  },
  computed: {
    userStations() {
      return this.$store.getters.getUserStations
    },
    // stations() {
    //   return this.$store.getters.stations
    // },
    // userStationsData() {
    //   return (this.userStationsData = this.userStations)
    // },
  },
  components: {
    FontAwesomeIcon,
    Container,
    Draggable,
  },
  watch: {
    userStations: {
      immediate: true,
      handler(newValue) {
        this.userStationsData = newValue
      },
    },
  },
}
</script>
