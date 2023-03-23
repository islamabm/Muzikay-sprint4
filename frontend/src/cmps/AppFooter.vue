<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
      <img class="footer-details-img" :src=" station[0].imgUrl">
      <h3>{{ station[0].title }}</h3>
      <button>💚</button>
      <button>🖼</button>
    </div>
    <div class="footer-media-player"><FooterPlayer :station="station" /></div>
    <div class="footer-media-adjusments">
      <button>🎤</button>
      <button>orgenize</button>
      <button>💻</button>
      <button>🔉</button>
    </div>
  </footer>
</template>

<script>
import FooterPlayer from './FooterPlayer.vue'
import { stationService } from '../services/station.service.local'
export default {
  name: 'AppFooter',
  props: [],
  data() {
    return {
      station: null
    }
  },
  created() {
    this.$store.dispatch({ type: 'loadStations' })
    this.station = this.stations
  },
  watch: {
    '$route.params': {
     async handler() {
        const { stationId } = this.$route.params
        const station = await stationService.getById(stationId)
        try {
          this.station = station.songs
          return this.station
        }
        catch (err) {
          console.log(err);
        }
      },
      immediate: true,
    },
  },
  computed: {
    stations() {
      // console.log(this.$store.getters.stations[0].songs[0].imgUrl);
      // this.song = {
      // img: this.$store.getters.stations[0].songs[0].imgUrl,
      // title: this.$store.getters.stations[0].songs[0].title
      // }
      //   return this.$store.getters.stations[0].songs[0].imgUrl
      // return this.song
    },
  },
  components: {
    FooterPlayer,
  },
}
</script>
