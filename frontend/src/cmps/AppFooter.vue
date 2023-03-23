<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
<<<<<<< HEAD
      <img class="footer-details-img" :src="station.songs[0].imgUrl">
      <h3>{{ station.songs[0].title }}</h3>
=======
      <img class="footer-details-img" :src="station[0].imgUrl" />
      <h3>{{ station[0].title }}</h3>
>>>>>>> 635248b7ee1704d979a8ae3c76cf9223b52ad0cb
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
<<<<<<< HEAD
      station: null
=======
      station: null,
>>>>>>> 635248b7ee1704d979a8ae3c76cf9223b52ad0cb
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
<<<<<<< HEAD
          this.station = station
        }
        catch (err) {
          console.log(err);
=======
          this.station = station.songs
          return this.station
        } catch (err) {
          console.log(err)
>>>>>>> 635248b7ee1704d979a8ae3c76cf9223b52ad0cb
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
