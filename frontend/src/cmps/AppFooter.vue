<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
      <img class="footer-details-img" :src="station.songs[0].imgUrl">
      <h3>{{ station.songs[0].title }}</h3>
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
  data() {
    return {
      station: null
    }
  },
  created() {
    this.$store.dispatch({ type: 'loadStations' })
  },
  watch: {
    '$route.params': {
     async handler() {
        const { stationId } = this.$route.params
        const station = await stationService.getById(stationId)
        console.log(station);
        try {
          this.station = station
        }
        catch (err) {
          console.log(err);
        }
      },
      immediate: true,
    },
  },
  components: {
    FooterPlayer,
  },
}
</script>
