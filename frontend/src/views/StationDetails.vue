<template>
  <section v-if="station" class="station-details">
    <section class="stetion">
      <h1 @click="toggleModal">Playlist</h1>
      <p>Playlist Relax and indulge with beautiful piano pieces</p>
      <h1>{{ station.name || stationCount }}</h1>
      <img v-if="station.songs" :src="station.songs[0].imgUrl" />
      <button v-else><svg>🎵</svg></button>
      <img
        class="spotify-img"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png"
      />
      <div v-if="station.songs">
        <span>6,950,331 likes</span>, <span>{{ songsCount }}</span>
        <span>about 11 hr </span>
      </div>
      <div v-else>...</div>
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
    <StationEdit></StationEdit>
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import StationEdit from './StationEdit.vue'
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
    }
  },

  computed: {
    songsCount() {
      const count = this.station.songs.length
      return `${count} Songs`
    },
    // updateStationName() {
    //   let editedStation = this.getStation
    //   // editedStation.name = this.nameEdited
    //   this.$store
    //     .dispatch({ type: 'editStation', station: editedStation })
    //     .then(() => {
    //       showSuccessMsg('station edited')
    //     })
    //     .catch((err) => {
    //       showErrorMsg('Cannot edit station', err)
    //     })
    // },
    // getStation() {
    //   const { stationId } = this.$route.params
    //   const stations = this.stations
    //   const station = stations.find((s) => s._id === stationId)

    //   return station
    // },

    stations() {
      return this.$store.getters.stations
    },
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
}
</script>
