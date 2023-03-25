<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
      <img
        class="footer-details-img"
        :src="currStation.songs[currSongIdx].imgUrl"
      />
      <h3>{{ station.songs[currSongIdx].title }}</h3>
      <button class="like-song-icon"><BubblingHeart/></button>
      <!-- <button>🖼</button> -->
    </div>
    <div class="footer-media-player"><MediaPlayer @songIdx="getSongIdx" /></div>
    <div class="footer-media-adjusments">
      <button>🔉</button>
    </div>
  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
// import { stationService } from '../services/station.service.local'
export default {
  name: 'AppFooter',
  emits: ['songIdx'],
  data() {
    return {
      station: null,
      currStation: null,
      currSongIdx: 0,
    }
  },
  methods: {
    getSongIdx(songIdx) {
      this.currSongIdx = songIdx
    },
  },
  watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params
        try {
          this.station = await this.$store.getters.stationById(stationId)
          this.currStation = this.station
          // console.log(station.songs[0].id);
        } catch (err) {
          console.log(err)
          throw err
        }
      },
      immediate: true,
    },
  },
  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
