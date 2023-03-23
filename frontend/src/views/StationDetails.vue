<template>
  <section v-if="station" class="station-details">
    <section ref="stationDetailsHeader" class="station-details-header">
      <img
        v-if="station.songs && station.songs.length > 0"
        :src="station.songs[0].imgUrl"
      />
      <button v-else><svg>🎵</svg></button>

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
    <hr />

    <Search />

    <ul v-if="station.songs" class="clean-list songs-list-details">
      <li class="station" v-for="(song, idx) in station.songs" :key="idx">
        <span>{{ idx + 1 }}</span>
        <img class="song-img" :src="song.imgUrl" />
        <p class="song-title">{{ song.title }}</p>
        <button @click="removeSong(song.id, station._id)">x</button>
        <p class="posted-at">1 day ago</p>
        <p class="song-duration">1:40</p>
      </li>
    </ul>

    <!-- <section v-else class="empty-station-content">
      <button>x</button>
      <div>
        <h3>Let's find something for your playlist</h3>
        <input type="text" placeholder="Search for songs or episodes" />
      </div>
    </section> -->
  </section>
  <section v-if="showModal">
    <StationEdit :showModal="showModal"></StationEdit>
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
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

    updateHeaderBackgroundColor(color) {
      this.$refs.stationDetailsHeader.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    },
    async getDominantColor(imageSrc) {
      const fac = new FastAverageColor()
      const img = new Image()
      img.crossOrigin = 'Anonymous'

      // Prefix the image URL with the CORS proxy URL
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
      img.src = corsProxyUrl + imageSrc

      img.onload = async () => {
        try {
          const color = await fac.getColorAsync(img)
          this.updateHeaderBackgroundColor(color)
        } catch (e) {
          console.error(e)
        }
      }
    },
    async removeSong(songId, stationId) {
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
      console.log('alo')
      this.showModal = !this.showModal
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
          const station = await stationService.getById(stationId)
          this.station = station
          if (station.songs && station.songs.length > 0) {
            // maybe remove after && after 11pm we dont delete anything
            this.getDominantColor(station.songs[0].imgUrl)
          }
        } catch (err) {
          console.log(err)
        }
      },
      immediate: true,
    },
  },
  computed: {
    songsCount() {
      const count = this.station.songs.length
      return `${count} Songs`
    },
    stations() {
      return this.$store.getters.stations
    },
    stationCount() {
      this.counter++

      return `My Playlist #${this.counter}`
    },
  },
  components: {
    StationEdit,
    Search,
  },
}
</script>
