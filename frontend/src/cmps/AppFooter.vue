<template>
  <footer class="main-footer">
    <div v-if="station" class="footer-details">
      <img
        class="footer-details-img"
        :src="
            station.songs[0].imgUrl
              ? station.songs[0].imgUrl
              : station.songs[0].url
          "
      />
      <h3 class="footer-details-title">
        {{ station.songs[currSongIdx].title }}
      </h3>
      <button class="footer-like">
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

  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
// import SVGService from '../services/SVG.service'

export default {
  name: 'AppFooter',
  emits: ['songIdx'],
  data() {
    return {
      currSongIdx: 0,
      // speakerLevel: 50,
      hover: false,
      showModal: false,
    }
  },
  computed: {
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
    // setSpeakerLevel(level) {
    // this.speakerLevel = level
    // },
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
