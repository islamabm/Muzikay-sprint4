<template>
  <section v-if="station" class="station-details">
    <section ref="stationDetailsHeader" class="station-details-header">
      <img
        v-if="station.songs && station.songs.length > 0"
        :src="station.songs[0].imgUrl"
      />
      <img class="deafult-image" v-else src="../assets/img/empty-img.png" />

      <div class="station-info">
        <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
        <h1 class="station-name">{{ station.name }}</h1>

        <p class="station-description" @click="toggleModal">
          Playlist Relax and indulge with beautiful piano pieces
        </p>
        <div v-if="station.songs">
          <div class="likes-count-logo">
            <i class="logo-green" v-html="getSvg('greenLogo')"></i>
            <span class="small-logo-word">Muzikay</span>
            <span @click="toggleModal">6,950,331 likes</span>•<span
              >{{ songsCount }},</span
            >

            <span>about 11 hr </span>
          </div>
        </div>
        <div v-else>...</div>
      </div>
    </section>


    <ul v-if="station.songs" class="clean-list songs-list-details">
      <li class="station" v-for="(song, idx) in station.songs" :key="idx">
        <span>{{ idx + 1 }}</span>
        <img class="song-img" :src="song.imgUrl" />
        <p class="song-title">{{ song.title }}</p>
        <button
          @click="removeSong(song.videoId, station._id)"
          v-if="station.createdBy.fullname === 'guest'"
        >
          x
        </button>
        <p class="posted-at">1 day ago</p>
        <p class="song-duration">1:40</p>
      </li>
      <MiniSearch />
    </ul>

    <section v-else class="empty-station-content">
      <button>x</button>
      <div>
        <h3>Let's find something for your playlist</h3>
        <input type="text" placeholder="Search for songs or episodes" />
      </div>
    </section>
  </section>
  <section v-if="showModal">
    <StationEdit
      :showModal="showModal"
      @close="showModal = false"
    ></StationEdit>
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import MiniSearch from '../cmps/MiniSearch.vue'

export default {
  name: 'station-details',
  data() {
    return {
      station: null,
      showModal: '',
      counter: 0,
      dominantColor: null,
    }
  },
  methods: {
    // need to be fixed - permisson to photos?

    updateBodyBackgroundColor(color) {
      const gradient = `linear-gradient(to bottom, ${color.rgba}, #000)`
      document.body.style.backgroundImage = gradient
      this.$refs.stationDetailsHeader.style.backgroundColor = color.rgb
    },

    async getDominantColor(imageSrc) {
      const fac = new FastAverageColor()
      const img = new Image()
      img.crossOrigin = 'Anonymous'

      // Replace the CORS Anywhere proxy URL with a different one
      const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest='
      img.src = corsProxyUrl + encodeURIComponent(imageSrc)

      img.onload = async () => {
        console.log('Image loaded')
        try {
          const color = await fac.getColorAsync(img)
          console.log('inside try', color)
          this.updateBodyBackgroundColor(color)
        } catch (e) {
          console.error(e)
        }
      }
    },

    async removeSong(songId, stationId) {
      console.log('atationDetails', songId)
      console.log('stationDetails', stationId)
      try {
        // const station = this.stations.find((s) => s._id === stationId)
        await this.$store.dispatch({ type: 'removeSong', songId, stationId })
        showSuccessMsg('song removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove song')
      }
    },
    toggleModal() {
      if (this.station.createdBy.fullname === 'guest') {
        this.showModal = !this.showModal
      } else {
        console.log('not user data')
      }
    },

    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
  },
  watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params
        try {
          this.station = await stationService.getById(stationId)
          // this.station = await this.$store.getters.stationById(stationId)
          // console.log(this.station)
          if (this.station.songs && this.station.songs.length > 0) {
            // maybe remove after && after 11pm we dont delete anything
            this.getDominantColor(this.station.songs[0].imgUrl)
          }
        } catch (err) {
          console.log(err)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    songsCount() {
      //this 'songs' word should be dynamic, in case we might wanna translate it
      const count = this.station.songs.length
      return `${count} Songs`
    },
    stations() {
      return this.$store.getters.stations
    },

    stationCount() {
      //computed can't do this
      this.counter++

      return `My Playlist #${this.counter}`
    },
  },
  components: {
    StationEdit,
    Search,
    MiniSearch,
  },
  beforeUnmount() {
    document.body.style.background = '#181818'
  },
}
</script>

<!-- <Search /> -->

<!-- <ul
      v-if="station.songs"
      class="clean-list songs-list-details"
      @dragover.prevent
      @drop="onDrop"
    >
      <li
        class="station"
        v-for="(song, idx) in station.songs"
        :key="idx"
        draggable="true"
        @dragstart="onDragStart(song, idx)"
      >
        <span>{{ idx + 1 }}</span>
        <img class="song-img" :src="song.imgUrl" />
        <p class="song-title">{{ song.title }}</p>
        <button
          @click="removeSong(song.videoId, station._id)"
          v-if="station.createdBy.fullname === 'guest'"
        >
          x
        </button>
        <p class="posted-at">1 day ago</p>
        <p class="song-duration">1:40</p>
      </li>
    </ul> -->
