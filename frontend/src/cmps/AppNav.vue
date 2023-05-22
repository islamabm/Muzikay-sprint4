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
        <Draggable v-for="(station, index) in stations" :key="index">
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
  <GuestMoodModal
    v-if="showGuestModeModal"
    @startGuestMode="handleStartGuestMode"
    @closeModal="handleShowModal"
  ></GuestMoodModal>
</template>

<script>
import svgService from '../services/SVG.service.js'
import GuestMoodModal from './GuestMoodModal.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faHeart,
  faCommentDollar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { utilService } from '../services/util.service'
import { eventBus } from '../services/event-bus.service'
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
      showGuestModeModal: false,
      stations: [],
    }
  },
  methods: {
    onDrop(dropResult) {
      this.userStationsData = this.applyDrag(this.userStationsData, dropResult)
      this.$store.commit('updateUserStations', this.userStationsData)
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
    updateStations() {
      this.stations = this.$store.getters.getUserStations
    },
    async handleStartGuestMode() {
      const userCred = {
        username: 'guest',
        password: utilService.makeId(),
        fullname: `Guest`,
        imgUrl: '',
        stations: [],
        LikedSongs: [],
      }
      try {
        await this.$store.dispatch({
          type: 'signupGuest',
          userCred,
        })
        console.log('userCred', userCred)
        console.log(
          'this.$store.getters.loggedinUser',
          this.$store.getters.loggedinUser
        )
      } catch (err) {
        console.log('err')
      } finally {
        location.reload()
        this.showGuestModeModal = false
      }
    },
    handleShowModal() {
      this.showGuestModeModal = false
    },
    // setStation(stationId) {
    //   this.$store.commit({ type: 'setCurrStation', stationId })
    //   this.$router.push(`/station/${stationId}`)
    // },
    async setStation(stationId) {
      console.log('stationId', stationId)

      // const station = this.userStations.find((s) => s._id === stationId)
      // if (station.name === 'Liked songs') console.log('hi')

      this.activeStationId = stationId
      await this.$store.dispatch({ type: 'setcurrStation', stationId })
      console.log('hi')
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
      console.log(
        'this.$store.getters.loggedinUser',
        this.$store.getters.loggedinUser
      )
      const user = this.$store.getters.loggedinUser
      console.log('user', user)
      if (!user) this.showGuestModeModal = true
      try {
        this.stationCounter++
        const StationName = `My Playlist #${this.stationCounter}`
        const newStation = await this.$store.dispatch({
          type: 'createStation',
          StationName,
        })
      } catch (err) {
        console.log('err')
      }
    },
    async showLikedSongs() {
      await this.setStation('6466c0bf5aa2c46190c54046')
    },
  },
  computed: {
    userStations() {
      this.stations = this.$store.getters.getUserStations
      return this.stations
    },
  },
  created() {
    eventBus.on('user-logged-in', this.updateStations)
  },

  // stations() {
  //   return this.$store.getters.stations
  // },
  // userStationsData() {
  watch: {
    userStations: {
      immediate: true,
      handler(newValue) {
        this.userStationsData = newValue
      },
    },
  },
  //   return (this.userStationsData = this.userStations)
  // },
  components: {
    FontAwesomeIcon,
    Container,
    Draggable,
    GuestMoodModal,
  },
}
</script>
