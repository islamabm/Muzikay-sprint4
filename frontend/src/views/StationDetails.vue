<template>
  <section v-if="station" class="station-details">
    <section class="station-details-header">
      <img v-if="station.songs" :src="station.songs[0].imgUrl" />
      <button v-else><svg>🎵</svg></button>

      <div class="station-info">
        <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
        <h1 class="station-name">{{ station.name || stationCount }}</h1>
        <p class="station-description">
          Playlist Relax and indulge with beautiful piano pieces
        </p>
        <div v-if="station.songs">
          <div class="likes-count-logo">
            <i class="logo-green" v-html="getSvg('greenLogo')"></i>
            <span class="small-logo-word">Muzikay</span>
            <span>6,950,331 likes</span>•<span>{{ songsCount }},</span>
            <span>about 11 hr </span>
          </div>
        </div>
        <div v-else>...</div>
      </div>
    </section>
    <hr />

    <ul v-if="station.songs" class="clean-list">
      <li class="station" v-for="(song, idx) in station.songs" :key="idx">
        <span>{{ idx + 1 }}</span>
        <img :src="song.imgUrl" />
        <p>{{ song.title }}</p>
        <p>1 day ago</p>
        <p>1:40</p>
      </li>
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
    <StationEdit :showModal="showModal"></StationEdit>
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import StationEdit from './StationEdit.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
// import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  name: 'station-details',
  data() {
    return {
      station: null,
      showModal: '',
      counter: 0,
      // nameEdited: '',
      dominantColor: null,
    }
  },
  methods: {
    stationCount() {
      this.counter++
      // const count = this.station.length
      return `My Playlist #${this.counter}`
    },
    toggleModal() {
      console.log(this.showModal)
      this.showModal = !this.showModal
    },

    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    stationCount() {
      this.counter++
      // const count = this.station.length
      return `My Playlist #${this.counter}`
    },
  },
  watch: {
    '$route.params': {
      handler() {
        const { stationId } = this.$route.params
        stationService
          .getById(stationId)
          .then((station) => (this.station = station))
      },
      immediate: true,
    },
  },
  components: {
    StationEdit,
  },
  computed: {
    songsCount() {
      const count = this.station.songs.length
      return `${count} Songs`
    },
    stations() {
      return this.$store.getters.stations
    },
  },
}
</script>
