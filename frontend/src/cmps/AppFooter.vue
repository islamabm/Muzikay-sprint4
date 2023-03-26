<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
      <img
        class="footer-details-img"
        :src="station.songs[currSongIdx].imgUrl"
      />
      <h3 class="footer-details-title">
        {{ station.songs[currSongIdx].title }}
      </h3>
      <button class="like-song-icon">
        <BubblingHeart
          :songIndex="currSongIdx"
          :liked="station.songs[currSongIdx].liked"
          @toggleLike="toggleSongLike"
        />
      </button>
    </div>

    <div class="footer-media-player">
      <MediaPlayer :station="station" @songIdx="getSongIdx" />
    </div>

    <div class="footer-media-adjusments">
      <i class="speaker" v-html="getSvg('speakerBtnIcon')"></i>
      <div class="speaker-bar">
        <div class="speaker-bar-fill"></div>
      </div>
    </div>
  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import SVGService from '../services/SVG.service'

export default {
  name: 'AppFooter',
  emits: ['songIdx'],
  data() {
    return {
      // station: null,
      currSongIdx: 0,

      hover: false,
      showModal: false,
    }
  },
  computed: {
    // setStation() {
    //   this.$store.commit({ type: 'setCurrStation', stationId: this.stationId })
    // },
    station() {
      return this.$store.getters.station
    },
  },
  methods: {
    getSongIdx(songIdx) {
      this.currSongIdx = songIdx
    },
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    toggleSongLike(idx) {
      // const song = this.station.songs[idx]
      console.log(song)
      console.log('liked')
      // song.liked = !song.liked
      // console.log(
      //   `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
      // )
      // Add functionality
    },
  },
  // watch: {
  //   '$route.params': {
  //     async handler() {
  //       const { stationId } = this.$route.params
  //       try {
  //         this.station = await this.$store.getters.stationById(stationId)
  //         console.log(this.station);
  //       } catch (err) {
  //         console.log(err)
  //         throw err
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
