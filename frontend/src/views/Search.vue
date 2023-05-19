<template>
  <section v-if="!search">
    <h2 class="search-header">Browse all</h2>
    <div class="categories-container">
      <article
        @click="filterStationCategories(category.title)"
        class="category-container"
        :style="{ backgroundColor: category.color }"
        v-for="(category, idx) in categories"
        :key="idx"
      >
        <article>
          <img :src="category.img" />
          <h2>{{ category.title }}</h2>
        </article>
      </article>
    </div>
  </section>

  <section v-else class="search-results">
    <article
      class="add-songs-container song-item"
      v-for="(video, idx) in videos"
      :key="idx"
    >
      <div class="mini-search-preview">
        <img class="song-img" :src="video.url" />

        <p class="search-song-title">{{ video.title }}</p>
      </div>
      <button
        class="add-btn-song"
        ref="songButtons"
        @click="toggleSongModal($event, song, idx)"
      >
        Add
      </button>
    </article>

    <div v-if="showSongModal" @click.self="toggleSongModal(null, null)">
      <div
        class="modal-content"
        :style="{ left: modalX + 'px', top: modalY + 'px' }"
      >
        <ul class="modal-options">
          <li @click="openStationSelection">Add to playlist</li>
          <div v-show="showStationsSubMenu">
            <ul class="stations-sub-menu">
              <li
                v-for="station in userStations"
                :key="station._id"
                @click="addSongFromSearch(station._id, currSong)"
              >
                {{ station.name }}
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import { stationService } from '../services/station.service.local'
import {
  eventBus,
  showErrorMsg,
  showSuccessMsg,
} from '../services/event-bus.service.js'
export default {
  data() {
    return {
      videos: [],
      search: '',
      alive: false,
      showSongModal: false,
      showStationsSubMenu: false,
      currSong: null,
      selectedIndex: null,
    }
  },
  methods: {
    fetchVideos(title) {
      eventBus.emit('fetch-videos', title)
    },
    async addSongFromSearch(stationId, song) {
      try {
        await this.$store.dispatch({
          type: 'addToStation',
          stationId,
          song,
        })
        showSuccessMsg('Added to playlist')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add to playlist')
      } finally {
        this.showSongModal = false
        this.showStationsSubMenu = false
      }
    },
    toggleSongModal(ev, song, idx) {
      this.currSong = this.videos[idx]
      const btn = ev.target
      // Get the x and y coordinates of the button in the screen
      const { left, top, height } = btn.getBoundingClientRect()
      this.modalX = left - 200
      this.modalY = top + height - 60

      this.selectedSong = song
      this.selectedIndex = idx
      this.showSongModal = !this.showSongModal
    },
    openStationSelection() {
      this.showStationsSubMenu = !this.showStationsSubMenu
    },
    filterStationCategories(categoryName) {
      console.log('categoryName', categoryName)
      try {
        this.$router.push(`/station/collection/${categoryName}`)
      } catch (error) {
        console.error(error)
      }
    },
  },
  computed: {
    categories() {
      return this.$store.getters.searchStations
    },
    userStations() {
      return this.$store.getters.getUserStations
    },
  },
  created() {
    eventBus.on('handle-search', async (search) => {
      this.search = search
      this.alive = true
      setTimeout(async () => {
        try {
          this.videos = await stationService.getVideos(search)
        } catch (error) {
          console.error(error)
        }
        this.alive = false
      }, search.delay || 2000)
    })
  },
}
</script>
