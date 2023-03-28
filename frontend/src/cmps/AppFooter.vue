<template>
  <footer class="main-footer">

    <div class="footer-media-player">
      <MediaPlayer :station="station" @songIdx="getSongIdx" />
    </div>
    
    <div v-if="station" class="footer-details">
      <img
        class="footer-details-img"
        :src="
            station.songs[currSongIdx].imgUrl
              ? station.songs[currSongIdx].imgUrl
              : station.songs[currSongIdx].url
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

  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { eventBus } from "../services/event-bus.service.js"

export default {
  name: 'AppFooter',
  emits: ['songIdx'],
  data() {
    return {
      currSongIdx: 0,
      hover: false,
      showModal: false,
      song: null,
      alive: false,
    }
  },
  created() {
      eventBus.on('song-details', (song) => {
        // if(this.station){
        //   this.station = song
        // }else{
          this.song = song
          console.log(this.song);
        // }
        var delay = song.delay || 2000
        this.alive = true
        setTimeout(() => {
          this.alive = false
        },delay)
      } )
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
    // Add functionality
    toggleSongLike(idx) {
      // const song = this.station.songs[idx]
      console.log(song)
      console.log('liked')
      // song.liked = !song.liked
      // console.log(
      //   `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
      // )

    },
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
